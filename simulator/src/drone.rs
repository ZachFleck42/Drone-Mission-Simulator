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
            if self.is_tile_safe(x, y) {
                valid_moves.push((x, y));
            }
        }

        valid_moves
    }

    fn is_tile_safe(&self, x: usize, y: usize) -> bool {
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
                if self.is_tile_safe(move_x, move_y) && !visited.contains(&(move_x, move_y)) {
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
        let mut best_move = (self.x, self.y);

        // Verify the target's location
        let (mut target_x, mut target_y) = (0, 0);
        for (x, y) in self.get_visible_tiles() {
            if self.data.grid[x][y].content == TileContent::Target {
                (target_x, target_y) = (x, y);
                break;
            }
        }

        // Get a list of possible moves and a list of tiles adjacent to the target
        let valid_moves = self.get_valid_moves();
        let target_adjacents = get_surrounding_tiles(self.data.grid_size, 1, target_x, target_y);

        // If the target is more than one tile away...
        let distance_to_target = self.get_distance_to(target_x, target_y);
        if distance_to_target > 1.0 {
            // If there's at lease one element in common between valid_moves and
            // target_adjacents, move to the closest one.
            // Otherwise, find the shortest path to a safe, target-adjacent tile
            // and make the first move towards it.
            let common_tiles: Vec<(usize, usize)> = target_adjacents
                .clone()
                .into_iter()
                .filter(|tile| valid_moves.contains(tile))
                .collect();

            if !common_tiles.is_empty() {
                best_move = self.get_closest_option(common_tiles);
            } else {
                let mut possible_paths: Vec<Vec<(usize, usize)>> = Vec::new();
                for (x, y) in target_adjacents {
                    if !self.is_tile_safe(x, y) {
                        continue;
                    }

                    if let Some(path) = self.best_path_to(x, y) {
                        possible_paths.push(path);
                    }
                }

                if !possible_paths.is_empty() {
                    let mut shortest_path = &possible_paths[0];
                    for path in &possible_paths {
                        if path.len() < shortest_path.len() {
                            shortest_path = &path;
                        }
                    }

                    best_move = shortest_path[0];
                }
            }
        }

        // If the target is one tile away already...
        if distance_to_target as usize == 1 {
            // Determine which specific tile the drone is in relative to the target.
            // This way we can circle around the target in a semi-consistent manner.
            let adjacent_positions = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1)];
            let num_adjacents = adjacent_positions.len();
            let dx = target_x as i32 - self.x as i32;
            let dy = target_y as i32 - self.y as i32;

            if let Some(current_index) = adjacent_positions.iter().position(|&i| i == (dx, dy)) {
                let clockwise_index = (current_index + 1) % num_adjacents;
                let counterclock_index = (current_index + num_adjacents - 1) % num_adjacents;

                let clockwise_x = target_x as i32 + adjacent_positions[clockwise_index].0;
                let clockwise_y = target_y as i32 + adjacent_positions[clockwise_index].1;

                let counterclock_x = target_x as i32 + adjacent_positions[counterclock_index].0;
                let counterclock_y = target_y as i32 + adjacent_positions[counterclock_index].1;

                best_move = (
                    (self.x as i32 + next_x) as usize,
                    (self.y as i32 + next_y) as usize,
                )
            }
        }

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
                    print!("T ");
                } else {
                    print!("{} ", symbol);
                }
            }
            println!();
        }
        println!();
    }
}
