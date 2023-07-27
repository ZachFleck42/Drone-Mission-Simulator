use crate::env::Environment;
use crate::utils::get_distance_to_tile;
use crate::utils::get_surrounding_tiles;
use std::collections::{HashSet, VecDeque};

pub enum Status {
    Searching,
    Monitoring,
}

#[derive(PartialEq)]
pub enum Hostile {
    True,
    False,
    Unknown,
}
#[derive(PartialEq)]
pub enum TileContent {
    Empty,
    Target,
}

pub struct Tile {
    pub x: usize,
    pub y: usize,
    pub hostile: Hostile,
    pub content: TileContent,
}

pub struct EnvData {
    pub grid_size: usize,
    pub grid: Vec<Vec<Tile>>,
    pub last_target_pos: Option<(usize, usize)>,
}

pub struct Drone {
    pub x: usize,
    pub y: usize,
    pub move_range: usize,
    pub visibility_range: usize,
    pub status: Status,
    pub path_history: Vec<(usize, usize)>,
    pub data: EnvData,
}

impl Drone {
    pub fn new(
        start_x: usize,
        start_y: usize,
        grid_size: usize,
        speed: usize,
        visibility_range: usize,
    ) -> Self {
        let mut grid = Vec::with_capacity(grid_size);
        for x in 0..grid_size {
            let mut row = Vec::with_capacity(grid_size);
            for y in 0..grid_size {
                let tile = Tile {
                    x,
                    y,
                    hostile: Hostile::Unknown,
                    content: TileContent::Empty,
                };
                row.push(tile);
            }
            grid.push(row);
        }

        let data = EnvData {
            grid_size,
            grid,
            last_target_pos: None,
        };

        Drone {
            x: start_x,
            y: start_y,
            move_range: speed,
            visibility_range,
            status: Status::Searching,
            path_history: vec![(start_x, start_y)],
            data,
        }
    }

    pub fn scan_environment(&mut self, environment: &Environment) {
        for (x, y) in self.get_visible_tiles() {
            let env_tile = &environment.terrain.grid[x][y];

            if env_tile.hostile {
                self.data.grid[x][y].hostile = Hostile::True;
            } else {
                self.data.grid[x][y].hostile = Hostile::False;
            }

            if x == environment.target.x && y == environment.target.y {
                self.data.grid[x][y].content = TileContent::Target;
                self.data.last_target_pos = Some((x, y));
            } else {
                self.data.grid[x][y].content = TileContent::Empty;
            }
        }
    }

    fn get_visible_tiles(&self) -> Vec<(usize, usize)> {
        get_surrounding_tiles(self.data.grid_size, self.visibility_range, self.x, self.y)
    }

    fn get_distance_to(&self, target_x: usize, target_y: usize) -> f64 {
        get_distance_to_tile(self.x, self.y, target_x, target_y)
    }

    pub fn get_valid_moves(&self) -> Vec<(usize, usize)> {
        let mut valid_moves = Vec::new();
        for (x, y) in get_surrounding_tiles(self.data.grid_size, self.move_range, self.x, self.y) {
            if self.is_valid_move(x, y) {
                valid_moves.push((x, y));
            }
        }

        valid_moves
    }

    fn is_valid_move(&self, x: usize, y: usize) -> bool {
        let tile = &self.data.grid[x][y];
        if tile.hostile == Hostile::True || tile.content != TileContent::Empty {
            return false;
        }

        true
    }

    pub fn update_status(&mut self) {
        for (x, y) in self.get_visible_tiles() {
            if self.data.grid[x][y].content == TileContent::Target {
                self.status = Status::Monitoring;
                return;
            }
        }

        self.status = Status::Searching
    }

    pub fn make_move(&mut self) {
        let best_move = match self.status {
            Status::Searching => self.search(),
            Status::Monitoring => self.search(),
        };

        (self.x, self.y) = best_move;
        self.path_history.push(best_move);
    }

