mod env;

fn main() {
    // Define terrain variables and generate terrain accordingly
    let grid_size = 8;
    let hostile_rate = 10;
    let terrain = env::Terrain::new(grid_size, hostile_rate);

    // Randomly place a target within the terrain and track both in environment
    let mut environment = env::Environment::new(terrain);

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
