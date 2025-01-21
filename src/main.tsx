import { Routes, Route, BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Home from "./pages/home/home.tsx";
import Login from "./pages/auth/login.tsx";
import Signup from "./pages/auth/signup.tsx";
import About from "./pages/home/about.tsx";
import Chat from "./pages/chat/chat.tsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route path="/About" element={<About />}></Route>
        <Route path="/Chat" element={<Chat />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
