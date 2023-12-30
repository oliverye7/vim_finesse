import React from "react";
import Body from "../components/Home/Body.tsx";
import BaseLayout from "../layouts/BaseLayout.js";
import { useEffect } from "react";
import { server_url } from "../constants.js";

const CLIENT_ID = "d4bd59212a9e47a3ddcd";

function Home() {
  function loginWithGithub() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
  };

  useEffect(() => {
    const queryString = window.location.search;
    const codeParam = new URLSearchParams(queryString).get("code");
    console.log(codeParam);

    if (codeParam && (localStorage.getItem("accessToken") === null)) {
      async function getAccessToken() {
        await fetch(`${server_url}/getGithubAccessToken?code=${codeParam}`)
      }
      getAccessToken();
    }
  }, [])

  return (
    <BaseLayout>
        <Body />
        <button onClick={loginWithGithub} className="border-black border-2 mt-8 p-3 hover:bg-blue-300">
          click me for github stuff!!
        </button>
    </BaseLayout>
  );
}

export default Home;