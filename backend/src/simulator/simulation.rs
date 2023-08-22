use super::drone::Drone;
use super::env::Environment;

use serde::Serialize;

#[derive(Serialize)]
pub struct Simulation {
    pub environment: Environment,
    pub drone: Drone,
    pub max_frames: Option<usize>,
    pub current_frame: usize,
}

#[derive(Serialize, Clone)]
pub struct Frame {
    pub frame_no: usize,
    pub environment: Environment,
    pub drone: Drone,
}

impl Simulation {
    pub fn new(environment: Environment, drone: Drone, max_frames: Option<usize>) -> Self {
        Simulation {
            environment,
            drone,
            max_frames,
            current_frame: 0,
        }
    }

    pub fn run(&mut self) -> Vec<Frame> {
        let mut frames = vec![Frame {
            frame_no: 0,
            environment: self.environment.clone(),
            drone: self.drone.clone(),
        }];

        match self.max_frames {
            // If max_ticks defined, only simulate until max_tick
            Some(max_frames) => {
                for frame_no in 1..=max_frames {
                    self.tick();
                    frames.push(Frame {
                        frame_no,
                        environment: self.environment.clone(),
                        drone: self.drone.clone(),
                    })
                }
            }
            // Otherwise, loop forever
            None => loop {},
        }

        frames
    }

    pub fn tick(&mut self) {
        self.environment.move_target();
        self.drone.scan_environment(&self.environment);
        for _drone_move in 0..self.drone.move_range {
            self.drone.update_status();
            self.drone.make_move();
            self.drone.scan_environment(&self.environment);
        }
    }

    pub fn print(&self) {
        let size = self.environment.terrain.size;
        let target = &self.environment.target;
        let drone = &self.drone;

        println!("Tick {}", self.current_frame);
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
