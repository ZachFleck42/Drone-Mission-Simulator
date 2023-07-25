use crate::utils::random_choice;
use crate::utils::Direction;
use rand::Rng;

pub struct Tile {
    pub x: usize,
    pub y: usize,
    pub hostile: bool,
}

pub struct Terrain {
    pub size: usize,
    pub grid: Vec<Vec<Tile>>,
}

pub struct Target {
    pub x: usize,
    pub y: usize,
    pub move_rate: usize,
    pub name: Option<String>,
}

pub struct Environment {
    pub terrain: Terrain,
    pub target: Target,
}

impl Terrain {
    pub fn new(size: usize, hostile_rate: usize) -> Self {
        let mut rng = rand::thread_rng();
        let mut grid = Vec::with_capacity(size);

        for x in 0..size {
            let mut row = Vec::with_capacity(size);
            for y in 0..size {
                let hostile = rng.gen_range(0..100) < hostile_rate;

                let tile = Tile { x, y, hostile };
                row.push(tile);
            }
            grid.push(row);
        }

        Terrain { size, grid }
    }

    pub fn print(&self) {
        for i in 0..self.grid.len() {
            for j in 0..self.grid[0].len() {
                let tile = &self.grid[i][j];
                let symbol = if tile.hostile { 'X' } else { 'O' };
                print!("{} ", symbol);
            }
            println!();
        }
    }
}

impl Environment {
    pub fn new(grid_size: usize, hostile_rate: usize, target_move_rate: usize) -> Self {
        let terrain = Terrain::new(grid_size, hostile_rate);
        let target = Target {
            x: rand::thread_rng().gen_range(0..terrain.size),
            y: rand::thread_rng().gen_range(0..terrain.size),
            move_rate: target_move_rate,
            name: None,
        };

        Environment { terrain, target }
    }

    /// Randomly selects and returns the coordinates of a non-hostile,
    /// non-target tile on the edge of the environment's terrain.
    pub fn generate_entry_point(&self) -> (usize, usize) {
        let max_bound = self.terrain.size - 1;
        let mut rng = rand::thread_rng();
        let mut x;
        let mut y;

        loop {
            if random_choice(&[true, false]) {
                x = random_choice(&[0, max_bound]);
                y = rng.gen_range(0..max_bound);
            } else {
                x = rng.gen_range(0..max_bound);
                y = random_choice(&[0, max_bound]);
            }

            let tile = &self.terrain.grid[x][y];
            if tile.hostile || (self.target.x == x && self.target.y == y) {
                continue;
            }

            return (x, y);
        }
    }

    pub fn move_target(&mut self) {
        let mut rng = rand::thread_rng();
        if rng.gen_range(0..100) < self.target.move_rate {
            let mut valid_directions = Vec::new();

            if self.target.x > 0 {
                valid_directions.push(Direction::Up);
            }
            if self.target.x < self.terrain.size - 1 {
                valid_directions.push(Direction::Down);
            }
            if self.target.y > 0 {
                valid_directions.push(Direction::Left);
            }
            if self.target.y < self.terrain.size - 1 {
                valid_directions.push(Direction::Right);
            }

            if !valid_directions.is_empty() {
                let direction = valid_directions[rng.gen_range(0..valid_directions.len())];

                match direction {
                    Direction::Up => self.target.x -= 1,
                    Direction::Down => self.target.x += 1,
                    Direction::Left => self.target.y -= 1,
                    Direction::Right => self.target.y += 1,
                }
            }
        }
    }

    pub fn print(&self) {
        for i in 0..self.terrain.size {
            for j in 0..self.terrain.size {
                let tile = &self.terrain.grid[i][j];

                let symbol = if tile.x == self.target.x && tile.y == self.target.y {
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
    }
}
