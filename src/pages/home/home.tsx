import { useEffect, useState } from "react";
import RoboPNG from "../../assets/robo.png";
import Nav from "../nav";
import Footer from "../footer";
import { generateContent } from "../generateAiContent/genAi";

useState;

interface contentType {
  title: string;
  description: string;
}

const Home = () => {
  const [content, setContent] = useState<contentType>();
  const [loaded, setLoaded] = useState<boolean>(false);
  //const [textbody, setTextBody] = useState<string>();
  const [prompt, setPrompt] = useState<string>();
  const [context, setContext] = useState("");

  useEffect(() => {
    const newContent: contentType = {
      title: "LinkAI",
      description: "The Chatbot Of The Future",
    };
    setContent(newContent);

    if (loaded) {
      let newTextBody = async () => {
        let temp = await generateContent(context + "\nuser:" + (prompt ?? ""));
        setContext(context + "\nuser:" + prompt + "\nai:" + temp);
        setPrompt("");
        //setTextBody(temp);
        //console.log(temp);
        setLoaded(false);
      };
      setTimeout(() => {
        newTextBody();
      }, 1000);
    }
  }, [loaded]);

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-950 to-violet-950 fixed top-0 bottom-0 right-0 left-0 m-auto w-auto h-[100%] -z-50"></div>

      <Nav></Nav>
      <div className=" min-h-40"></div>
      <div className=" flex flex-row justify-center items-center gap-16">
        <div className=" flex flex-col gap-4">
          <div className=" text-7xl">{content?.title}</div>
          <div className=" text-3xl">{content?.description}</div>
        </div>
        <a href="/chat">
          <img className=" w-64 h-64" src={RoboPNG}></img>
        </a>
      </div>

      {/* <div className="flex flex-row h-20 items-center justify-center gap-3">
        <input
          type="text"
          className=" resize-none"
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            if (loaded) {
              return;
            }
            setLoaded(true);
          }}
        >
          submit
        </button>
      </div>

      <div className=" justify-center items-center m-auto w-10/12 p-9">
        {!loaded ? (
          <div className=" text-xl">{textbody}</div>
        ) : (
          <h1 className=" animate-pulse">loading...</h1>
        )}
      </div> */}

      <Footer />
    </div>
  );
};

export default Home;
