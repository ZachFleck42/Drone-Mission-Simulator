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
    pub visibility_range: usize,
    status: Status,
    // data: DroneData,
}

struct Grid {}

impl Drone {
    pub fn new(x: usize, y: usize, visibility_range: usize) -> Self {
        let mut drone = Drone {
            x,
            y,
            visibility_range,
            status: Status::Searching,
            // data:
        };

        drone
    }

    fn update_status(&mut self) {}
}
