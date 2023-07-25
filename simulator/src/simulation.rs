pub struct Simulation {
    pub environment: crate::env::Environment,
    pub drone: crate::drone::Drone,
    pub max_ticks: Option<usize>,
    pub tick: usize,
}

impl Simulation {
    pub fn new(
        environment: crate::env::Environment,
        drone: crate::drone::Drone,
        max_ticks: Option<usize>,
    ) -> Self {
        let mut simulation = Simulation {
            environment,
            drone,
            max_ticks,
            tick: 0,
        };

        simulation
    }

    pub fn tick(&mut self) {
        self.environment.move_target();
        // Update drone status
        // Move drone based on status
        // Collect new data
        // Repeat
        self.print();
    }

    pub fn run(&mut self) {
        match self.max_ticks {
            Some(max_ticks) => {
                for _ in 0..max_ticks {
                    self.tick += 1;
                    self.tick();
                }
            }
            None => loop {
                self.tick += 1;
                self.tick();
            },
        }
    }

    pub fn print(&self) {
        let size = self.environment.terrain.size;
        let target = &self.environment.target;
        let drone = &self.drone;

        println!("Tick {}", self.tick);
        println!(
            "Target is at ({}, {})",
            self.environment.target.x, self.environment.target.y
        );
        println!("Drone is at ({}, {})", self.drone.x, self.drone.y);

        for i in 0..size {
            for j in 0..size {
                let tile = &self.environment.terrain.tiles[i][j];
                let symbol = if tile.x == drone.x && tile.y == drone.y {
                    'D'
                } else if tile.x == target.x && tile.y == target.y {
                    'T'
                } else if tile.hostile {
                    'X'
                } else {
                    'O'
                };
                print!("{} ", symbol);
            }
            println!();
        }
        println!();
    }
}
