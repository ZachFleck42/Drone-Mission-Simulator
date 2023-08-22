use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = 'simulations')]
pub struct Simulation {
    pub id: i64,
    pub generated_id: String,
    pub generated_time: i64,
    pub no_frames: i64,
    pub grid_size: i64,
    pub hostile_rate: i64,
    pub move_rate: i64,
    pub drone_move_range: i64,
    pub drone_vis_range: i64,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = 'simulation_frames')]
pub struct SimulationFrame {
    pub id: i64,
    pub sim_id: i64,
    pub frame_no: i64,
    pub environment: String,
    pub drone: String,
}
