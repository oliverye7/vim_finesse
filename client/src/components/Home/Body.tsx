import React from "react";

function Body(props) {
  return (
    <div>
      <div>Welcome to VimGame.</div>
      <div>
        <a href="/login">
          <button>login</button>
        </a>
      </div>
      <div>
        <a href="/play">
          <button className="">play</button>
        </a>
      </div>
    </div>
  );
}

export default Body;
