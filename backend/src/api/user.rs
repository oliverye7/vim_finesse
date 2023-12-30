//use log::info;
use actix_web::{get, post, web, HttpRequest, HttpResponse, Responder};
use reqwest;
use serde::Deserialize;
//use bytes::BytesMut;
//use prost::Message;

const GITHUB_CLIENT_ID: &str = "d4bd59212a9e47a3ddcd";
const GITHUB_CLIENT_SECRET: &str = "b5d1af3e2605448d72824627019670c44587be91";

#[get("/user")]
pub async fn get_user() -> impl Responder {
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(_request: web::Bytes) -> impl Responder {
    HttpResponse::Ok().body("create_user")
}

#[derive(Deserialize)]
pub struct AccessTokenQuery {
    code: String,
}

#[get("/getGithubAccessToken")]
pub async fn get_github_access_token(query: web::Query<AccessTokenQuery>) -> impl Responder {
    println!("WE RECEIVED A FUNCTION CALL RAAAHHHH");
    let code = &query.code;
    let client = reqwest::Client::new();

    let params = [
        ("client_id", GITHUB_CLIENT_ID),
        ("client_secret", GITHUB_CLIENT_SECRET),
        ("code", code),
    ];

    let target_url = "https://github.com/login/oauth/access_token";

    match client
        .post(target_url)
        .form(&params)
        .header("Accept", "application/json")
        .send()
        .await
    {
        Ok(response) => match response.text().await {
            Ok(text) => {
                return HttpResponse::Ok().body(text);
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/getUserGithubProfile")]
pub async fn get_user_github_profile(request: HttpRequest) -> impl Responder {
    println!("Received");

    let auth_header = match request.headers().get("Authorization") {
        Some(header) => header.to_str().unwrap_or(""),
        None => return HttpResponse::BadRequest().body("Authorization header missing")
    };

    let client = reqwest::Client::new();
    let target_url = "https://api.github.com/user";
    let app_name = "Vim Finesse";

    match client
        .get(target_url)
        .header("User-Agent", app_name)
        .header("Authorization", auth_header)
        .send()
        .await
    {
        Ok(response) => match response.text().await {
            Ok(text) => {
                println!("{}", text);
                return HttpResponse::Ok().body(text);
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
