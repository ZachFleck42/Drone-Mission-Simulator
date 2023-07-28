use crate::env::Environment;
use crate::utils::get_distance_to_tile;
use crate::utils::get_surrounding_tiles;
use std::collections::{HashSet, VecDeque};

#[derive(Debug)]
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

#[derive(PartialEq, Clone, Copy)]
pub enum Flags {
    MonitoringClockwise,
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
    pub flags: Vec<Flags>,
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
            flags: Vec::new(),
        }
    }

    /// Used to populate EnvData with data on the provided environment.
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
                // Mark all tiles as empty unless explicitly discovered otherwise.
                // Serves to remove old data from previous scans
                self.data.grid[x][y].content = TileContent::Empty;
            }
        }
    }

    /// Updates the drone's status for deciding which move to make next.
    /// If drone can see target from its current position, status will be Monitoring.
    /// Otherwise, status will be Searching.
    pub fn update_status(&mut self) {
        for (x, y) in self.get_visible_tiles() {
            if self.data.grid[x][y].content == TileContent::Target {
                self.status = Status::Monitoring;
                return;
            }
        }

        // If the drone has pathed to the target's last known position, remove
        // last_target_pos variable to begin searching unexplored tiles again
        if let Some((target_x, target_y)) = self.data.last_target_pos {
            if self.x == target_x && self.y == target_y {
                self.data.last_target_pos = None;
            }
        }

        self.status = Status::Searching
    }

    /// Parent function for general 'next move' decision-making.
    /// Based on current status of drone, call appropriate movement function,
    /// get and make the returned moved, and append previous position to path_history.
    pub fn make_move(&mut self) {
        let best_move = match self.status {
            Status::Searching => self.search(),
            Status::Monitoring => self.monitor(),
        };

        self.path_history.push((self.x, self.y));
        (self.x, self.y) = best_move;
    }

    /// Returns the best move to make when drone has 'Searching' status (the drone
    /// does not know where the target currently is).
    /// If there is a last-known position of the target, will attempt to path to that tile.
    /// Otherwise, will prioritize any move that will uncover 'unknown' tiles.
    /// If none are in immediate range, will path to the nearest one on the grid.
    fn search(&self) -> (usize, usize) {
        let mut best_move = (self.x, self.y);

        // If there is a value for last-known target position, path to it.
        if let Some((target_x, target_y)) = self.data.last_target_pos {
            if let Some(path) = self.best_path_to(target_x, target_y) {
                best_move = path[0];
            }
        } else {
            // Check current available moves and determine which (if any) will
            // reveal the most tiles.
            let mut best_move_score = 0;
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

            // If no moves will reveal additional tiles, begin moving towards
            // the nearest unrevealed tile on the grid.
            if best_move_score == 0 {
                let unrevealed_tiles = self.get_all_unrevealed_tiles();
                if !unrevealed_tiles.is_empty() {
                    let (unrevealed_x, unrevealed_y) = self.get_closest_option(unrevealed_tiles);
                    if let Some(path) = self.best_path_to(unrevealed_x, unrevealed_y) {
                        best_move = path[0];
                    }
                }
            }
        }

        best_move
    }

    /// Returns the best move to make when drone has 'Monitoring' status (the drone
    /// has a line of sight on the target).
    /// Will first attempt to get within one tile of the target and maintain this
    /// distance at all times.
    /// Once within one tile, drone will circle the target indefinitely.
    fn monitor(&mut self) -> (usize, usize) {
        let all_valid_moves = self.get_valid_moves();
        let mut best_move = (self.x, self.y);

        // Verify the target's position
        let (mut target_x, mut target_y) = (0, 0);
        for (x, y) in self.get_visible_tiles() {
            if self.data.grid[x][y].content == TileContent::Target {
                (target_x, target_y) = (x, y);
                break;
            }
        }

        // Get list of tiles surrounding target in 'clockwise' order to aid in
        // implementing 'circle target' path-finding
        let mut target_adjacents = Vec::new();
        let max_bound = self.data.grid_size as isize - 1;
        let order = [
            (-1, 0),  // Top
            (-1, 1),  // Top-right
            (0, 1),   // Right
            (1, 1),   // Bottom-right
            (1, 0),   // Bottom
            (1, -1),  // Bottom-left
            (0, -1),  // Left
            (-1, -1), // Top-left
        ];
        for (dx, dy) in order {
            let x = target_x as isize + dx;
            let y = target_y as isize + dy;

            // Verify each calculated position is within the grid boundaries
            if x >= 0 && x <= max_bound && y >= 0 && y <= max_bound {
                target_adjacents.push((x as usize, y as usize));
            }
        }

        // If drone is adjacent to the target, determine exactly which position around
        // the target drone is occupying. Will allow us to decide which adjacent tile
        // to move to next to emulate 'circling'.
        if let Some(current_index) = target_adjacents.iter().position(|&i| i == (self.x, self.y)) {
            let num_adjacents = target_adjacents.len();

            // Get the first two tiles in the clockwise and counter-clockwise directions.
            // Two because drone can 'cut corners' if a corner tile is hostile / not empty.
            let first_clockwise_tile = target_adjacents[(current_index + 1) % num_adjacents];
            let second_clockwise_tile = target_adjacents[(current_index + 2) % num_adjacents];
            let first_counterclockwise_tile =
                target_adjacents[(current_index + num_adjacents.saturating_sub(1)) % num_adjacents];
            let second_counterclockwise_tile =
                target_adjacents[(current_index + num_adjacents.saturating_sub(2)) % num_adjacents];

            // If 'MonitoringClockwise' flag is present on drone, then prioritize
            // continuing moving in the clockwise direction.
            let prioritized_moves = if self.flags.contains(&Flags::MonitoringClockwise) {
                vec![
                    first_clockwise_tile,
                    second_clockwise_tile,
                    first_counterclockwise_tile,
                    second_counterclockwise_tile,
                ]
            } else {
                vec![
                    first_counterclockwise_tile,
                    second_counterclockwise_tile,
                    first_clockwise_tile,
                    second_clockwise_tile,
                ]
            };

            for (next_x, next_y) in prioritized_moves {
                if self.is_valid_move(next_x, next_y) {
                    best_move = (next_x, next_y);

                    // If a counter-clockwise move was made...
                    if best_move == first_counterclockwise_tile
                        || best_move == second_counterclockwise_tile
                    {
                        // Remove the MonitoringClockwise flag if present
                        self.flags.retain(|&x| x != Flags::MonitoringClockwise);
                    // If a clockwise move was made...
                    } else {
                        // Make sure the MonitoringClockwise flag is present on drone
                        if !self.flags.contains(&Flags::MonitoringClockwise) {
                            self.flags.push(Flags::MonitoringClockwise);
                        }
                    }
                    break; // Break to make sure highest priority move is selected
                }
            }
        // If drone is not in a tile adjacent to the target, then move/path to the
        // nearest adjacent tile to the target.
        } else {
            let moves_to_consider: Vec<(usize, usize)> = target_adjacents
                .clone()
                .into_iter()
                .filter(|tile| all_valid_moves.contains(tile))
                .collect();

            if !moves_to_consider.is_empty() {
                best_move = self.get_closest_option(moves_to_consider);
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

        best_move
    }

    /// Returns a list of moves that represent the best sequence of moves to get
    /// drone from its current position to provided target.
    /// Implements simple breadth-first search algorithm to find path, taking into
    /// account and pathing around known hostile tiles.
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

    /// Returns a list of all valid moves the drone can make from its current position.
    pub fn get_valid_moves(&self) -> Vec<(usize, usize)> {
        let mut valid_moves = Vec::new();
        for (x, y) in get_surrounding_tiles(self.data.grid_size, self.move_range, self.x, self.y) {
            if self.is_valid_move(x, y) {
                valid_moves.push((x, y));
            }
        }

        valid_moves
    }

    /// Returns true if the drone can move to (x, y) from its current position
    fn is_valid_move(&self, x: usize, y: usize) -> bool {
        if !self.is_tile_safe(x, y)
            || !get_surrounding_tiles(self.data.grid_size, self.move_range, self.x, self.y)
                .contains(&(x, y))
        {
            false
        } else {
            true
        }
    }

    /// Returns true if the target is not discovered to be hostile and is known to
    /// be empty.
    /// Exists separate from is_valid_move() to enable path-finding and projection
    /// into unknown terrain.
    fn is_tile_safe(&self, x: usize, y: usize) -> bool {
        let tile = &self.data.grid[x][y];
        if tile.hostile == Hostile::True || tile.content != TileContent::Empty {
            return false;
        }

        true
    }

    /// Returns the closest tile to the drone's current position from a provided
    /// list of tiles.
    /// Used to help make path-finding decisions.
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

    /// Returns a list of coordinates of all tiles the drone can 'see' from its
    /// current position, given its defined visibility range.
    fn get_visible_tiles(&self) -> Vec<(usize, usize)> {
        // Initiated with current position in case target has moved onto drone's tile
        let mut visible_tiles = vec![(self.x, self.y)];
        let surrounding_tiles =
            get_surrounding_tiles(self.data.grid_size, self.visibility_range, self.x, self.y);

        visible_tiles.extend(surrounding_tiles);
        visible_tiles
    }

    /// Wrapper function around utils::get_distance_to_tile that returns the
    /// distance of a tile from the drone's current position. Used in path-finding.
    fn get_distance_to(&self, target_x: usize, target_y: usize) -> f64 {
        get_distance_to_tile(self.x, self.y, target_x, target_y)
    }

    /// Returns a list of all still unrevealed tiles in drone's recreation of the
    /// terrain.
    /// Used in search() method to make path-finding decisions.
    fn get_all_unrevealed_tiles(&self) -> Vec<(usize, usize)> {
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
