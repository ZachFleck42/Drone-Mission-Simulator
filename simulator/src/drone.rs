use crate::utils::DIRECTIONS;

pub enum Status {
    Searching,
    Monitoring,
    Fleeing,
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
    pub grid: Vec<Vec<Tile>>,
    pub last_target_pos: Option<(usize, usize)>,
}

pub struct Drone {
    pub x: usize,
    pub y: usize,
    pub grid_size: usize,
    pub visibility_range: usize,
    pub status: Status,
    pub env_data: EnvData,
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

        let env_data = EnvData {
            grid,
            last_target_pos: None,
        };

        Drone {
            x,
            y,
            grid_size,
            visibility_range,
            status: Status::Searching,
            env_data,
        }
    }

    pub fn get_visible_tiles(&self, x: usize, y: usize) -> Vec<(usize, usize)> {
        let max_bound = self.grid_size - 1;
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

    pub fn get_valid_moves(&self) -> Vec<(usize, usize)> {
        let mut valid_moves = Vec::new();
        let max_bound = self.grid_size as i32;

        for (dx, dy) in DIRECTIONS {
            let new_x = self.x as i32 + dx;
            let new_y = self.y as i32 + dy;

            if new_x >= 0 && new_x < max_bound && new_y >= 0 && new_y < max_bound {
                let x = new_x as usize;
                let y = new_y as usize;
                let tile = &self.env_data.grid[x][y];

                if tile.hostile == Hostile::False && tile.content == TileContent::Empty {
                    valid_moves.push((x, y));
                }
            }
        }

        valid_moves
    }

    pub fn update_status(&mut self) {}

    pub fn make_move(&mut self) {
        match self.status {
            Status::Searching => self.search(),
            Status::Monitoring => self.monitor(),
            Status::Fleeing => self.flee(),
        };
    }

    fn search(&mut self) {
        let valid_moves = self.get_valid_moves();
        let best_move: (usize, usize);
        let best_move_score = 0;

        for potential_move in valid_moves {
            let mut move_score = 0;
            let (x, y) = (potential_move.0, potential_move.1);
            let revealed_tiles = self.get_visible_tiles(x, y);

            for tile in revealed_tiles {
                if self.env_data.grid[x][y].hostile == Hostile::Unknown {
                    move_score += 1;
                }
            }
        }
    }

    fn monitor(&mut self) {}

    fn flee(&mut self) {}

    pub fn print_grid(&self) {
        for i in 0..self.grid_size {
            for j in 0..self.grid_size {
                let tile = &self.env_data.grid[i][j];

                let symbol = match tile.hostile {
                    Hostile::Unknown => '?',
                    Hostile::True => 'X',
                    Hostile::False => 'O',
                };

                if tile.x == self.x && tile.y == self.y {
                    print!("D ");
                    continue;
                }

                if let Some((target_x, target_y)) = self.env_data.last_target_pos {
                    if tile.x == target_x && tile.y == target_y {
                        print!("T ");
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
