use crate::utils;

enum Status {
    Searching,
    Monitoring,
    Fleeing,
}

enum Hostile {
    True,
    False,
    Unknown,
}

pub struct Drone {
    pub x: usize,
    pub y: usize,
    visibility_range: usize,
    status: Status,
}

struct Tile {
    x: usize,
    y: usize,
    hostile: Hostile,
}

struct Grid {}

impl Drone {
    pub fn new(visibility_range: usize) -> Self {
        let mut drone = Drone {
            x: 0,
            y: 0,
            visibility_range,
            status: Status::Searching,
        };

        drone
    }

    fn monitor(&mut self) {}
}
