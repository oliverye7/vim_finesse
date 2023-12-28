import React from "react";
import BaseLayout from "../layouts/BaseLayout";

function Profile(props) {
  return (
    <BaseLayout>
      <div>
        <div className="bg-pink-200 p-2 rounded-lg">
          <a href="/home">go back home (click me)</a>
        </div>
        user profile page. can get here from login
      </div>
    </BaseLayout>
  );
}

export default Profile;
