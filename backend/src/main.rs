#![allow(dead_code, unused_comparisons)]
mod models;
mod schema;
mod services;
mod simulator;
use services::{echo, hello, sim};

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use diesel::{
    r2d2::{ConnectionManager, Pool},
    PgConnection,
};
use std::env;

type DbPool = Pool<ConnectionManager<PgConnection>>;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_url: String = env::var("DATABASE_URL").expect("Could not find DATABASE_URL");
    let manager: ConnectionManager<PgConnection> = ConnectionManager::<PgConnection>::new(db_url);
    let pool = Pool::builder()
        .build(manager)
        .expect("Error building a connection pool");

    println!("Starting Web server!");
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .service(hello)
            .service(echo)
            .service(sim)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
