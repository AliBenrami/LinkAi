import { useEffect, useState } from "react";
import AccountIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../supabase";
import { Button, Select, MenuItem } from "@mui/material";

const Account = ({ classname }: { classname: string }) => {
  const [open, setopen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userID, setUserId] = useState<string | null>(null);

  const [theme, setTheme] = useState(0);

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
      <div className=" flex flex-row items-center p-2 justify-between">
        {ContentName === "" ? (
          <></>
        ) : (
          <div className=" text-[1rem]">{ContentName}</div>
        )}

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
  const LineSplit = () => {
    return <div className=" w-full h-1 bg-white"></div>;
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
      data;
      if (error) {
        console.log("error inserting content");
        return;
      }

      location.reload();
    };

    const Profile = () => {
      return (
        <div className=" flex flex-col w-[100%] gap-5 p-2">
          <div>
            <LoadingContentAnimation
              Content={username}
              ContentName="Username"
            ></LoadingContentAnimation>
            <LineSplit></LineSplit>
          </div>

          <div>
            <div className=" flex flex-row items-center p-2 justify-between">
              <div>Delete Messages</div>
              <button
                className=" "
                onClick={() => {
                  resetContent();
                }}
              >
                <DeleteIcon></DeleteIcon>
              </button>
            </div>
            <LineSplit></LineSplit>
          </div>

          <div>
            <div className=" flex flex-row items-center p-2 justify-between">
              <div>Logout</div>
              <button className="" onClick={signout}>
                <LogoutIcon></LogoutIcon>
              </button>
            </div>
            <LineSplit></LineSplit>
          </div>
        </div>
      );
    };

    const General = () => {
      return (
        <div className=" flex flex-col w-[100%] gap-5 p-2">
          <div className=" flex flex-row items-center p-2 justify-between">
            <div className=" translate-y-3">Theme</div>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={theme}
              label="Theme"
              color="secondary"
              variant="filled"
              onChange={(e) => {
                setTheme(Number(e.target.value));
              }}
              sx={{
                "& .MuiSelect-select": {
                  color: "white", // Change the text color of the selected item to white
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Change the dropdown icon color to white
                },
                "& .MuiInputBase-root": {
                  backgroundColor: "transparent", // Optional: Adjust background color
                },
              }}
            >
              <MenuItem value={0}>Light</MenuItem>
              <MenuItem value={1}>Dark</MenuItem>
            </Select>
          </div>

          <LineSplit></LineSplit>
        </div>
      );
    };

    const AccountChoices = () => {
      const [choice, setChoice] = useState(0);
      //perallel lists
      const choices = ["General", "Profile"];
      const choiceDiv = [General, Profile];

      return (
        <>
          <div className=" fixed top-16 flex gap-4">
            {choices.map((content: string, index: number) => {
              if (choice === index) {
                return (
                  <Button
                    className=" w-[128px] h-9"
                    onClick={() => {
                      setChoice(index);
                    }}
                    variant="contained"
                    color="secondary"
                    key={index}
                  >
                    {content}
                  </Button>
                );
              }
              return (
                <Button
                  className=" w-[128px] h-9"
                  onClick={() => {
                    setChoice(index);
                  }}
                  variant="contained"
                  key={index}
                >
                  {content}
                </Button>
              );
            })}
          </div>
          {choiceDiv[choice]()}
        </>
      );
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
        <div className=" fixed bottom-10 w-full flex justify-center">
          {" "}
          <LoadingContentAnimation
            Content={userID}
            ContentName=""
          ></LoadingContentAnimation>
        </div>
        <AccountChoices></AccountChoices>
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
