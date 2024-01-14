import React, { useState, useEffect, useRef } from "react";
import { server_url } from "../constants.js";
import AceEditor from "react-ace-builds";
import get_user_id from "../functions/helpers.tsx";
import "react-ace-builds/webpack-resolver-min";

function VimEditor(props) {
  enum Modifier {
    Shift = "Shift",
    Control = "Control",
    Alt = "Alt",
    None = ""
  }

  interface KeyStrokes {
    keys: Array<String>;
    modifier: Modifier
  }

  //const [keyStrokes, setKeyStrokes] = useState<string[]>([]);
  const [actions, setActions] = useState<KeyStrokes[]>([]);
  //const [activeModifier, setActiveModifier] = useState<Modifier>(Modifier.None);
  //const [keyStrokes, setKeyStrokes] = useState<String[]>([]);
  let activeModifier: Modifier = Modifier.None;
  const [keyStrokes, setKeyStrokes] = useState([]);
  const [startState, setStartState] = useState("");
  const [targetState, setTargetState] = useState("");
  const [challengeName, setChallengeName] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [lineOffset, setLineOffset] = useState(0);
  const [charOffset, setCharOffset] = useState(0);
  const divRef = useRef<HTMLDivElement>(null)
  const [completed, setCompleted] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  function onChange(newValue) {
    setStartState(newValue);
    setCharOffset(1);
    setCompleted(newValue === targetState);
    if (newValue === targetState) {
      setStartState(targetState);
    }
  }

  async function submit() {
    let user_id = await get_user_id();

    // TODO: is this the actual way you would handle it? or should backend always return 200 success but secretly just not handle invalid IDs
    if (user_id == -1) {
      console.error("Login Credentials Invalid");
    }

    console.log(actions);
    //console.log(activeModifier);
    //console.log(keyStrokes);
    //await fetch(`${server_url}/challenge/${1}/submit`, {
    //  method: "POST",
    //  headers: {
    //    "Content-Type": "application/json",
    //  },
    //  body: JSON.stringify({
    //    challenge_id: challengeId,
    //    challenge_name: challengeName,
    //    user_id: user_id,
    //    user_keystrokes: keyStrokes,
    //  }),
    //});
  }

  function setupKeydownListener() {
    const editorElement = document.getElementById("editor");

    if (!editorElement) {
      console.error("Editor element not found");
      return;
    }

    editorElement.addEventListener("keyup", (event) => {
      keyStrokes.push(event.key);
    });
  }

  //function setupKeydownListener() {
  //  const modifierKeys = new Set(Object.values(Modifier));

  //  const editorElement = document.getElementById("editor");

  //  if (!editorElement) {
  //    console.error("Editor element not found");
  //    return;
  //  }

  //  editorElement.addEventListener("keyup", (event) => {
  //    if (modifierKeys.has(event.key as Modifier)) {
  //      let newAction: KeyStrokes = {
  //        keys: keyStrokes, // Make a copy of the current keystrokes
  //        modifier: activeModifier
  //      };
  //      //setActions((prev) => [...prev, newAction]);
  //      actions.push(newAction)
  //      console.log(newAction);
  //      keyStrokes = [];
  //      activeModifier = Modifier.None;
  //      //setKeyStrokes([]);
  //      //setActiveModifier(Modifier.None);
  //    } else {
  //      keyStrokes.push(event.key.toLowerCase());
  //      //setKeyStrokes((prev) => [...prev, event.key.toLowerCase()]);
  //    }
  //  });

  //  editorElement.addEventListener("keydown", (event) => {
  //    if (event.key in Modifier) {
  //      let newAction: KeyStrokes = {
  //        keys: keyStrokes,
  //        modifier: activeModifier
  //      };
  //      //setActions((prev) => [...prev, newAction]);
  //      actions.push(newAction);
  //      keyStrokes = [];
  //      activeModifier = event.key as Modifier;
  //      //setKeyStrokes([]);
  //      //setActiveModifier(event.key as Modifier);
  //    }
  //  });
  //}

  function clearKeyStrokes() {
    //setKeyStrokes([]);
    keyStrokes = [];
  }

  function handleClickOutside(event: MouseEvent) {
    if (divRef.current && divRef.current.contains(event.target as Node)) {
      setIsFocus(true);
    } else {
      // This else block is important to maintain focus if the click is inside the div
      setIsFocus(false);
    }
  }


  useEffect(() => {
    setupKeydownListener();

    document.addEventListener('click', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
      {/*
      <div ref={divRef}>
        <div className={`${isFocus ? "cursor-move" : "cursor-help"}`} ></div>
        </div>
      */}
      <div>
        <button className="bg-pink-200" onClick={submit}>
          Submit
        </button>
      </div>
      <div ref={divRef} className={`${isFocus ? "editor-focused" : ""}`}>
        <div className="editor-cursor-style"></div>
          test content
          <AceEditor
            mode="java"
            theme="terminal"
            onChange={onChange}
            value={startState}
            readOnly={completed}
            width="1200px"
            keyboardHandler="vim"
            highlightActiveLine={true}
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
    </div>
  );
}

export default VimEditor;
