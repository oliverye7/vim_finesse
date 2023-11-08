mod api;
mod model;
mod db;

use actix_web::{web, middleware::Logger, App, HttpServer};
use api::challenge::{get_challenge, get_specific_challenge};
use api::user::{create_user, get_user};
use db::conn::create_db_pool;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Logger
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    // Database pool initialization
    let pool = create_db_pool().await.expect("Failed to create database pool.");

    // Server declaration
    HttpServer::new(move || {
        let logger = Logger::default();
        App::new()
            .wrap(logger)
            .app_data(web::Data::new(pool.clone()))
            // All service routes go here
            .service(get_user)
            .service(create_user)
            .service(get_challenge)
            .service(get_specific_challenge)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
