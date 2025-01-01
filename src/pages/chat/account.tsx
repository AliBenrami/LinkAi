import { useState } from "react";
import AccountIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

const Account = ({ classname }: { classname: string }) => {
  const [open, setopen] = useState(false);
  const [username, openUsername] = useState(null);
  const [userID, setuserId] = useState(null);

  const togleOpen = () => {
    setopen(!open);
  };

  const LoadingContentAnimation = ({
    ContentName,
    Content,
  }: {
    ContentName: string;
    Content: any;
  }) => {
    return (
      <div className=" flex flex-row gap-2">
        <div>{ContentName}:</div>
        {username === null ? (
          <div className=" animate-pulse">loading...</div>
        ) : (
          <div>{Content}</div>
        )}
      </div>
    );
  };

  const AccountUI = () => {
    return (
      <div className=" flex justify-center p-[8rem] fixed right-0 left-0 top-0 bottom-0 translate-x-[50%] translate-y-[50%]  bg-slate-800 w-[50vw] h-[50vh] rounded-md">
        <button
          className=" absolute right-[20px] top-[20px]"
          onClick={() => {
            togleOpen();
          }}
        >
          <CloseIcon></CloseIcon>
        </button>

        <div className=" text-[50px]">
          <LoadingContentAnimation
            Content={username}
            ContentName="username"
          ></LoadingContentAnimation>
          <LoadingContentAnimation
            Content={userID}
            ContentName="userID"
          ></LoadingContentAnimation>
        </div>
      </div>
    );
  };

  return (
    <div className={classname}>
      <button
        onClick={() => {
          togleOpen();
        }}
      >
        <AccountIcon></AccountIcon>
      </button>

      {open ? <AccountUI></AccountUI> : <></>}
    </div>
  );
};

export default Account;
