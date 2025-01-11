import { useEffect, useState } from "react";
import Lownav from "../lowNav";
import background from "../../assets/appBackground-2.svg";
import { LoginCheck, supabase } from "../supabase";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPasword] = useState<string>("");

  const [LoginError, setLoginError] = useState<string>();

  useEffect(() => {
    LoginCheck("/chat", null);
  }, []);

  const submitLogin = async () => {
    if (
      email.length === 0 ||
      email.split("@")[email.split("@").length - 1].toLowerCase() !==
        "gmail.com" ||
      password.length === 0
    ) {
      setLoginError("error email or password dose not meet req");
      return;
    }

    //auth

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    data;
    if (error) {
      setLoginError(error.message);
      return;
    }

    location.href = "/chat";
  };

  return (
    <div className=" overflow-hidden h-[100vh] m-0">
      <div className="bg-gradient-to-r from-blue-950 to-violet-950 absolute top-0 bottom-0 right-0 left-0 m-auto w-[100vw] h-[100vh] z-0"></div>
      <img
        className=" fixed top-0 bottom-0 right-0 left-0 m-auto min-w-[1920px] min-h-[1080px] z-0 translate-y-8 select-none pointer-events-none"
        src={background}
      ></img>
      <Lownav></Lownav>

      <div className=" absolute right-0 left-0 top-0 bottom-0 m-auto min-w-[500px] min-h-[500px] w-[35vw] h-[35vh] bg-[#222222] rounded-xl">
        <div className=" w-full h-full flex flex-col justify-center items-center gap-8 p-8">
          <div className="flex flex-col gap-2">
            <div>Email</div>
            <input
              className="indent-2 w-[416px] h-[40px] p-[10px] rounded-xl"
              type="text"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>

          <div className="flex flex-col gap-2">
            <div>Password</div>
            <input
              className=" indent-2 w-[416px] h-[40px] p-[10px] rounded-xl"
              type="password"
              onChange={(e) => {
                setPasword(e.target.value);
              }}
            ></input>
          </div>

          <div className=" text-red-500 animate-pulse">{LoginError ?? ""}</div>

          <button className=" p-4" onClick={submitLogin}>
            login
          </button>
          <a href="/signup">signup?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
