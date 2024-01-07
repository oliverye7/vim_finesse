import React, { useState, useEffect } from "react";
import { server_url } from "../../../constants";
import VimEditor from "../../VimEditor";

interface ChallengeIdentifier {
  id: string; // Assuming 'id' is a string that represents a UUID
  name: string;
}

// If the server returns an array of these objects:
type ChallengeIdentifiers = ChallengeIdentifier[];

function ChallengeComponent() {
  const [challengeIdentifiers, setChallengeIdentifiers] = useState<ChallengeIdentifiers>([]);

  useEffect(() => {
    fetch(`${server_url}/allChallenges`)
    .then((response) => response.json())
    .then((data: ChallengeIdentifiers) => {
      setChallengeIdentifiers(data);
      console.log(data)
    })
    .catch((error) => {
      console.error("Error fetching challenge names: ", error)
    });
  }, []);

  async function displayChallengeText(challenge_id) {
    console.log(challenge_id);
    let response = await fetch(`${server_url}/challenge/${challenge_id}`, {
      method: "GET"
    });

    let data = await response.json();
    console.log(data);
  }

  return (
    <div>
      {/*
      <div>Challenge</div>
      <div>{challenge?.message}</div>
      */}
      {challengeIdentifiers.map((challenge) => (
        <div key={challenge[0]}>
          <button onClick={() => displayChallengeText(challenge[0])}>{challenge[1]}</button>
        </div>
      ))}
      <VimEditor></VimEditor>
    </div>
  );
}

export default ChallengeComponent;
