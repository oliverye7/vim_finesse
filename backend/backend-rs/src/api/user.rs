use log::info;
use actix_web::{get, post, web, HttpResponse, Responder};
use bytes::BytesMut;
use prost::Message;

#[get("/user")]
pub async fn get_user() -> impl Responder {
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(request: web::Bytes) -> impl Responder {
    
    HttpResponse::Ok().body("create_user")
}
