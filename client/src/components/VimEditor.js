import React, { useState, useEffect } from "react";
import { server_url } from "../constants.js";
import AceEditor from "react-ace-builds";
import get_user_id from "../functions/helpers.tsx";
import "react-ace-builds/webpack-resolver-min";

function VimEditor(props) {
  const [keyStrokes, setKeyStrokes] = useState([]);

  function onChange(newValue) {
    // write a function to check if the solution matches newValue
    console.log(newValue);
    if (newValue === solution_text) {
      console.log("completed");
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
        challenge_id: 1,
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
      keyStrokes.push(event.key);
    });
  }

  useEffect(() => {
    setupKeydownListener();
    // eslint-disable-next-line
  }, []);

  const sample_text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id 
est laborum`;

  const solution_text = ``;

  // Render editor
  return (
    <div id="editor">
      <AceEditor
        mode="java"
        theme="terminal"
        onChange={onChange}
        focus={true}
        value={sample_text}
        width="1100px"
        keyboardHandler="vim"
        highlightActiveLine={true}
        onBlur={handleBlur}
        fontSize={14}
        showPrintMargin={true}
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
