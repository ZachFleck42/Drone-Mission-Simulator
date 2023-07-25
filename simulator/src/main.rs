mod drone;
mod env;
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

    // Print initial environment
    println!(
        "Initial: Target is at ({}, {})",
        environment.target.x, environment.target.y
    );
    environment.print();
    println!();

    // Simulate target movement for 10 ticks
    for tick in 1..=10 {
        environment.move_target();
        println!(
            "Tick {}: Target is at ({}, {})",
            tick, environment.target.x, environment.target.y
        );
        println!("Tick {}: Drone is at ({}, {})", tick, drone.x, drone.y);
        environment.print();
        println!();
    }
}
