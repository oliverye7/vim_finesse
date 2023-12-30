import React from "react";
import Body from "../components/Home/Body.tsx";
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import BaseLayout from "../layouts/BaseLayout.js";
import { useEffect, useState } from "react";
import jwt_decode, { jwtDecode } from "jwt-decode";


function Home() {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log("um");
      const res = tokenResponse;
      console.log(res.access_token);
    }
  });

  return (
    <BaseLayout>
      <div>
        <Body />
      </div>
      <div>
        <div onClick={() => login()}>bing bong</div>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            if (credentialResponse.credential !== undefined) {
              const response = jwtDecode(credentialResponse.credential);
              //console.log(response);
            }
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </BaseLayout>
  );
}

export default Home;