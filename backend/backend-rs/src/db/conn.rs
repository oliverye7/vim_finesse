use sqlx::postgres::PgPoolOptions;
use sqlx::Pool;
use std::env;

// Function to initialize the database used by the main function.
pub async fn create_db_pool() -> Result<Pool<sqlx::Postgres>, sqlx::Error> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
}
