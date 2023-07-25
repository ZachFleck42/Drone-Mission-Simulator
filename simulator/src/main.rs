mod drone;
mod env;
mod simulation;
mod utils;

fn main() {
    // Define default values for environment and generate
    let grid_size = 8;
    let hostile_rate = 10;
    let target_move_rate = 80;
    let mut environment = env::generate_environment(grid_size, hostile_rate, target_move_rate);

    // Define default values for drone and generate
    let visibility_range = 2;
    let (entry_point_x, entry_point_y) = environment.generate_entry_point();
    let mut drone = drone::Drone::new(entry_point_x, entry_point_y, visibility_range);

    // Define default values for simulation and generate
    let max_ticks = Some(10);
    let mut sim = simulation::Simulation::new(environment, drone, max_ticks);

    // Run simulation
    sim.run();
}
