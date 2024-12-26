import { useState } from "react";
import logo from "../assets/robo2.svg";

useState;

const Lownav = () => {
  return (
    <nav className=" fixed flex flex-row items-center p-14 w-full z-50 ">
      <ul className=" flex flex-row gap-8 items-center">
        <li>
          <img
            className=" w-32 h-32 object-contain bg-slate-900 rounded-[1in]"
            onClick={() => {
              location.href = "/";
            }}
            src={logo}
          ></img>
        </li>
      </ul>
    </nav>
  );
};

export default Lownav;
