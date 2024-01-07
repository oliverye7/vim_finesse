import React from "react";

function Body(props) {
  return (
    <div className="bg-pink-400">
      <div>Welcome to VimGame.</div>
      <div>
        <a href="/play">
          <button className="">play</button>
        </a>
      </div>
    </div>
  );
}

export default Body;
