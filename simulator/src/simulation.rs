use crate::drone::Drone;
use crate::env::Environment;

pub struct Simulation {
    pub environment: Environment,
    pub drone: Drone,
    pub max_ticks: Option<usize>,
    pub current_tick: usize,
}

impl Simulation {
    pub fn new(environment: Environment, drone: Drone, max_ticks: Option<usize>) -> Self {
        Simulation {
            environment,
            drone,
            max_ticks,
            current_tick: 0,
        }
    }

    pub fn tick(&mut self) {
        self.environment.move_target();
        self.drone.scan_environment(&self.environment);
        self.drone.update_status();
        self.drone.make_move();
        self.drone.scan_environment(&self.environment);
        self.print();
    }

    pub fn run(&mut self) {
        self.print();
        match self.max_ticks {
            // If max_ticks defined, only simulate until max_tick
            Some(max_ticks) => {
                for _ in 0..max_ticks {
                    self.current_tick += 1;
                    self.tick();
                }
            }
            // Otherwise, loop forever
            None => loop {
                self.current_tick += 1;
                self.tick();
            },
        }
    }

    pub fn print(&self) {
        let size = self.environment.terrain.size;
        let target = &self.environment.target;
        let drone = &self.drone;

        println!("Tick {}", self.current_tick);
        println!(
            "Target is at ({}, {})",
            self.environment.target.x, self.environment.target.y
        );
        println!(
            "Drone is at ({}, {}) in {:?} mode",
            self.drone.x, self.drone.y, self.drone.status
        );

        for i in 0..size {
            for j in 0..size {
                let tile = &self.environment.terrain.grid[i][j];
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
