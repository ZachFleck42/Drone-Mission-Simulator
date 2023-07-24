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
    has_target: bool,
}

struct Target {
    x: usize,
    y: usize,
    name: Option<String>,
}

struct Terrain {
    tiles: Vec<Vec<Tile>>,
    target: Target,
}

impl Terrain {
    fn new(size: usize) -> Self {
        let mut rng = rand::thread_rng();

        let mut terrain = Terrain {
            tiles: Vec::with_capacity(size),
            target: Target {
                x: rng.gen_range(0..size),
                y: rng.gen_range(0..size),
                name: None,
            },
        };

        for x in 0..size {
            let mut row = Vec::with_capacity(size);
            for y in 0..size {
                let hostile = rng.gen_range(0..10) < 1;
                let has_target = x == terrain.target.x && y == terrain.target.y;

                let tile = Tile {
                    x,
                    y,
                    hostile,
                    has_target,
                };
                row.push(tile);
            }
            terrain.tiles.push(row);
        }

        terrain
    }

    fn move_target(&mut self) {
        let mut rng = rand::thread_rng();
        if rng.gen_range(0..10) < 10 {
            let mut valid_directions = Vec::new();

            if self.target.x > 0 {
                valid_directions.push(Direction::Up);
            }
            if self.target.x < self.tiles.len() - 1 {
                valid_directions.push(Direction::Down);
            }
            if self.target.y > 0 {
                valid_directions.push(Direction::Left);
            }
            if self.target.y < self.tiles[0].len() - 1 {
                valid_directions.push(Direction::Right);
            }

            if !valid_directions.is_empty() {
                self.tiles[self.target.x][self.target.y].has_target = false;
                let direction = valid_directions[rng.gen_range(0..valid_directions.len())];

                match direction {
                    Direction::Up => self.target.x -= 1,
                    Direction::Down => self.target.x += 1,
                    Direction::Left => self.target.y -= 1,
                    Direction::Right => self.target.y += 1,
                }

                self.tiles[self.target.x][self.target.y].has_target = true;
            }
        }
    }

    fn set_target_name(&mut self, name: String) {
        self.target.name = Some(name);
    }

    fn print(&self) {
        for i in 0..self.tiles.len() {
            for j in 0..self.tiles[0].len() {
                let tile = &self.tiles[i][j];
                let symbol = if tile.has_target {
                    'T'
                } else if tile.hostile {
                    'O'
                } else {
                    'X'
                };
                print!("{} ", symbol);
            }
            println!();
        }
    }
}

fn main() {
    let mut terrain = Terrain::new(8);

    // Simulate target movement for 10 ticks
    for tick in 1..=10 {
        terrain.move_target();
        println!(
            "Tick {}: Target is at ({}, {})",
            tick, terrain.target.x, terrain.target.y
        );
        terrain.print();
        println!();
    }
}