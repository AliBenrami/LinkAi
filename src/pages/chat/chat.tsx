import { useState, useRef, useEffect } from "react";

import SubmitIcon from "@mui/icons-material/ArrowUpward";
import { LoginCheck, supabase } from "../supabase";
import { model } from "../generateAiContent/genAi"; // Adjust the import path as needed
import { ChatSession } from "@google/generative-ai";
import { messageInterface } from "./parser";
import { pushContentFromFrontend } from "./app";

const Chat = ({
  content,
  contentList,
  setContentList,
  index,
  setUpdate,
}: {
  content: messageInterface[];
  contentList: messageInterface[][];
  setContentList: any;
  index: number;
  setUpdate: any;
}) => {
  const [input, setInput] = useState<string>("");

  const [canUse, setcanUse] = useState(false);

  const [chat, setchat] = useState<ChatSession>(model.startChat()); // start out with an empty chat

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const LoginRestriction = async () => {
      setcanUse(await LoginCheck(null, "/login"));
    };

    const awaitChat = async () => {
      //set chat to what every is in the backend
      const chatlocal = model.startChat({
        history: [],
      });
      setchat(chatlocal);
    };

    LoginRestriction();
    awaitChat();
  }, []);

  useEffect(() => {}, [content]);

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
      role: "user",
      parts: [{ text: input }],
    });

    const len = tempContent.length;

    tempContent.push({
      role: "ai",
      parts: [{ text: "" }],
    });
    const answer = await chat.sendMessageStream(input);

    let result = "";
    let tempContentList = contentList;
    for await (const chunk of answer.stream) {
      const chunkText = chunk.text();
      result += chunkText;
      tempContent[len].parts[0].text = result;
      tempContentList[index] = tempContent;

      setContentList(tempContentList);
      setUpdate(Math.random());
    }
    tempContent[len].parts[0].text = result;
    tempContentList[index] = tempContent;
    setContentList(tempContentList);
    pushContentFromFrontend(tempContentList);
    chatboxRef.current?.scroll({ top: 0, behavior: "smooth" });
  };

  const LineSplit = () => {
    return <div className=" w-full h-[1px] bg-white"></div>;
  };

  const clearInput = () => {
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className=" h-screen w-screen">
      {/* [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hide the scrollbar for the user */}
      <div
        ref={chatboxRef}
        className="flex flex-col-reverse h-screen w-full gap-[1rem] pb-[10rem] pt-[6rem] pl-16 pr-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] "
      >
        <div className="">
          {content.map((x: messageInterface, index: number) => {
            return (
              <div className=" flex flex-col gap-4 p-4" key={index}>
                <div className=" flex flex-col gap-4 p-4">
                  <div className=" text-2xl">{x.role}</div>
                  <div className=" text-xl">{x.parts[0].text}</div>
                </div>

                <LineSplit></LineSplit>
              </div>
            );
          })}
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
