mod drone;
mod env;
mod simulation;
mod utils;

fn main() {
    // Define default values for environment and generate
    let grid_size = 16; // Grid will take the form [grid_size x grid_side]
    let hostile_rate = 10; // Chance out of 100 for any given tile to be 'hostile'
    let target_move_rate = 20; // Chance out of 100 for target to move each tick
    let environment = env::Environment::new(grid_size, hostile_rate, target_move_rate);

    // Define default values for drone and generate
    let move_range = 1; // How many tiles the drone can move each tick
    let visibility_range = 2; // How many tiles the drone can see from its position
    let (entry_point_x, entry_point_y) = environment.generate_entry_point();
    let drone = drone::Drone::new(
        entry_point_x,
        entry_point_y,
        grid_size,
        move_range,
        visibility_range,
    );

    // Define default values for simulation and generate
    let max_ticks = Some(100); // How many ticks/updates to run the simulation
    let mut sim = simulation::Simulation::new(environment, drone, max_ticks);

    // Run simulation
    sim.run();
}
