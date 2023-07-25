mod drone;
mod env;
mod sim;
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

    // Create simulation
    let mut sim = sim::Simulation::new(environment, drone);

    // Print initial environment
    println!(
        "Initial: Target is at ({}, {})",
        sim.environment.target.x, sim.environment.target.y
    );
    sim.environment.print();
    println!();

    // Simulate target movement for 10 ticks
    for tick in 1..=10 {
        sim.environment.move_target();
        println!(
            "Tick {}: Target is at ({}, {})",
            tick, sim.environment.target.x, sim.environment.target.y
        );
        println!(
            "Tick {}: Drone is at ({}, {})",
            tick, sim.drone.x, sim.drone.y
        );
        sim.environment.print();
        println!();
    }
}
