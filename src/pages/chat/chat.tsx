import { useState, useRef } from "react";
import { generateContent } from "../generateAiContent/genAi";
import upload from "../../assets/upload.png";
import Account from "./account";

import SubmitIcon from "@mui/icons-material/ArrowUpward";

interface messageInterface {
  question: string;
  answer: string;
}

const Chat = () => {
  const [input, setInput] = useState<string>("");

  const [content, setContent] = useState<messageInterface[]>([]);

  const [memory, setMemory] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      if (!(s[i] === " " || s[i] === "\n" || s[i] === "\t")) {
        return false;
      }
    }
    return true;
  };

  const updateContent = async () => {
    if (isEmpty(input)) {
      return;
    }
    let tempContent = content;
    tempContent.push({
      question: input,
      answer: "",
    });
    const len = tempContent.length;
    setContent(tempContent);

    setMemory(memory + "me: " + input + "\n");
    //const answer = await generateContent(memory);
    const answer = await generateContent(input);
    setMemory(memory + "you: " + answer + "\n");

    tempContent[len - 1].answer = answer;
    setContent(tempContent);
  };

  const clearInput = () => {
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const message = (messageData: messageInterface, index: number) => {
    return (
      <div className=" flex flex-col gap-[1.5rem]" key={index}>
        <div className=" text-right">
          <div>User</div>
          <div>{messageData.question}</div>
        </div>

        <div>
          <div className="">AI</div>
          {messageData.answer === "" ? (
            <div className=" animate-pulse">loading...</div>
          ) : (
            //parc data
            <div>{messageData.answer}</div>
          )}
        </div>

        <div className=" w-full h-[2px] bg-white"></div>
      </div>
    );
  };

  return (
    <div className=" h-screen w-full">
      <Account classname=" fixed right-0 p-[1rem]"></Account>
      <div className=" h-screen w-full flex flex-col gap-[1rem] pb-[10rem] pt-[6rem] pl-16 pr-16 overflow-y-auto ">
        {content.map(message)}
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
