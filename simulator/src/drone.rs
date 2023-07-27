use crate::env::Environment;
use crate::utils::DIRECTIONS;
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
    pub visibility_range: usize,
    pub status: Status,
    pub data: EnvData,
}

impl Drone {
    pub fn new(x: usize, y: usize, grid_size: usize, visibility_range: usize) -> Self {
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
            x,
            y,
            visibility_range,
            status: Status::Searching,
            data,
        }
    }

    pub fn scan_environment(&mut self, environment: &Environment) {
        let visible_tiles = self.get_visible_tiles(self.x, self.y);

        for tile in visible_tiles {
            let (x, y) = (tile.0, tile.1);
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

    pub fn get_visible_tiles(&self, x: usize, y: usize) -> Vec<(usize, usize)> {
        let max_bound = self.data.grid_size - 1;
        let vis_range = self.visibility_range;

        // Calculate the boundaries for the visible range around the drone
        let min_x = x.saturating_sub(vis_range);
        let max_x = std::cmp::min(x + vis_range, max_bound);
        let min_y = y.saturating_sub(vis_range);
        let max_y = std::cmp::min(y + vis_range, max_bound);

        let mut visible_tiles = Vec::new();
        for i in min_x..=max_x {
            for j in min_y..=max_y {
                visible_tiles.push((i, j));
            }
        }

        visible_tiles
    }

    pub fn get_valid_moves(&self, x: usize, y: usize) -> Vec<(usize, usize)> {
        let mut valid_moves = Vec::new();

        for (dx, dy) in DIRECTIONS {
            let moved_x = x as i32 + dx;
            let moved_y = y as i32 + dy;

            if moved_x >= 0 && moved_y >= 0 {
                let (new_x, new_y) = (moved_x as usize, moved_y as usize);

                if self.is_valid_move(new_x, new_y) {
                    valid_moves.push((new_x, new_y));
                }
            }
        }

        valid_moves
    }

    fn is_valid_move(&self, x: usize, y: usize) -> bool {
        let max_bound = self.data.grid_size;
        if x < max_bound && y < max_bound {
            let tile = &self.data.grid[x][y];
            if !(tile.hostile == Hostile::True) && tile.content == TileContent::Empty {
                return true;
            }
        }

        false
    }

    pub fn update_status(&mut self) {}

    pub fn make_move(&mut self) {
        match self.status {
            Status::Searching => self.search(),
            Status::Monitoring => self.monitor(),
        };
    }

    fn get_nearest_unrevealed_tile(&self) -> Option<(usize, usize)> {
        let mut closest_distance = f64::MAX;
        let mut closest_unrevealed = None;

        let mut unrevealed_tiles = Vec::new();
        for x in 0..self.data.grid_size {
            for y in 0..self.data.grid_size {
                if self.data.grid[x][y].hostile == Hostile::Unknown {
                    unrevealed_tiles.push((x, y));
                }
            }
        }

        for tile in unrevealed_tiles {
            let dx = self.x as f64 - tile.0 as f64;
            let dy = self.y as f64 - tile.1 as f64;
            let distance = (dx * dx + dy * dy).sqrt();

            if distance < closest_distance {
                closest_distance = distance;
                closest_unrevealed = Some(tile);
            }
        }

        closest_unrevealed
    }

    fn find_best_path(&self, target_x: usize, target_y: usize) -> Option<Vec<(usize, usize)>> {
        let mut queue: VecDeque<(usize, usize, Vec<(usize, usize)>)> = VecDeque::new();
        let mut visited: HashSet<(usize, usize)> = HashSet::new();

        queue.push_back((self.x, self.y, Vec::new()));
        visited.insert((self.x, self.y));

        while let Some((current_x, current_y, path)) = queue.pop_front() {
            if current_x == target_x && current_y == target_y {
                return Some(path);
            }

            for (neighboring_x, neighboring_y) in self.get_valid_moves(current_x, current_y) {
                if self.is_valid_move(neighboring_x, neighboring_y)
                    && !visited.contains(&(neighboring_x, neighboring_y))
                {
                    let mut new_path = path.clone();
                    new_path.push((neighboring_x, neighboring_y));
                    visited.insert((neighboring_x, neighboring_y));
                    queue.push_back((neighboring_x, neighboring_y, new_path));
                }
            }
        }

        None
    }

    fn search(&mut self) {
        let mut best_move_score = 0;
        let mut best_move = (self.x, self.y);

        // Check every possible move and determine which will reveal the most tiles
        for potential_move in self.get_valid_moves(self.x, self.y) {
            let (x, y) = (potential_move.0, potential_move.1);

            let mut move_score = 0;
            for now_visible_tile in self.get_visible_tiles(x, y) {
                let (vis_x, vis_y) = now_visible_tile;
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
            // If multiple moves have the same score, prioritize any move that
            // would allow the drone to see the edge of the terrain
            else {
                if x <= self.visibility_range
                    || y <= self.visibility_range
                    || x >= self.data.grid_size - (self.visibility_range + 1)
                    || y >= self.data.grid_size - (self.visibility_range + 1)
                {
                    best_move_score = move_score;
                    best_move = potential_move;
                }
            }
        }

        // If no moves will reveal additional tiles, then begin moving towards
        // the nearest unrevealed tile
        if best_move_score == 0 {
            if let Some((target_x, target_y)) = self.get_nearest_unrevealed_tile() {
                if let Some(path) = self.find_best_path(target_x, target_y) {
                    best_move = path[0];
                }
            }
        }

        (self.x, self.y) = (best_move.0, best_move.1);
    }

    fn monitor(&mut self) {}

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
                    continue;
                }

                if tile.content == TileContent::Target {
                    print!("T!")
                } else if let Some((target_x, target_y)) = self.data.last_target_pos {
                    if tile.x == target_x && tile.y == target_y {
                        print!("T?");
                        continue;
                    }
                }

                print!("{} ", symbol);
            }
            println!();
        }
        println!();
    }
}
