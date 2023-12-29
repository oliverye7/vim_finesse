use actix_web::{get, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
//use log::info;
//use prost::Message;
use sqlx::Pool;
use bcrypt::{hash, verify, DEFAULT_COST};

#[derive(Deserialize, Serialize)]
pub struct RegisterRequest {
    id: String,
    username: String,
    passcode: String,
    email: String,
    token: String,
}

#[get("/user")]
pub async fn get_user() -> impl Responder {
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(_request: web::Bytes) -> impl Responder {
    HttpResponse::Ok().body("create_user")
}

#[post("/login")]
pub async fn login(_request: web::Bytes) -> impl Responder {
    // use the bcrypt verify function
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

    let hashed_password = hash(&user.passcode, DEFAULT_COST).expect("Error hashing password");
    println!("{}", user.passcode);
    println!("{}", hashed_password);
    let is_valid = verify(&user.passcode, &hashed_password).expect("Error verifying password");
    println!("{}", is_valid);
    match sqlx::query!("SELECT * FROM users WHERE username = $1;", user.username)
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
    }

    let id = Uuid::new_v4();
    let temp_token = "token";
    //let hashed_password = hash(user.passcode, DEFAULT_COST).expect("Error hashing password");
    //println(user.passcode);
    //println(hashed_password);

    match sqlx::query!(
        "INSERT INTO users (id, username, passcode, email, token) VALUES ($1, $2, $3, $4, $5) RETURNING id;",
        id,
        user.username,
        user.passcode,
        user.email,
        temp_token
    )
    .fetch_one(conn)
    .await
    {
        Ok(_record) => {
            HttpResponse::Ok().json(format!("User {} successfully added", user.username))
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Server Error: {}", e)),
    }
}
