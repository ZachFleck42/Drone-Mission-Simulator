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
    is_safe: bool,
    has_target: bool,
}

struct Target {
    x: usize,
    y: usize,
    name: Option<String>,
}

struct Grid {
    tiles: Vec<Vec<Tile>>,
    target: Target,
}

impl Grid {
    fn new(size: usize) -> Self {
        let mut grid = Grid {
            tiles: Vec::with_capacity(size),
            target: Target {
                x: 0,
                y: 0,
                name: None,
            },
        };

        let mut rng = rand::thread_rng();

        grid.target.x = rng.gen_range(0..size);
        grid.target.y = rng.gen_range(0..size);

        for x in 0..size {
            let mut row = Vec::with_capacity(size);
            for y in 0..size {
                let is_safe = rng.gen_range(0..10) < 9;
                let has_target = x == grid.target.x && y == grid.target.y;

                let tile = Tile {
                    x,
                    y,
                    is_safe,
                    has_target,
                };
                row.push(tile);
            }
            grid.tiles.push(row);
        }

        grid
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
                } else if tile.is_safe {
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
    let mut grid = Grid::new(8);

    // Simulate target movement for 10 ticks
    for tick in 1..=10 {
        grid.move_target();
        println!(
            "Tick {}: Target is at ({}, {})",
            tick, grid.target.x, grid.target.y
        );
        grid.print();
        println!();
    }
}
