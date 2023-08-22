#![allow(dead_code, unused_comparisons)]
mod db_utils;
mod simulator;
use db_utils::{get_pool, AppState, DbActor};
use simulator::simulation::Frame;
use simulator::utils::get_timestamp;

use actix::SyncArbiter;
use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use diesel::{
    r2d2::{ConnectionManager, Pool},
    PgConnection,
};
use nanoid::nanoid;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct SimulationParameters {
    terrain_grid_size: usize,
    terrain_hostile_rate: usize,
    target_move_rate: usize,
    drone_move_range: usize,
    drone_vis_range: usize,
    sim_max_frames: usize,
}

#[derive(Serialize)]
struct APIResponse {
    id: String,
    timestamp: u64,
    frames: Vec<Frame>,
}

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

#[post("/sim")]
async fn sim(simulation_request: web::Json<SimulationParameters>) -> impl Responder {
    // API checks to prevent misuse /abuse of resources
    if simulation_request.terrain_grid_size < 2
        || simulation_request.terrain_grid_size > 64
        || simulation_request.terrain_hostile_rate < 0
        || simulation_request.terrain_hostile_rate > 30
        || simulation_request.target_move_rate < 0
        || simulation_request.target_move_rate > 99
        || simulation_request.drone_move_range < 0
        || simulation_request.drone_vis_range < 0
        || simulation_request.sim_max_frames < 0
        || simulation_request.sim_max_frames > 1024
    {
        return HttpResponse::BadRequest().json("Invalid params");
    }

    // Build the simulation from the provided params
    let environment = simulator::env::Environment::new(
        simulation_request.terrain_grid_size,
        simulation_request.terrain_hostile_rate,
        simulation_request.target_move_rate,
    );

    let (entry_point_x, entry_point_y) = environment.generate_entry_point();
    let drone = simulator::drone::Drone::new(
        entry_point_x,
        entry_point_y,
        simulation_request.terrain_grid_size,
        simulation_request.drone_move_range,
        simulation_request.drone_vis_range,
    );

    let mut sim = simulator::simulation::Simulation::new(
        environment,
        drone,
        Some(simulation_request.sim_max_frames),
    );

    let response = APIResponse {
        id: nanoid!(),
        timestamp: get_timestamp(),
        frames: sim.run(),
    };

    return HttpResponse::Ok().json(response);
}

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
