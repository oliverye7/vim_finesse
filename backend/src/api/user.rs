use actix_web::{get, post, web, HttpResponse, Responder};
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use bytes::BytesMut;
//use log::info;
//use prost::Message;
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
    let temp_token = "token";

    match sqlx::query!(
        "SELECT * FROM users WHERE username = $1;",
        user.username
    )
    .fetch_one(conn)
    .await
    {
        Ok(_record) => {
            return HttpResponse::BadRequest().body("User already exists");
        }
        Err(sqlx::Error::RowNotFound) => {
            // If no record is found, do nothing and proceed
        }
        Err(e) => {
            return HttpResponse::InternalServerError().body(format!("Server Error: {}", e));
        }
        //Ok(Some(record)) => {
        //    return HttpResponse::BadRequest().body("User already exists");
        //}
        //Ok(None) => {
        //    // do nothing, execute the query on line 58
        //}
        //Err(e) =>  {
        //    return HttpResponse::InternalServerError().body(format!("Server Error: {}", e));
        //}
    }

    match sqlx::query!(
        "INSERT INTO users (id, username, email, token) VALUES ($1, $2, $3, $4) RETURNING id;",
        id,
        user.username,
        user.email,
        temp_token
    )
    .fetch_one(conn)
    .await
    {
        Ok(_record) => HttpResponse::Ok().json(format!("User {} successfully added", user.username)), // or handle the returned ID as needed
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Server Error: {}", e))
        }
    }
}
