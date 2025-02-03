import { Button } from "@mui/material";
import { useState } from "react";

const ChatButton = (
  content: any,
  chatIndex: number,
  currentChatIndex: number | null,
  setChatIndex: any
) => {
  if (currentChatIndex === chatIndex) {
    return (
      <Button
        className=" w-64 h-16"
        onClick={() => {
          setChatIndex(chatIndex);
        }}
        key={chatIndex}
        variant="contained"
        disabled
      >
        {content}
      </Button>
    );
  }

  return (
    <div className=" flex flex-row w-64 h-16">
      <Button
        className=" w-64 h-16"
        onClick={() => {
          setChatIndex(chatIndex);
        }}
        key={chatIndex}
        variant="contained"
        color="info"
      >
        {content}
      </Button>
    </div>
  );
};
const SideBar = ({
  currentChatIndex,
  setChatIndex,
  numberOfChats,
  addChat,
  subChat,
}: {
  currentChatIndex: number | null;
  setChatIndex: any;
  numberOfChats: number;
  addChat: any;
  subChat: any;
}) => {
  const [isSidebarClosed, setSidebarClosed] = useState(false);
  const chatButtons = Array.from(
    { length: numberOfChats },
    (_, index) => "Chat " + (index + 1)
  );

  return (
    <div className=" flex flex-col h-screen items-center bg-gray-600 p-10 gap-4 overflow-y-auto overflow-x-hidden rounded-xl">
      <Button
        className="w-16"
        variant="text"
        onClick={() => {
          setSidebarClosed(!isSidebarClosed);
        }}
      >
        {isSidebarClosed ? "Open" : "Close"}
      </Button>

      {!isSidebarClosed ? (
        chatButtons.map((x, index) =>
          ChatButton(x, index, currentChatIndex, setChatIndex)
        )
      ) : (
        <></>
      )}
      <div className=" flex flex-row gap-4">
        {!isSidebarClosed ? (
          <Button
            onClick={() => {
              addChat();
            }}
            variant="contained"
          >
            +
          </Button>
        ) : (
          <></>
        )}
        {!isSidebarClosed ? (
          <Button
            onClick={() => {
              subChat();
            }}
            variant="contained"
          >
            -
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SideBar;
