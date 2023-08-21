#[allow(dead_code)]
mod simulator;
use simulator::simulation::Frame;
use simulator::utils::get_timestamp;

use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use nanoid::nanoid;
use serde::{Deserialize, Serialize};

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
    println!("Starting Web server!");
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(hello)
            .service(echo)
            .service(sim)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
