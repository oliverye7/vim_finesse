use log::{error, info};
use actix_web::{get, post, web, HttpResponse, Responder};
use bytes::BytesMut;
use prost::Message;
use uuid::Uuid;
use crate::proto::user::{CreateUserRequest, CreateUserResponse};
use serde_json::json;

#[get("/user")]
pub async fn get_user() -> impl Responder {
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(request: web::Bytes) -> impl Responder {
    let mut bytes_mut = BytesMut::from(&request[..]);
    match CreateUserRequest::decode(&mut bytes_mut) {
        Ok(create_user_request) => {
            let id = Uuid::new_v4();
            let username = create_user_request.username;
            let email = create_user_request.email;
            let response = CreateUserResponse {
                id: id.to_string(),
                username: username,
                email: email,
            };
            match serde_json::to_string(&response) {
                Ok(json_response) => HttpResponse::Ok().content_type("application/json").body(json_response),
                Err(e) => {
                    error!("Failed to serialize response: {e}");
                    HttpResponse::InternalServerError().body("Internal server error")
                }
            }
        },
        Err(e) => {
            error!("Failed to serialize response: {e}");
            HttpResponse::BadRequest().body("Invalid request data")
        }
    }
}
