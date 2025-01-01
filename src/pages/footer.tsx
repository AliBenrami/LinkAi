import { useEffect, useState } from "react";

import X from "@mui/icons-material/X";
import Instagram from "@mui/icons-material/Instagram";
import Youtube from "@mui/icons-material/YouTube";
import CopyrightIcon from "@mui/icons-material/Copyright";

useState;

interface socialType {
  name: string;
  img: any;
  link: string;
}
const Footer = () => {
  const [content, setContent] = useState<socialType[]>();

  useEffect(() => {
    const newContent = [
      { name: "copywrite", img: <CopyrightIcon />, link: "" },
      { name: "x", img: <X></X>, link: "x.com" },
      {
        name: "instagram",
        img: <Instagram></Instagram>,
        link: "instagram.com",
      },
      { name: "youtube", img: <Youtube></Youtube>, link: "youtube.com" },
    ];
    setContent(newContent);
  }, []);
  const socialUI = (item: socialType, index: number) => {
    return (
      <li key={index}>
        <a href={"https://" + item.link}>{item.img}</a>
      </li>
    );
  };

  return (
    <div>
      <div className="h-[50vh]"></div>
      <footer className=" flex flex-row items-center p-14 bg-transparent w-full bg-slate-700 ">
        <ul className=" flex flex-row gap-8 items-center">
          {content?.map(socialUI)}
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
