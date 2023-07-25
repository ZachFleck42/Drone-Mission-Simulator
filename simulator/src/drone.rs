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

struct Drone {
    x: usize,
    y: usize,
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
    fn new() -> Self {
        let mut drone = Drone {
            x: 0,
            y: 0,
            visibility_range: 2,
            status: Status::Searching,
        };

        drone
    }
}
