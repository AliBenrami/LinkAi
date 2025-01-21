import { useState, useRef, useEffect } from "react";
import Account from "./account";

import SubmitIcon from "@mui/icons-material/ArrowUpward";
import { LoginCheck, supabase } from "../supabase";
import { model } from "../generateAiContent/genAi"; // Adjust the import path as needed
import { ChatSession } from "@google/generative-ai";

export interface messageInterface {
  question: string;
  answer: string;
}
const Chat = () => {
  const [update, setUpdate] = useState(0);

  const [loading, setLoading] = useState(true);

  const [input, setInput] = useState<string>("");

  const [content, setContent] = useState<messageInterface[]>([]);

  //const [memory, setMemory] = useState("");

  const [canUse, setcanUse] = useState(false);

  const [chat, setchat] = useState<ChatSession>(model.startChat()); // start out with an empty chat

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatboxRef = useRef<HTMLDivElement>(null);

  update;

  useEffect(() => {
    const LoginRestriction = async () => {
      setcanUse(await LoginCheck(null, "/login"));
    };

    const getContentFromBackend = async () => {
      let { data: AIConvo, error } = await supabase
        .from("AIConvo")
        .select("messages");

      if (error) {
        console.log("error grabing content");
        return;
      }

      setContent((AIConvo ?? [])[0].messages);
    };

    const awaitChat = async () => {
      const getContentFromBackend = async () => {
        let { data: AIConvo, error } = await supabase
          .from("AIConvo")
          .select("messages");

        if (error) {
          console.log("error grabing content");
          return [];
        }
        return (AIConvo ?? [])[0].messages;
      };

      const convertContentToHistory = (Content: messageInterface[]) => {
        let l = [];

        for (let i = 0; i < Content.length; i++) {
          const element = Content[i];
          l.push({
            role: "user",
            parts: [{ text: element.question }],
          });
          l.push({
            role: "model",
            parts: [{ text: element.answer }],
          });
        }
        return l;
      };

      //set chat to what every is in the backend
      const chatlocal = model.startChat({
        history: convertContentToHistory(await getContentFromBackend()),
      });
      setchat(chatlocal);
    };

    LoginRestriction();
    getContentFromBackend();
    // setTimeout(() => {
    //   setLoading(false);
    // }, 0);
    setLoading(false);
    awaitChat();
  }, []);

  const pushContentFromFrontend = async (tempContent: messageInterface[]) => {
    const { data, error } = await supabase
      .from("AIConvo")
      .upsert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          messages: tempContent,
        },
      ])
      .select();
    data;
    if (error) {
      console.log("error inserting content");
      return;
    }
  };

  const isEmpty = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      if (!(s[i] === " " || s[i] === "\n" || s[i] === "\t")) {
        return false;
      }
    }
    return true;
  };

  const updateContent = async () => {
    if (isEmpty(input) || !canUse) {
      chatboxRef.current?.scroll({ top: 0, behavior: "smooth" });
      return;
    }
    let tempContent = content;
    tempContent.push({
      question: input,
      answer: "",
    });
    const len = tempContent.length;
    //setContent(tempContent);

    //setMemory(memory + "me: " + input + "\n");
    const answer = await chat.sendMessageStream(input);
    //const answer = await generateContent(input);

    //setMemory(memory + "you: " + answer + "\n");
    let result = "";
    for await (const chunk of answer.stream) {
      const chunkText = chunk.text();
      result += chunkText;
      tempContent[len - 1].answer = result;
      setUpdate(Math.random());
      setContent(tempContent);
    }
    tempContent[len - 1].answer = result;

    //tempContent[len - 1].answer = answer.response.text();
    setContent(tempContent);
    pushContentFromFrontend(tempContent);
    chatboxRef.current?.scroll({ top: 0, behavior: "smooth" });
  };

  const clearInput = () => {
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const message = (messageData: messageInterface, index: number) => {
    return (
      <div className=" flex flex-col" key={index}>
        <div className=" text-right p-[2rem]">
          <div>User</div>
          <div>{messageData.question ?? ""}</div>
        </div>

        <div className="pb-[2rem]">
          <div className="">AI</div>
          {messageData.answer === "" ? (
            <div className=" animate-pulse">loading...</div>
          ) : (
            //parc data
            <div>{messageData.answer ?? ""}</div>
          )}
        </div>

        <div className=" w-full h-[2px] bg-white "></div>
      </div>
    );
  };

  const parseText = (messageData: messageInterface) => {
    let text = messageData.answer;

    const lines = text.split("\n");
    const parsed: { type: string; content: string; closed?: boolean }[] = [];

    lines.forEach((line) => {
      if (line.startsWith("#")) {
        // Heading (Markdown style)
        const match = line.match(/^#+/);
        const level = match ? match[0].length : 0;
        parsed.push({ type: `h${level}`, content: line.slice(level).trim() });
      } else if (/^\d+\./.test(line)) {
        // Numbered list
        parsed.push({ type: "ol-item", content: line });
      } else if (/^[-*]\s/.test(line)) {
        // Unordered list
        parsed.push({ type: "ul-item", content: line.slice(2).trim() });
      } else if (/^```/.test(line)) {
        // Code block delimiter
        const isCodeOpen =
          parsed.length && parsed[parsed.length - 1].type === "code";
        if (isCodeOpen) {
          parsed[parsed.length - 1].closed = true;
        } else {
          parsed.push({ type: "code", content: "", closed: false });
        }
      } else if (
        parsed.length &&
        parsed[parsed.length - 1].type === "code" &&
        !parsed[parsed.length - 1].closed
      ) {
        // Inside code block
        parsed[parsed.length - 1].content += line + "\n";
      } else {
        // Regular paragraph
        parsed.push({ type: "p", content: line.trim() });
      }
    });

    return parsed;
  };
  //idk how this works fully
  const RenderParsedText = ({
    parsedContent,
  }: {
    parsedContent: { type: string; content: string; closed?: boolean }[];
  }) => {
    return (
      <div>
        {parsedContent.map((item, index) => {
          switch (item.type) {
            case "h1":
              return (
                <h1 key={index} className="text-2xl font-bold">
                  {item.content}
                </h1>
              );
            case "h2":
              return (
                <h2 key={index} className="text-xl font-semibold">
                  {item.content}
                </h2>
              );
            case "ul-item":
              return (
                <li key={index} className="list-disc ml-5">
                  {item.content}
                </li>
              );
            case "ol-item":
              return (
                <li key={index} className="list-decimal ml-5">
                  {item.content}
                </li>
              );
            case "code":
              return (
                <pre key={index} className="bg-gray-800 text-white p-4 rounded">
                  <code className="whitespace-normal ">{item.content}</code>
                </pre>
              );
            case "p":
            default:
              return (
                <p key={index} className="mb-4">
                  {item.content}
                </p>
              );
          }
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className=" animate-pulse  h-screen w-full">
        <Account classname=" fixed right-0 p-[2rem]"></Account>
        {/* [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hide the scrollbar for the user */}
        <div className=" animate-pulse flex flex-col-reverse h-screen w-full gap-[1rem] pb-[10rem] pt-[6rem] pl-16 pr-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
          <div className="">{[].map(message)}</div>
        </div>
        <div
          className={
            " absolute flex gap-[25px] bottom-[2rem] h-[5rem] justify-center items-center w-[-webkit-fill-available]" +
            " w-[-moz-available]"
          }
        >
          <textarea className=" w-[50%] p-4 rounded-md resize-none"></textarea>
          <button className=" w-[76px] h-[76px] rounded-[.5cm] flex justify-center items-center">
            <SubmitIcon className=" w-3/4 h-3/4"></SubmitIcon>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" h-screen w-full">
      <Account classname=" fixed right-0 p-[2rem]"></Account>
      {/* [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hide the scrollbar for the user */}
      <div
        ref={chatboxRef}
        className="flex flex-col-reverse h-screen w-full gap-[1rem] pb-[10rem] pt-[6rem] pl-16 pr-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] "
      >
        <div className="">
          {content.map(parseText).map((parsedContent, index) => (
            <>
              <div className=" flex flex-col" key={index}>
                <div className=" flex flex-col gap-5 text-right p-[2rem]">
                  <div>User</div>
                  <div>{content[index].question ?? ""}</div>
                </div>

                <div className=" flex flex-col gap-5 pb-[2rem] w-[99%]">
                  <div className="">AI</div>
                  <RenderParsedText key={index} parsedContent={parsedContent} />
                </div>

                <div className=" w-full h-[2px] bg-white "></div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div
        className={
          " absolute flex gap-[25px] bottom-[2rem] h-[5rem] justify-center items-center w-[-webkit-fill-available]" +
          " w-[-moz-available] "
        }
      >
        <textarea
          ref={inputRef}
          className=" w-[50%] p-4 rounded-md resize-none"
          onChange={(e) => {
            setInput(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              updateContent();
              clearInput();
            }
          }}
          onKeyUp={(e) => {
            if (e.key == "Enter") {
              clearInput();
            }
          }}
        ></textarea>
        <button
          className=" w-[76px] h-[76px] rounded-[.5cm] flex justify-center items-center"
          onClick={() => {
            updateContent();
            clearInput();
          }}
        >
          <SubmitIcon className=" w-3/4 h-3/4"></SubmitIcon>
        </button>
      </div>
    </div>
  );
};

export default Chat;
