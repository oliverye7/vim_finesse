import React from "react";
import Body from "../components/Home/Body.tsx";
import BaseLayout from "../layouts/BaseLayout.js";
import { useEffect, useState } from "react";
import { server_url } from "../constants.js";

const CLIENT_ID = "d4bd59212a9e47a3ddcd";

function Home() {

  const [rerender, setRerender] = useState(false);

  function loginWithGithub() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
  };

  async function getUserData() {
    try {
      const response = await fetch(`${server_url}/getUserGithubProfile`, {
        method: "GET",
        headers: {
          "Authorization" :  "Bearer " + localStorage.getItem("accessToken")
        }
      }) 
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const codeParam = new URLSearchParams(queryString).get("code");
    //console.log(codeParam);

    if (codeParam && (localStorage.getItem("accessToken") === null)) {
      async function getAccessToken() {
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
          }
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      }
      getAccessToken();
    }
  }, [])

  return (
    <BaseLayout>
        <Body />
        {localStorage.getItem("accessToken") ?
        <>
          <div>
            User is logged in 
          </div>
          <button onClick={getUserData}>
            click me to get some user data in console log
          </button>
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
            click me for github stuff!!
          </button>
        </>}
    </BaseLayout>
  );
}

export default Home;