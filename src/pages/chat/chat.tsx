import { useState, useRef, useEffect } from "react";
import { generateContent } from "../generateAiContent/genAi";
import Account from "./account";

import SubmitIcon from "@mui/icons-material/ArrowUpward";
import { LoginCheck, supabase } from "../supabase";

interface messageInterface {
  question: string;
  answer: string;
}
const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<string>("");

  const [content, setContent] = useState<messageInterface[]>([]);

  const [memory, setMemory] = useState("");

  const [canUse, setcanUse] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatboxRef = useRef<HTMLDivElement>(null);

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

    LoginRestriction();
    getContentFromBackend();
    // setTimeout(() => {
    //   setLoading(false);
    // }, 0);
    setLoading(false);
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

    setMemory(memory + "me: " + input + "\n");
    //const answer = await generateContent(memory);
    const answer = await generateContent(input);
    setMemory(memory + "you: " + answer + "\n");

    tempContent[len - 1].answer = answer;
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

  if (loading) {
    return (
      <div className=" animate-pulse  h-screen w-full">
        <Account classname=" fixed right-0 p-[2rem]"></Account>
        {/* [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hide the scrollbar for the user */}
        <div className=" animate-pulse flex flex-col-reverse h-screen w-full gap-[1rem] pb-[10rem] pt-[6rem] pl-16 pr-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
          <div className="">{[].map(message)}</div>
        </div>
        <div className=" absolute flex gap-[25px] bottom-[2rem] h-[5rem] justify-center items-center w-[-webkit-fill-available] w-[-moz-available] ">
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
        <div className="">{content.map(message)}</div>
      </div>
      <div className=" absolute flex gap-[25px] bottom-[2rem] h-[5rem] justify-center items-center w-[-webkit-fill-available] w-[-moz-available] ">
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
