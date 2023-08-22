#![allow(dead_code, unused_comparisons)]
mod db_utils;
mod models;
mod schema;
mod services;
mod simulator;
use db_utils::{get_pool, AppState, DbActor};
use services::{echo, hello, sim};

use actix::SyncArbiter;
use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use diesel::{
    r2d2::{ConnectionManager, Pool},
    PgConnection,
};
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_url: String = env::var("DATABASE_URL").expect("Could not find DATABASE_URL");
    let pool: Pool<ConnectionManager<PgConnection>> = get_pool(&db_url);
    let db_addr = SyncArbiter::start(5, move || DbActor(pool.clone()));

    println!("Starting Web server!");
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(AppState {
                db: db_addr.clone(),
            }))
            .service(hello)
            .service(echo)
            .service(sim)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
