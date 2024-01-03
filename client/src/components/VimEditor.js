import React, { useState, useEffect } from "react";
import { server_url } from "../constants";
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";

function VimEditor() {
  let keyPressCount = 0;
  //let keyStrokes = [];
  const [keyStrokes, setKeyStrokes] = useState([]);

  function onChange(newValue) {
    //console.log("change", newValue);
  }

  async function handleBlur() {
    let response = await fetch(`${server_url}/getUserGithubProfile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });

    let data = await response.json();
    let user_id = data.id;

    response = await fetch(`${server_url}/challenge/${1}/submit`, {
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

    console.log(response);
  }

  function setupKeydownListener() {
    const editorElement = document.getElementById("editor");

    if (!editorElement) {
      console.error("Editor element not found");
      return;
    }

    editorElement.addEventListener("keyup", (event) => {
      keyPressCount += 1;
      console.log(`Key press ${keyPressCount}:`, event.key);
      keyStrokes.push(event.key);
      console.log(keyStrokes);
    });
  }

  useEffect(() => {
    setupKeydownListener();
    // eslint-disable-next-line
  }, []);

  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
      \n et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
      \n ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
      \n nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id 
      \n est laborum`;

  // Render editor
  return (
    <div id="editor">
      <AceEditor
        mode="java"
        theme="terminal"
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        value={text}
        width="900px"
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
