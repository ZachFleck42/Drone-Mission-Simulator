use crate::schema;
use diesel::{Insertable, Queryable, Selectable};

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
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = schema::simulation_frames)]
pub struct SimulationFrame {
    pub id: i32,
    pub sim_id: i32,
    pub frame_no: i32,
    pub environment: serde_json::Value,
    pub drone: serde_json::Value,
}
