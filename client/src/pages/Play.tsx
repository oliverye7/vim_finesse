import React from "react";
import ChallengeComponent from "../components/Home/Play/Challenge.tsx";
import Pane from "../components/Script.js";

function Play(props) {
  return (
    <div>
      <div>
        <a href="/home">go back home</a>
      </div>
      play the game:
      <ChallengeComponent></ChallengeComponent>
      <Pane></Pane>
    </div>
  );
}

export default Play;
