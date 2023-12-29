use sqlx::postgres::PgPoolOptions;
use sqlx::Pool;
use std::env;

// Function to initialize the database used by the main function.
pub async fn create_db_pool() -> Result<Pool<sqlx::Postgres>, sqlx::Error> {
    let database_url = env::var("VIM_DATABASE_URL").expect("VIM_DATABASE_URL must be set (make sure the VIM_DATABASE_URL environment variable is set (perhaps check your bash profile and source it))");
    PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
}
