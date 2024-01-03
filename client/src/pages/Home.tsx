import React from "react";
import Body from "../components/Home/Body.tsx";
import BaseLayout from "../layouts/BaseLayout.js";
import { useEffect, useState } from "react";
import { server_url, github_client_id } from "../constants.js";
import VimEditor from "../components/VimEditor.js";

const CLIENT_ID = github_client_id;

function Home() {

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

      let user_id = Number(data.id);
      if (user_id === null) {
        console.error("invalid user_id");
      }

      response = await fetch(`${server_url}/getUserName?id=${user_id}`, {
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

    if (username.length !== 0 && userData !== null) {
      await fetch(`${server_url}/setUsername`, {
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
  // eslint-disable-next-line
  }, [])

  return (
    <BaseLayout>
        <Body />
        {localStorage.getItem("accessToken") ?
        <>
          <div>
            User is logged in 
          </div>
          <button onClick={getUserData} className="my-2">
            click me to get some user data in console log
          </button>
          <form className="" onSubmit={handleSubmit}>
            <div>Select a username</div>
            <input type="text" placeholder="Anonymous" className="h-12 w-72 bg-white border-black border-2 my-2" onChange={handleChange}/>
            <button type="submit" className="ml-4 bg-white hover:bg-slate-50">Submit</button>
          </form>
          {(username.length === 0  && submitAttempted) ? 
          <>
            <div className="-mt-2 text-sm text-red-500">
              username cannot be empty
            </div>
          </>
          :
          <></>
          }

          <div>
            Welcome, {username}
          </div>
          <button onClick={() => { localStorage.removeItem("accessToken"); setRerender(!rerender)}}>
            Log Out
          </button>
        </>
        :
        <>
          <div>
            User is not logged in
          </div>
          <button onClick={loginWithGithub} className="border-black border-2 mt-8 p-3 hover:bg-blue-300">
            click me to login with github
          </button>
        </>}
        <div className="bg-pink-200">
          <VimEditor></VimEditor>
        </div>
    </BaseLayout>
  );
}

export default Home;