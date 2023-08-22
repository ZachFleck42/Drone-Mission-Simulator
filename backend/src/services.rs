use actix_web::{get, post, web, HttpResponse, Responder};
use diesel::{PgConnection, QueryResult, RunQueryDsl};
use nanoid::nanoid;
use serde::{Deserialize, Serialize};

use crate::models::{NewSimulation, Simulation};
use crate::schema::simulations;
use crate::simulator::{drone, env, simulation, utils::get_timestamp};
use crate::DbPool;

fn insert_new_sim(conn: &mut PgConnection, new_sim: NewSimulation) -> usize {
    diesel::insert_into(simulations::table)
        .values(&new_sim)
        .execute(conn)
        .expect("Error inserting simulation")
}

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
    frames: Vec<simulation::Frame>,
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
async fn sim(
    pool: web::Data<DbPool>,
    simulation_request: web::Json<SimulationParameters>,
) -> impl Responder {
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
    let environment = env::Environment::new(
        simulation_request.terrain_grid_size,
        simulation_request.terrain_hostile_rate,
        simulation_request.target_move_rate,
    );

    let (entry_point_x, entry_point_y) = environment.generate_entry_point();
    let drone = drone::Drone::new(
        entry_point_x,
        entry_point_y,
        simulation_request.terrain_grid_size,
        simulation_request.drone_move_range,
        simulation_request.drone_vis_range,
    );

    let mut sim =
        simulation::Simulation::new(environment, drone, Some(simulation_request.sim_max_frames));

    let sim_id = nanoid!();
    let sim_timestamp = get_timestamp();
    let sim_frames = sim.run();

    // Add simulation and parameters to simulations table
    let db_sim_entry = crate::models::NewSimulation {
        generated_id: sim_id.clone(),
        generated_time: sim_timestamp.clone() as i64,
        no_frames: simulation_request.sim_max_frames as i32,
        grid_size: simulation_request.terrain_grid_size as i32,
        hostile_rate: simulation_request.terrain_hostile_rate as i16,
        move_rate: simulation_request.target_move_rate as i16,
        drone_move_range: simulation_request.drone_move_range as i16,
        drone_vis_range: simulation_request.drone_vis_range as i16,
    };

    let _ = web::block(move || {
        let mut conn = pool.get().expect("Couldn't get db connection from pool");
        insert_new_sim(&mut conn, db_sim_entry);
    });

    let api_response = APIResponse {
        id: sim_id,
        timestamp: sim_timestamp,
        frames: sim_frames,
    };

    return HttpResponse::Ok().json(api_response);
}
