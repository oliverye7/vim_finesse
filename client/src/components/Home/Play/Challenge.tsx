import React, { useState, useEffect } from "react";
import { server_url } from "../../../constants";
import VimEditor from "../../VimEditor";

interface ChallengeResponse {
  message: String,
}

function ChallengeComponent() {
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);

  useEffect(() => {
    fetch(`${server_url}/challenge`)
      .then((response) => response.json())
      .then((data : ChallengeResponse) => {
        setChallenge(data);
      })
      .catch((error) => {
        console.error("Error fetching the challenge:", error);
      });
  }, []);

  return (
    <div>
      {/*
      <div>Challenge</div>
      <div>{challenge?.message}</div>
      */}
      <VimEditor></VimEditor>
    </div>
  );
}

export default ChallengeComponent;
