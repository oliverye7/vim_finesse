import { server_url } from "../constants";

async function get_user_id() {
  if (localStorage.getItem("accessToken") == null) {
    return -1;
  }
  let response = await fetch(`${server_url}/getUserGithubProfile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
  });
  
  let data = await response.json();
  return data.id;
}



export default get_user_id;