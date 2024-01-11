import React, { useState, useEffect } from "react";
import { server_url } from "../../../constants";
import VimEditor from "../../VimEditor.tsx";

interface ChallengeIdentifier {
  id: string;
  name: string;
}

interface ChallengeDescription {
  challenge_id: string,
  challenge_name: string,
  start_char_offset: number,
  start_line_offset: number,
  start_state: string,
  target_state: string
}

// If the server returns an array of these objects:
type ChallengeIdentifiers = ChallengeIdentifier[];


function ChallengeComponent() {
  const [challengeIdentifiers, setChallengeIdentifiers] = useState<ChallengeIdentifiers>([]);
  const [challengeDescription, setChallengeDescription] = useState<ChallengeDescription>();

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
    setChallengeDescription(data);
  }

  return (
    <div>
      <div className="mb-24">
        {challengeIdentifiers.map((challenge) => (
          <div key={challenge[0]}>
            <button onClick={() => displayChallengeText(challenge[0])}>{challenge[1]}</button>
          </div>
        ))}
      </div>
      {challengeDescription && <VimEditor challenge_description={challengeDescription}></VimEditor>}
    </div>
  );
}

export default ChallengeComponent;
