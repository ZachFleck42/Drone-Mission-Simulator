#![allow(dead_code)]
mod models;
mod schema;
mod services;
mod simulator;
use services::sim;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use diesel::{
    r2d2::{ConnectionManager, Pool},
    PgConnection,
};

type DbPool = Pool<ConnectionManager<PgConnection>>;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_url: String = std::env::var("DATABASE_URL").expect("Could not find DATABASE_URL");
    let manager: ConnectionManager<PgConnection> = ConnectionManager::<PgConnection>::new(db_url);
    let pool = Pool::builder()
        .build(manager)
        .expect("Error building a connection pool");

    println!("Starting Web server!");
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .service(sim)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
