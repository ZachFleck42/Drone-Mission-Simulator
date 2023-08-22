use actix_web::{post, web, HttpResponse, Responder};
use diesel::RunQueryDsl;
use nanoid::nanoid;

use crate::models::{APIResponse, NewSimulation, SimulationParameters};
use crate::schema::simulations;
use crate::simulator::{drone, env, simulation, utils::get_timestamp};
use crate::DbPool;

#[post("/sim")]
async fn sim(
    pool: web::Data<DbPool>,
    simulation_request: web::Json<SimulationParameters>,
) -> impl Responder {
    // Check parameters to prevent misuse /abuse of API resources
    if simulation_request.terrain_grid_size < 2
        || simulation_request.terrain_grid_size > 64
        || simulation_request.terrain_hostile_rate > 30
        || simulation_request.target_move_rate > 99
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

    // Generate metadata and run the simulation
    let sim_id = nanoid!();
    let sim_timestamp = get_timestamp();
    let sim_frames = sim.run();

    // Append the simulation and its parameters to the database
    let db_sim_entry = NewSimulation {
        generated_id: sim_id.clone(),
        generated_time: sim_timestamp.clone() as i64,
        no_frames: simulation_request.sim_max_frames as i32,
        grid_size: simulation_request.terrain_grid_size as i32,
        hostile_rate: simulation_request.terrain_hostile_rate as i16,
        move_rate: simulation_request.target_move_rate as i16,
        drone_move_range: simulation_request.drone_move_range as i16,
        drone_vis_range: simulation_request.drone_vis_range as i16,
        frames: serde_json::json!(sim_frames),
    };

    let _ = web::block(move || {
        let mut conn = pool.get().expect("Couldn't get db connection from pool");

        diesel::insert_into(simulations::table)
            .values(&db_sim_entry)
            .execute(&mut conn)
            .expect("Error inserting simulation")
    });

    // Return the simulation to the requesting party
    let api_response = APIResponse {
        id: sim_id,
        timestamp: sim_timestamp,
        frames: sim_frames,
    };

    return HttpResponse::Ok().json(api_response);
}
