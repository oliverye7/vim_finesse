use migration::Migrator;
use sea_orm_migration::cli;
use sea_schema::migration::*;

#[cfg(debug_assertions)]
use dotenv::dotenv;

#[async_std::main]
async fn main() {
    #[cfg(debug_assertions)]
    dotenv().ok();

    let fallback = "sqlite:./db?mode=rwc";

    match std::env::var("DATABASE_URL") {
        Ok(val) => {
            println!("Using DATABASE_URL: {}", val);
        }
        Err(_) => {
            std::env::set_var("DATABASE_URL", fallback);
            println!("Set DATABASE_URL: {}", fallback);
        }
    };

    cli::run_cli(Migrator).await;
}

fn get_seaorm_create_stmt<E: EntityTrait>(e: E) -> TableCreateStatement {
    let schema = Schema::new(DbBackend::Sqlite);

    schema
        .create_table_from_entity(e)
        .if_not_exists()
        .to_owned()
}

fn get_seaorm_drop_stmt<E: EntityTrait>(e: E) -> TableDropStatement {
    Table::drop().table(e).if_exists().to_owned()
}
