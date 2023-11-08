use actix_web::{get, post, HttpResponse, Responder};

#[get("/user")]
pub async fn get_user() -> impl Responder {
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(user: String) -> impl Responder {
    println!("Welcome, {}!", user);
    HttpResponse::Ok().body("create_user")
}
