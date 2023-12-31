import React from "react";
import { useEffect, useState } from "react";
import { server_url } from "../../../constants";

const CLIENT_ID = "d4bd59212a9e47a3ddcd";

function Login(props) {
  interface UserData {
       avatar_url: string;
       id: number;
       github_username: string;
  }
    
  const [rerender, setRerender] = useState(false);
  const [username, setUsername] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  function loginWithGithub() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
  };

  async function getUserData() {
    try {
      let response = await fetch(`${server_url}/getUserGithubProfile`, {
        method: "GET",
        headers: {
          "Authorization" :  "Bearer " + localStorage.getItem("accessToken")
        }
      }) 

      let data = await response.json();
      setUserData({
        avatar_url: data.avatar_url,
        id: data.id,
        github_username: data.login,
      });

      response = await fetch(`${server_url}/getUserName?id=${data.id}`, {
        method: "GET"
      });

      data = await response.json();
      setUsername(data.username)
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  async function getAccessToken(codeParam) {
    try {
      const response = await fetch(`${server_url}/getGithubAccessToken?code=${codeParam}`, {
        method: "GET"
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
        // hacky way to get the page to refresh once the asynch function call completes
        setRerender(!rerender);
        getUserData();
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function handleSubmit(event) {
    setSubmitAttempted(true);
    event.preventDefault();

    if (username.length !== 0 && userData !== null) {
      // pass it to the backend :)
      const response = await fetch(`${server_url}/setUsername`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          avatar_url: userData.avatar_url,
          id: userData.id,
          github_username: userData.github_username
        })
      }) 
    }
    //should also close the modal that asks a user for their username
  }

  function handleChange(event) {
    setUsername(event.target.value);
  }

  useEffect(() => {
    const queryString = window.location.search;
    const codeParam = new URLSearchParams(queryString).get("code");

    if (codeParam && (localStorage.getItem("accessToken") === null)) {
      getAccessToken(codeParam);
    }
    if (localStorage.getItem("accessToken") !== null) {
      getUserData();
    }
  }, [])

  return (
    <div>
        {localStorage.getItem("accessToken") ?
        <>
          <div>
            {username}
          </div>
          <button onClick={() => { localStorage.removeItem("accessToken"); setRerender(!rerender)}}>
            Log Out
          </button>
        </>
        :
        <>
          <button onClick={loginWithGithub} className="">
            Log In
          </button>
        </>}
    </div>
  );
}

export default Login;
