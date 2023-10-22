use actix_web::{delete, get, post, put, HttpResponse, Responder};

#[get("/user")]
pub async fn get_user() -> impl Responder {
    println!("service pinged");
    HttpResponse::Ok().body("get_user")
}

#[post("/user")]
pub async fn create_user(user: String) -> impl Responder {
    println!("Welcome, {}!", user);
    HttpResponse::Ok().body("create_user")
}
//pub async fn create_user() -> impl Responder {
//    HttpResponse::Ok().body("create_user")
//}

//#[put("/user")]
//pub async fn update_user() -> impl Responder {
//    //HttpResponse::Ok().body("update_user")
//}
