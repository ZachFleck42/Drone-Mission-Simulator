enum Status {
    Searching,
    Monitoring,
    Fleeing,
}

pub struct Drone {
    pub x: usize,
    pub y: usize,
    pub visibility_range: usize,
    status: Status,
}

struct Grid {}

impl Drone {
    pub fn new(x: usize, y: usize, visibility_range: usize) -> Self {
        let mut drone = Drone {
            x,
            y,
            visibility_range,
            status: Status::Searching,
        };

        drone
    }

    fn update_status(&mut self) {}
}
