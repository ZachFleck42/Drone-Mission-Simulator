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
    status: String,
}

struct Tile {
    x: usize,
    y: usize,
    hostile: Hostile,
}

struct Grid {}
