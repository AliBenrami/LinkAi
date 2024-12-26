import Footer from "../footer";
import Nav from "../nav";
import RoboPNG from "../../assets/robo.png";
import Chat from "../chat/chat";
const About = () => {
  return (
    <>
      <Nav></Nav>
      <div className="bg-gradient-to-r from-blue-950 to-violet-950 fixed top-0 bottom-0 right-0 left-0 m-auto w-auto h-[100%] -z-50"></div>
      <div>about</div>
      <img src={RoboPNG}></img>
      <Footer></Footer>
    </>
  );
};

export default About;
