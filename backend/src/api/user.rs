//use log::info;
use actix_web::{get, post, web, HttpResponse, Responder};
use serde::{Deserialize};
use reqwest;
use serde_json::json;
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
    //let params: &str = "?client_id=" + GITHUB_CLIENT_ID + "&client_secret=" + GITHUB_CLIENT_SECRET + "&code=" + code;
    //let params = format!("?client_id={}&client_secret={}&code={}", GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, code);
    //let target_url = format!("https://github.com/login/oauth/access_token{}", params);

    let params = [
        ("client_id", GITHUB_CLIENT_ID),
        ("client_secret", GITHUB_CLIENT_SECRET),
        ("code", code),
    ];

    let target_url = "https://github.com/login/oauth/access_token";

    println!("STARTING POST REQUEST CALL");
    match client.post(target_url)
        .form(&params)
        .header("Accept", "application/json") // GitHub API requires this header for JSON response
        .send()
        .await
    {
        Ok(response) => match response.text().await {
            Ok(text) => {
                println!("SDLFJSDFJSD");
                println!("{}", text);
                return HttpResponse::Ok().body(text);
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }

    //match client.post(target_url)
    //    .form(&params)
    //    .header("Content-Type", "application/json")
    //    .send()
    //    .await
    //    {
    //        Ok(response) => 
    //            match response.text().await 
    //        {
    //                Ok(text) => {
    //                    println!("Response JSON: {}", text);
    //                    return HttpResponse::Ok().body(text);
    //                },
    //                Err(_) => HttpResponse::InternalServerError().finish(),
    //        },
    //        Err(_) => HttpResponse::InternalServerError().finish(),    
    //    }

    //HttpResponse::Ok().body("get_user")
}
//#[get("/getGithubAccessToken")]
//pub async fn get_github_access_token(query: web::Query<AccessTokenQuery>) -> impl Responder {
//    let code = &query.code;
//    println!("{}", code);
//    println!("SDLFJSDL:FJSLDFJ");
//    HttpResponse::Ok().body("get_user")
//}
