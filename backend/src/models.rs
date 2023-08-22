use diesel::{Insertable, Queryable, Selectable};
use serde::{Deserialize, Serialize};

use crate::schema;
use crate::simulator::simulation;

#[derive(Serialize, Deserialize, Clone)]
pub struct SimulationParameters {
    pub terrain_grid_size: usize,
    pub terrain_hostile_rate: usize,
    pub target_move_rate: usize,
    pub drone_move_range: usize,
    pub drone_vis_range: usize,
    pub sim_max_frames: usize,
}

#[derive(Serialize)]
pub struct APIResponse {
    pub id: String,
    pub timestamp: u64,
    pub frames: Vec<simulation::Frame>,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = schema::simulations)]
pub struct Simulation {
    pub id: i32,
    pub generated_id: String,
    pub generated_time: i64,
    pub no_frames: i32,
    pub grid_size: i32,
    pub hostile_rate: i16,
    pub move_rate: i16,
    pub drone_move_range: i16,
    pub drone_vis_range: i16,
}

#[derive(Insertable)]
#[diesel(table_name = schema::simulations)]
pub struct NewSimulation {
    pub generated_id: String,
    pub generated_time: i64,
    pub no_frames: i32,
    pub grid_size: i32,
    pub hostile_rate: i16,
    pub move_rate: i16,
    pub drone_move_range: i16,
    pub drone_vis_range: i16,
    pub frames: serde_json::Value,
}
