import { useState } from "react";
import logo from "../assets/robo2.svg";
import { Link } from "react-router-dom";

useState;

const Nav = () => {
  return (
    <nav className=" flex flex-row items-center p-14 w-full">
      <ul className=" flex flex-row gap-8 items-center">
        <li className="w-[128px] h-[128px]">
          <img
            className="object-contain bg-slate-900 rounded-[1in]"
            onClick={() => {
              location.href = "/";
            }}
            src={logo}
          ></img>
        </li>

        <li>
          <Link className=" text-white" to="/">
            Home
          </Link>
        </li>

        <li>
          <Link className=" text-white" to="/about">
            About
          </Link>
        </li>

        <li>
          <Link className=" text-white" to="/chat">
            Chat
          </Link>
        </li>
      </ul>
      <div className=" w-full"></div>
      <ul className=" flex flex-row gap-8 items-center">
        <li>
          <Link className=" text-white" to="/Login">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
