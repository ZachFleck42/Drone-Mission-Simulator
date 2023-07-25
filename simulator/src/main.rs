use rand::Rng;

#[derive(Clone, Copy)]
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

struct Tile {
    x: usize,
    y: usize,
    hostile: bool,
}

struct Terrain {
    size: usize,
    hostile_rate: usize,
    tiles: Vec<Vec<Tile>>,
}

struct Target {
    x: usize,
    y: usize,
    move_rate: usize,
    name: Option<String>,
}

struct Environment {
    terrain: Terrain,
    target: Target,
}

impl Terrain {
    fn new(size: usize, hostile_rate: usize) -> Self {
        let mut terrain = Terrain {
            size,
            hostile_rate,
            tiles: Vec::with_capacity(size),
        };

        let mut rng = rand::thread_rng();
        for x in 0..size {
            let mut row = Vec::with_capacity(size);
            for y in 0..size {
                let hostile = rng.gen_range(0..100) < terrain.hostile_rate;

                let tile = Tile { x, y, hostile };
                row.push(tile);
            }
            terrain.tiles.push(row);
        }

        terrain
    }

    fn print(&self) {
        for i in 0..self.tiles.len() {
            for j in 0..self.tiles[0].len() {
                let tile = &self.tiles[i][j];
                let symbol = if tile.hostile { 'X' } else { 'O' };
                print!("{} ", symbol);
            }
            println!();
        }
    }
}

impl Environment {
    fn new(terrain: Terrain) -> Self {
        let mut rng = rand::thread_rng();
        let mut environment = Environment {
            terrain,
            target: Target {
                x: 0,
                y: 0,
                move_rate: 50,
                name: None,
            },
        };

        environment.target.x = rng.gen_range(0..environment.terrain.size);
        environment.target.y = rng.gen_range(0..environment.terrain.size);

        environment
    }

    fn move_target(&mut self) {
        let mut rng = rand::thread_rng();
        if rng.gen_range(0..100) < self.target.move_rate {
            let mut valid_directions = Vec::new();

            if self.target.x > 0 {
                valid_directions.push(Direction::Up);
            }
            if self.target.x < self.terrain.size - 1 {
                valid_directions.push(Direction::Down);
            }
            if self.target.y > 0 {
                valid_directions.push(Direction::Left);
            }
            if self.target.y < self.terrain.size - 1 {
                valid_directions.push(Direction::Right);
            }

            if !valid_directions.is_empty() {
                let direction = valid_directions[rng.gen_range(0..valid_directions.len())];

                match direction {
                    Direction::Up => self.target.x -= 1,
                    Direction::Down => self.target.x += 1,
                    Direction::Left => self.target.y -= 1,
                    Direction::Right => self.target.y += 1,
                }
            }
        }
    }

    fn print(&self) {
        for i in 0..self.terrain.size {
            for j in 0..self.terrain.size {
                let tile = &self.terrain.tiles[i][j];

                let symbol = if tile.x == self.target.x && tile.y == self.target.y {
                    'T'
                } else if tile.hostile {
                    'X'
                } else {
                    'O'
                };
                print!("{} ", symbol);
            }
            println!();
        }
    }
}

fn main() {
    // Define terrain variables and generate terrain accordingly
    let grid_size = 8;
    let hostile_rate = 10;
    let terrain = Terrain::new(grid_size, hostile_rate);

    // Randomly place a target within the terrain and track both in environment
    let mut environment = Environment::new(terrain);

    // Print initial environment
    println!(
        "Initial: Target is at ({}, {})",
        environment.target.x, environment.target.y
    );
    environment.print();
    println!();

    // Simulate target movement for 10 ticks
    for tick in 1..=10 {
        environment.move_target();
        println!(
            "Tick {}: Target is at ({}, {})",
            tick, environment.target.x, environment.target.y
        );
        environment.print();
        println!();
    }
}
