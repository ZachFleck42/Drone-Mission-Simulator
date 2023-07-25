pub enum Status {
    Searching,
    Monitoring,
    Fleeing,
}

pub enum Hostile {
    True,
    False,
    Unknown,
}

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

    pub fn get_visible_tiles(&self) -> Vec<(usize, usize)> {
        let max_bound = self.grid_size - 1;
        let vis_range = self.visibility_range;

        // Calculate the boundaries for the visible range around the drone
        let min_x = self.x.saturating_sub(vis_range);
        let max_x = usize::min(self.x + vis_range, max_bound);
        let min_y = self.y.saturating_sub(vis_range);
        let max_y = usize::min(self.y + vis_range, max_bound);

        let mut visible_tiles = Vec::new();
        for i in min_x..=max_x {
            for j in min_y..=max_y {
                visible_tiles.push((i, j));
            }
        }

        visible_tiles
    }

    fn print_grid(&self) {
        for i in 0..self.grid_size {
            for j in 0..self.grid_size {
                let tile = &self.env_data.grid[i][j];

                let symbol = match tile.hostile {
                    Hostile::Unknown => '?',
                    Hostile::True => 'X',
                    Hostile::False => 'O',
                };

                if let Some((target_x, target_y)) = self.env_data.last_target_pos {
                    if tile.x == target_x && tile.y == target_y {
                        print!("T");
                        continue;
                    }
                }

                print!("{}", symbol);
            }
            println!();
        }
        println!();
    }
}
