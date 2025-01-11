import { useEffect, useState } from "react";
import AccountIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "../supabase";

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
    const resetContent = async () => {
      const { data, error } = await supabase
        .from("AIConvo")
        .upsert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            messages: [],
          },
        ])
        .select();
      if (error) {
        console.log("error inserting content");
        return;
      }

      location.reload();
    };

    return (
      <div className=" flex justify-center p-[8rem] fixed right-0 left-0 top-0 bottom-0 translate-x-[50%] translate-y-[50%] bg-gray-700 w-[50vw] h-[50vh] rounded-lg">
        <button
          className=" absolute right-[20px] top-[20px]"
          onClick={() => {
            togleOpen();
          }}
        >
          <CloseIcon></CloseIcon>
        </button>

        <div className=" flex flex-col gap-4 p-2">
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
          <button
            onClick={() => {
              resetContent();
            }}
          >
            Delete Messages
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
