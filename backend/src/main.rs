mod api;
mod db;
mod model;

use actix_cors::Cors;
use actix_web::{http, middleware::Logger, web, App, HttpServer};
use api::challenge::{get_challenge, get_specific_challenge, submit_challenge};
use api::user::{create_user, get_github_access_token, get_user, get_user_github_profile, set_username, get_username};
use db::conn::create_db_pool;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Logger
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    // Database pool initialization
    let pool = create_db_pool()
        .await
        .expect("Failed to create database pool.");

    const ACCESS_CONTROL_CACHE_MAX_AGE: usize = 3600;
    const PORT_NUMBER: u16 = 3001;

    // Server declaration
    HttpServer::new(move || {
        let logger = Logger::default();

        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(ACCESS_CONTROL_CACHE_MAX_AGE);

        App::new()
            .wrap(logger)
            .wrap(cors)
            .app_data(web::Data::new(pool.clone()))
            // All service routes go here
            .service(get_user)
            .service(create_user)
            .service(get_github_access_token)
            .service(get_user_github_profile)
            .service(get_username)
            .service(set_username)
            .service(get_challenge)
            .service(get_specific_challenge)
            .service(submit_challenge)
    })
    .bind(("127.0.0.1", PORT_NUMBER))?
    .run()
    .await
}
