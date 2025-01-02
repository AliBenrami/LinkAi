import { useEffect, useState } from "react";
import AccountIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "../auth/supabaseAuth";

const Account = ({ classname }: { classname: string }) => {
  const [open, setopen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userID, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userinfo = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log(error);
        return;
      }
      setUsername(data.user.email ?? null);
      setUserId(data.user.id ?? null);
    };

    userinfo();
  }, []);

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
        <div className=" text-[1rem]">{ContentName}:</div>
        {Content === null ? (
          <div className=" text-[1rem] animate-pulse">loading...</div>
        ) : (
          <div className=" text-[1rem]">{Content}</div>
        )}
      </div>
    );
  };

  const signout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("logout error " + error.code);
      return;
    }

    location.href = "/login";
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

        <div className=" flex flex-col">
          <LoadingContentAnimation
            Content={username}
            ContentName="username"
          ></LoadingContentAnimation>
          <LoadingContentAnimation
            Content={userID}
            ContentName="ID"
          ></LoadingContentAnimation>
          <div className=" h-[100px]"></div>
          <button className=" mr-auto ml-auto" onClick={signout}>
            <LogoutIcon></LogoutIcon>
          </button>
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
