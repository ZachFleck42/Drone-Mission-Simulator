mod simulator;

use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct SimReq {
    env_terrain_grid_size: usize,
    env_terrain_hostile_rate: usize,
    env_target_move_rate: usize,
    drone_move_range: usize,
    drone_vis_range: usize,
    sim_max_ticks: usize,
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
async fn sim(sim_req: web::Json<SimReq>) -> impl Responder {
    let environment = simulator::env::Environment::new(
        sim_req.env_terrain_grid_size,
        sim_req.env_terrain_hostile_rate,
        sim_req.env_target_move_rate,
    );

    let (entry_point_x, entry_point_y) = environment.generate_entry_point();
    let drone = simulator::drone::Drone::new(
        entry_point_x,
        entry_point_y,
        sim_req.env_terrain_grid_size,
        sim_req.drone_move_range,
        sim_req.drone_vis_range,
    );

    let mut sim =
        simulator::simulation::Simulation::new(environment, drone, Some(sim_req.sim_max_ticks));

    sim.run();
    HttpResponse::Ok().json(sim_req)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(hello)
            .service(echo)
            .service(sim)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
