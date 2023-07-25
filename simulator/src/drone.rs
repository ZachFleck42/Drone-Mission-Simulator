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
    pub fn new(x: usize, y: usize, visibility_range: usize) -> Self {
        let mut drone = Drone {
            x,
            y,
            visibility_range,
            status: Status::Searching,
        };

        drone
    }

    pub fn get_visible_tiles(&self, grid_size: usize) -> Vec<(usize, usize)> {
        let max_bound = grid_size - 1;
        let mut visible_tiles = Vec::new();

        // Calculate the boundaries for the visible range around the drone
        let min_x = self.x.saturating_sub(self.visibility_range);
        let max_x = usize::min(self.x + self.visibility_range, max_bound);
        let min_y = self.y.saturating_sub(self.visibility_range);
        let max_y = usize::min(self.y + self.visibility_range, max_bound);

        for i in min_x..=max_x {
            for j in min_y..=max_y {
                visible_tiles.push((i, j));
            }
        }

        visible_tiles
    }

    fn update_status(&mut self) {}
}
