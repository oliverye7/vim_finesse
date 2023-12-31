import React from "react";
import Login from "./Header/Login.tsx";

function Header(props) {
  return (
    <div className="bg-pink-200 grid grid-cols-2 py-7 px-16">
      <a href="/" className="text-3xl font-semibold justify-self-start text-site-menublack">VIM FINESSE</a>
      <div className="justify-self-end font-medium flex gap-8 text-xl place-items-center">
        <a href="/about" className="text-site-menublack hover:text-site-black">About</a>
        <a href="/tutorial" className="text-site-menublack hover:text-site-black">How to Play</a>
        <a className="text-site-menublack hover:text-site-black">
          <Login></Login>
        </a>
      </div>
    </div>
  );
}

export default Header;
