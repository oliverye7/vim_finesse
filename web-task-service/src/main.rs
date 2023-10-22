mod api; // declare existence of an API module, to be implemented later

use api::task::get_task;

use actix_web::{middleware::Logger, web::Data, App, HttpServer};

#[actix_web::main]

async fn main() -> std::io::Result<()> {
    // set some environment logging variables that we can just enable until prod then we turn it off
    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");
    env_logger::init();

    HttpServer::new(move || {
        let logger = Logger::default();
        App::new().wrap(logger).service(get_task)
    })
    .bind(("127.0.0.2", 80))? // question mark for if there is an error it will propogate up instead of calling .run
    .run()
    .await
}
