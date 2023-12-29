use actix_web::{get, post, web, HttpResponse, Responder};
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use bytes::BytesMut;
use log::info;
use prost::Message;
use sqlx::Pool;

#[derive(Deserialize, Serialize)]
struct RegisterRequest {
    id: String,
    username: String,
    email: String,
    token: String,
}

#[get("/user")]
pub async fn get_user() -> impl Responder {
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(request: web::Bytes) -> impl Responder {
    HttpResponse::Ok().body("create_user")
}

#[post("/register")]
pub async fn register(
    pool: web::Data<Pool<sqlx::Postgres>>,
    info: web::Json<RegisterRequest>,
) -> impl Responder {
    // note: actix-web will expect the input to be formatted as if it is a RegisterRequest object, and it will take care of error handling
    let conn = pool.get_ref();
    let user = &info.into_inner();

    let id = Uuid::new_v4();
    let TEMP_TOKEN = "token";

    match sqlx::query!(
        "SELECT * FROM users WHERE user.username = $1",
        user.username
    )
    .fetch_one(conn)
    .await
    {
        Ok(Some(record)) => {
            HttpResponse::BadRequest().body("User already exists");
        }
        Ok(None) => {
            // do nothing, execute the query on line 58
        }
        Err(e) =>  {
            HttpResponse::InternalServerError().body(format!("Server Error: {}", e))
        }
    }

    match sqlx::query!(
        "INSERT INTO users (id, username, email, token) VALUES ($1, $2, $3, $4) RETURNING id",
        id,
        user.username,
        user.email,
        TEMP_TOKEN
    )
    .fetch_one(conn)
    .await
    {
        Ok(record) => HttpResponse::Ok().json(format!("User {} successfully added", user.username)), // or handle the returned ID as needed
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Server Error: {}", e))
        }
    }
}
