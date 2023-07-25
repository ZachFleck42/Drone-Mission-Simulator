// mod drone;
mod env;

fn main() {
    // Define default values for environment and generate
    let grid_size = 8;
    let hostile_rate = 10;
    let target_move_rate = 80;
    let mut environment = env::generate_environment(grid_size, hostile_rate, target_move_rate);

    // Define default values for drone and generate

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
        environment.print();
        println!();
    }
}
