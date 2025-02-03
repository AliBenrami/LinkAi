import Chat from "./chat";
import SideBar from "./sidebar";
import Account from "./account";
import { useEffect, useState } from "react";
import { messageInterface } from "./parser";
import { supabase } from "../supabase";

export const pushContentFromFrontend = async (
  tempContent: messageInterface[][]
) => {
  const { data, error } = await supabase
    .from("AIConvo")
    .upsert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        messages: { content: tempContent },
      },
    ])
    .select();
  data;

  if (error) {
    console.log("error inserting content");
    return;
  }
};

const App = () => {
  const [currentChatIndex, setCurrentChatIndex] = useState<number | null>(null);
  const [numberOfChats, setNumberOfChats] = useState<number>(0);
  const [contentList, setContentList] = useState<messageInterface[][]>([]);

  const [update, setUpdate] = useState(0);

  update;

  useEffect(() => {
    const getContentFromBackend = async () => {
      let { data, error } = await supabase.from("AIConvo").select("messages");

      if (error) {
        console.log("error grabing content");
      }
      if (data === null) {
        return;
      }

      let LocalContent: messageInterface[][] = data[0].messages.content;
      setContentList(LocalContent);
      setNumberOfChats(LocalContent.length);
    };

    getContentFromBackend();
  }, []);

  const addChat = () => {
    setNumberOfChats(numberOfChats + 1);
    let tempContentList = contentList;
    tempContentList.push([]);
    setContentList(tempContentList);
    pushContentFromFrontend(tempContentList);
  };
  const subChat = () => {
    if (currentChatIndex === contentList.length - 1) setCurrentChatIndex(null);
    setNumberOfChats(numberOfChats - 1);
    let tempContentList = contentList;
    tempContentList.splice(tempContentList.length - 1, 1);
    setContentList(tempContentList);
    pushContentFromFrontend(tempContentList);
  };

  return (
    <div className=" flex flex-row w-screen h-screen">
      <Account classname=" fixed right-0 p-[2rem]"></Account>
      <SideBar
        currentChatIndex={currentChatIndex}
        setChatIndex={setCurrentChatIndex}
        numberOfChats={numberOfChats}
        addChat={addChat}
        subChat={subChat}
      ></SideBar>
      {0 < numberOfChats && currentChatIndex !== null ? (
        <Chat
          content={contentList[currentChatIndex]}
          contentList={contentList}
          setContentList={setContentList}
          index={currentChatIndex}
          setUpdate={setUpdate}
        ></Chat>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
