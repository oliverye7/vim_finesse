//use log::info;
use actix_web::{get, post, web, HttpRequest, HttpResponse, Responder};
use dotenv::dotenv;
use reqwest;
use serde::{Deserialize, Serialize};
use sqlx::Pool;
use std::env;

/*
 * Defines the contents of a get request to /getGithubAccessToken
*/
#[derive(Deserialize)]
pub struct AccessTokenQuery {
    code: String,
}

/*
 * Defines the contents of a get request to /getUserName
 * id is the user's unique github id and is also the primary key used to query the db
*/
#[derive(Deserialize)]
pub struct UserNameQuery {
    id: i32,
}

/*
 * Defines the return contents of a get request to /getUserName
*/
#[derive(Serialize)]
pub struct UsernameJsonResponse {
    username: String,
}

/*
 * Defines the contents of a post request to /setUsername
 * username, avatar_url, github_username will be added to the db,
 * keyed on the id, which is a user's github user id
*/
#[derive(Deserialize, Debug)]
pub struct UserData {
    username: String,
    avatar_url: String,
    id: i32,
    github_username: String,
}

#[get("/user")]
pub async fn get_user() -> impl Responder {
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(_request: web::Bytes) -> impl Responder {
    HttpResponse::Ok().body("create_user")
}

/*
 * Updates db with a new username, mapped to a user's id
*/
#[post("/setUsername")]
pub async fn set_username(
    pool: web::Data<Pool<sqlx::Postgres>>,
    data: web::Json<UserData>,
) -> impl Responder {
    let mut txn = pool.get_ref().begin().await.unwrap();
    match sqlx::query!("SELECT * FROM users WHERE username = $1;", data.username)
          .fetch_optional(&mut *txn)
          .await
          {
            Ok(Some(_)) => {
                txn.rollback().await.unwrap();
                return HttpResponse::BadRequest().body("User already exists");
                
            }
            Ok(None) => {
                // do nothing
            }
            Err(sqlx::Error::RowNotFound) => {
                // do nothing
            }
            Err(e) => {
                txn.rollback().await.unwrap();
                return HttpResponse::InternalServerError().body(format!("Server Error: {}", e));
            }
            };

    match sqlx::query!(
        "INSERT INTO users (id, username, avatar_url, github_username) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url, github_username = EXCLUDED.github_username RETURNING id;",
        data.id,
        data.username,
        data.avatar_url,
        data.github_username
    )
    .fetch_one(&mut *txn)
    .await
    {
        Ok(_record) => {
            txn.commit().await.unwrap();
            return HttpResponse::Ok().json(format!("User {} successfully added", data.username));
        }
        Err(e) => {
            txn.rollback().await.unwrap();
            return HttpResponse::InternalServerError().body(format!("Server Error: {}", e));
        }
    }
}

/*
 * Fetches a user's username
*/
#[get("/getUserName")]
pub async fn get_username(
    pool: web::Data<Pool<sqlx::Postgres>>,
    query: web::Query<UserNameQuery>,
) -> impl Responder {
    let id = &query.id;
    let conn = pool.get_ref();
    match sqlx::query!("SELECT username FROM users WHERE id = $1;", id,)
        .fetch_one(conn)
        .await
    {
        Ok(record) => {
            let response = UsernameJsonResponse {
                username: record.username,
            };
            HttpResponse::Ok().json(response)
        }
        Err(e) => {
            if e.to_string().contains("no rows returned") {
                HttpResponse::BadRequest().body("This user does not exist")
            } else {
                HttpResponse::InternalServerError().body(format!("Server Error: {}", e))
            }
        }
    }
}

/*
 * Retrieves a Github Access Token to allow us to make API calls on behalf of a user
*/
#[get("/getGithubAccessToken")]
pub async fn get_github_access_token(query: web::Query<AccessTokenQuery>) -> impl Responder {
    dotenv().ok();

    let github_client_id = env::var("GITHUB_CLIENT_ID").expect("GITHUB_CLIENT_ID not set");
    let github_client_secret =
        env::var("GITHUB_CLIENT_SECRET").expect("GITHUB_CLIENT_SECRET not set");

    let code = &query.code;
    let client = reqwest::Client::new();

    let params = [
        ("client_id", &github_client_id),
        ("client_secret", &github_client_secret),
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

/*
 * Fetches data about a user
*/
#[get("/getUserGithubProfile")]
pub async fn get_user_github_profile(request: HttpRequest) -> impl Responder {
    let auth_header = match request.headers().get("Authorization") {
        Some(header) => header.to_str().unwrap_or(""),
        None => return HttpResponse::BadRequest().body("Authorization header missing"),
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
                return HttpResponse::Ok().body(text);
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
