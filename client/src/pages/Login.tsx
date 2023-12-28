import React from "react";
import BaseLayout from "../layouts/BaseLayout";

function Login(props) {
  return (
    <BaseLayout>
      <div>
        <div>login popup</div>
        <div>
          <a href="/profile">
            <button className="bg-pink-200 rounded-lg p-2">go to profile (click me)</button>
            <br></br>
            TODO: sean
          </a>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Login;