use crate::drone::Drone;
use crate::drone::Hostile;
use crate::drone::TileContent;
use crate::env::Environment;

pub struct Simulation {
    pub environment: Environment,
    pub drone: Drone,
    pub max_ticks: Option<usize>,
    pub tick: usize,
}

impl Simulation {
    pub fn new(environment: Environment, drone: Drone, max_ticks: Option<usize>) -> Self {
        Simulation {
            environment,
            drone,
            max_ticks,
            tick: 0,
        }
    }

    pub fn tick(&mut self) {
        self.environment.move_target();
        // Update drone status
        // Move drone based on status
        self.drone_scan_terrain();
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

    pub fn drone_scan_terrain(&mut self) {
        let visible_tiles = self.drone.get_visible_tiles(self.drone.x, self.drone.y);
        let drone_grid = &mut self.drone.data.grid;

        for tile in visible_tiles {
            let (x, y) = (tile.0, tile.1);
            let env_tile = &self.environment.terrain.grid[x][y];

            if env_tile.hostile {
                drone_grid[x][y].hostile = Hostile::True;
            } else {
                drone_grid[x][y].hostile = Hostile::False;
            }

            if x == self.environment.target.x && y == self.environment.target.y {
                drone_grid[x][y].content = TileContent::Target;
                self.drone.data.last_target_pos = Some((x, y));
            } else {
                drone_grid[x][y].content = TileContent::Empty;
            }
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
