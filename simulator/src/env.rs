use crate::utils::random_choice;
use crate::utils::DIRECTIONS;
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
    /// empty tile on the edge of the environment's terrain.
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
        if rand::thread_rng().gen_range(0..100) < self.target.move_rate {
            let mut valid_moves = Vec::new();
            let max_bound = self.terrain.size as i32;

            for (dx, dy) in &DIRECTIONS {
                let new_x = self.target.x as i32 + dx;
                let new_y = self.target.y as i32 + dy;

                if new_x >= 0 && new_x < max_bound && new_y >= 0 && new_y < max_bound {
                    valid_moves.push((dx, dy));
                }
            }

            if !valid_moves.is_empty() {
                let (dx, dy) = random_choice(&valid_moves);
                self.target.x = (self.target.x as i32 + dx) as usize;
                self.target.y = (self.target.y as i32 + dy) as usize;
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