    fn get_closest_option(&self, options: Vec<(usize, usize)>) -> (usize, usize) {
        let mut closest_distance = f64::MAX;
        let mut closest_tile = options[0];

        for (x, y) in options {
            let distance_to_tile = self.get_distance_to(x, y);
            if distance_to_tile < closest_distance {
                closest_distance = distance_to_tile;
                closest_tile = (x, y);
            }
        }

        closest_tile
    }

    fn all_unrevealed_tiles(&self) -> Vec<(usize, usize)> {
        let mut unrevealed_tiles = Vec::new();
        for x in 0..self.data.grid_size {
            for y in 0..self.data.grid_size {
                if self.data.grid[x][y].hostile == Hostile::Unknown {
                    unrevealed_tiles.push((x, y));
                }
            }
        }

        unrevealed_tiles
    }

    fn best_path_to(&self, target_x: usize, target_y: usize) -> Option<Vec<(usize, usize)>> {
        let mut queue: VecDeque<(usize, usize, Vec<(usize, usize)>)> = VecDeque::new();
        let mut visited: HashSet<(usize, usize)> = HashSet::new();

        queue.push_back((self.x, self.y, Vec::new()));
        visited.insert((self.x, self.y));

        while let Some((current_x, current_y, path)) = queue.pop_front() {
            if current_x == target_x && current_y == target_y {
                return Some(path);
            }

            for (move_x, move_y) in
                get_surrounding_tiles(self.data.grid_size, self.move_range, current_x, current_y)
            {
                if self.is_valid_move(move_x, move_y) && !visited.contains(&(move_x, move_y)) {
                    let mut new_path = path.clone();
                    new_path.push((move_x, move_y));
                    visited.insert((move_x, move_y));
                    queue.push_back((move_x, move_y, new_path));
                }
            }
        }

        None
    }

    fn search(&self) -> (usize, usize) {
        let mut best_move_score = 0;
        let mut best_move = (self.x, self.y);

        // Check every possible move and determine which will reveal the most tiles
        for potential_move in self.get_valid_moves() {
            let (x, y) = (potential_move.0, potential_move.1);

            let mut move_score = 0;
            for (vis_x, vis_y) in
                get_surrounding_tiles(self.data.grid_size, self.visibility_range, x, y)
            {
                if self.data.grid[vis_x][vis_y].hostile == Hostile::Unknown {
                    move_score += 1;
                }
            }

            if move_score == 0 || move_score < best_move_score {
                continue;
            } else if move_score > best_move_score {
                best_move_score = move_score;
                best_move = potential_move;
            }
        }

        // If no moves will reveal additional tiles, then begin moving towards
        // the nearest unrevealed tile
        if best_move_score == 0 {
            let unrevealed_tiles = self.all_unrevealed_tiles();
            if !unrevealed_tiles.is_empty() {
                let (unrevealed_x, unrevealed_y) = self.get_closest_option(unrevealed_tiles);
                if let Some(path) = self.best_path_to(unrevealed_x, unrevealed_y) {
                    best_move = path[0];
                }
            }
        }

        best_move
    }

    fn monitor(&self) -> (usize, usize) {
        let best_move = (self.x, self.y);

        let (mut target_x, mut target_y) = (0, 0);
        for (x, y) in self.get_visible_tiles() {
            if self.data.grid[x][y].content == TileContent::Target {
                (target_x, target_y) = (x, y);
                break;
            }
        }

        if self.get_distance_to(target_x, target_y) > 1.0 {
            let target_adjacent_tiles =
                get_surrounding_tiles(self.data.grid_size, 1, target_x, target_y);
            return best_move;
        }

        // Determine which of the 8 tiles around the target drone is in
        // Determine which tile the drone should get to next
        best_move
    }

    pub fn print_grid(&self) {
        for i in 0..self.data.grid_size {
            for j in 0..self.data.grid_size {
                let tile = &self.data.grid[i][j];

                let symbol = match tile.hostile {
                    Hostile::Unknown => '?',
                    Hostile::True => 'X',
                    Hostile::False => 'O',
                };

                if tile.x == self.x && tile.y == self.y {
                    print!("D ");
                } else if tile.content == TileContent::Target {
                    print!("T!");
                } else {
                    print!("{} ", symbol);
                }
            }
            println!();
        }
        println!();
    }
}
