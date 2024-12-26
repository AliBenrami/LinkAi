import { useEffect, useState } from "react";
import xIcon from "../assets/xIcon.jpg";
import youtubeIcon from "../assets/youtubeIcon.png";
import InstagramLogo from "../assets/InstagramLogo.webp";
import TikTokLogo from "../assets/TikTokLogo.webp";

useState;

interface socialType {
  id: number;
  name: string;
  img: any;
  link: string;
}
const Footer = () => {
  const [content, setContent] = useState<socialType[]>();

  useEffect(() => {
    const newContent = [
      { id: 0, name: "x", img: xIcon, link: "x.com" },
      { id: 1, name: "instagram", img: InstagramLogo, link: "instagram.com" },
      { id: 2, name: "tiktok", img: TikTokLogo, link: "tiktok.com" },
    ];
    setContent(newContent);
  }, []);
  const socialUI = (item: socialType) => {
    return (
      <li key={item.id} className=" bg-white w-10 h-10 rounded-lg">
        <a href={"https://" + item.link}>
          <img className="rounded-md" src={item.img} key={item.name}></img>
        </a>
      </li>
    );
  };

  return (
    <div>
      <div className="h-[20vw]"></div>
      <footer className=" flex flex-row items-center p-14 bg-transparent w-full bg-slate-700">
        <ul className=" flex flex-row gap-8 items-center">
          {content?.map(socialUI)}
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
