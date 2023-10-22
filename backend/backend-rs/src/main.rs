mod api;
mod model;

use actix_web::{middleware::Logger, App, HttpServer};

// use api::challenge::{get_challenge, get_specific_challenge};

use api::user::create_user;
use api::user::get_user;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("main says hi");
    HttpServer::new(move || {
        let logger = Logger::default();
        App::new()
            .wrap(logger)
            .service(get_user)
            .service(create_user)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
