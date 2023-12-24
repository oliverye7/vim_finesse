import React from "react";
import ChallengeComponent from "../components/Home/Play/Challenge.tsx";
import VimPane from "../components/VimPane.tsx";

function Play(props) {
  return (
    <div>
      <div>
        <a href="/home">go back home</a>
      </div>
      play the game:
      <ChallengeComponent></ChallengeComponent>
      <VimPane></VimPane>
    </div>
  );
}

export default Play;
