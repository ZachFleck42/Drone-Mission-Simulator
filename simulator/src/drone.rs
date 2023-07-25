enum Status {
    Searching,
    Monitoring,
    Fleeing,
}

pub enum Hostile {
    True,
    False,
    Unknown,
}

pub struct Tile {
    pub x: usize,
    pub y: usize,
    pub hostile: Hostile,
}

pub struct EnvData {
    grid: Vec<Vec<Tile>>,
    last_target_pos: Option<(usize, usize)>,
}

pub struct Drone {
    pub x: usize,
    pub y: usize,
    pub grid_size: usize,
    pub visibility_range: usize,
    status: Status,
    env_data: EnvData,
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

    fn update_status(&mut self) {}
}
