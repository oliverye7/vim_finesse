import React, { useState, useEffect } from "react";
import { server_url } from "../constants.js";
import AceEditor from "react-ace-builds";
import get_user_id from "../functions/helpers.tsx";
import "react-ace-builds/webpack-resolver-min";

function VimEditor(props) {
  // TODO: strongly type the props coming in
  const [keyStrokes, setKeyStrokes] = useState([]);
  const [startState, setStartState] = useState("");
  const [targetState, setTargetState] = useState("");
  const [challengeName, setChallengeName] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [lineOffset, setLineOffset] = useState(0);
  const [charOffset, setCharOffset] = useState(0);
  const [completed, setCompleted] = useState(false);

  function onChange(newValue) {
    // write a function to check if the solution matches newValue
    setStartState(newValue);
    setCharOffset(1);
    setCompleted(newValue === targetState);
    if (newValue === targetState) {
      setStartState(targetState);
    }
  }

  async function handleBlur() {
    let user_id = await get_user_id();

    await fetch(`${server_url}/challenge/${1}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        challenge_id: challengeId,
        user_id: user_id,
        user_keystrokes: keyStrokes,
      }),
    });
  }

  function setupKeydownListener() {
    const editorElement = document.getElementById("editor");

    if (!editorElement) {
      console.error("Editor element not found");
      return;
    }

    editorElement.addEventListener("keyup", (event) => {
      setKeyStrokes((prev) => [...prev, event.key]);
    });
  }

  function clearKeyStrokes() {
    setKeyStrokes([]);
  }

  useEffect(() => {
    setupKeydownListener();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setStartState(props.challenge_description.start_state);
    setTargetState(props.challenge_description.target_state);
    setCharOffset(props.challenge_description.start_char_offset);
    setLineOffset(props.challenge_description.start_line_offset);
    setChallengeName(props.challenge_description.challenge_name);
    setChallengeId(props.challenge_description.challenge_id);
    setCompleted(false);
    clearKeyStrokes();
    console.log("change");
    // eslint-disable-next-line
  }, [props.challenge_description]);

  // Render editor
  return (
    <div id="editor">
      {!completed ? (
        <div>Challenge: {challengeName}</div>
      ) : (
        <div>
          <div className="text-green-600">{challengeName} Completed!</div>
          <div>Keystrokes used: {keyStrokes.join(", ")}</div>
          <div>Keystrokes count: {keyStrokes.length}</div>
        </div>
      )}
      <AceEditor
        mode="java"
        theme="terminal"
        onChange={onChange}
        focus={true}
        value={startState}
        readOnly={completed}
        width="1200px"
        keyboardHandler="vim"
        highlightActiveLine={true}
        onBlur={handleBlur}
        fontSize={14}
        showPrintMargin={false}
        wrapEnabled={true}
        showGutter={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}

export default VimEditor;
