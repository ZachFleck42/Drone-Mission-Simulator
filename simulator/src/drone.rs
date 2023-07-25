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

pub struct DroneData {
    grid: Vec<Vec<Tile>>,
    last_target_pos: Option<(usize, usize)>,
}

pub struct Drone {
    pub x: usize,
    pub y: usize,
    pub grid_size: usize,
    pub visibility_range: usize,
    status: Status,
    data: DroneData,
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

        let data = DroneData {
            grid,
            last_target_pos: None,
        };

        Drone {
            x,
            y,
            grid_size,
            visibility_range,
            status: Status::Searching,
            data,
        }
    }

    fn update_status(&mut self) {}
}
