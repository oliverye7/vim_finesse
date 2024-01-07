import React from "react";
import ChallengeComponent from "../components/Home/Play/Challenge.tsx";
import BaseLayout from "../layouts/BaseLayout.js";


function Play(props) {
  return (
    <BaseLayout>
      <div>
        play the game:
        <ChallengeComponent></ChallengeComponent>
      </div>
    </BaseLayout>
  );
}

export default Play;
