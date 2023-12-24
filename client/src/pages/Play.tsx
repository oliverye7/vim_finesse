import React from "react";
import ChallengeComponent from "../components/Home/Play/Challenge.tsx";

function Play(props) {
  return (
    <div>
      <div>
        <a href="/home">go back home</a>
      </div>
      play the game:
      <ChallengeComponent></ChallengeComponent>
    </div>
  );
}

export default Play;
