import React, { useState, useEffect } from "react";

function ChallengeComponent() {
  const [challenge, setChallenge] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/challenge")
      .then((response) => response.text())
      .then((data) => {
        setChallenge(data);
      })
      .catch((error) => {
        console.error("Error fetching the challenge:", error);
      });
  }, []);

  return (
    <div>
      <div>Challenge</div>
      <div>{challenge}</div>
    </div>
  );
}

export default ChallengeComponent;
