use rand::Rng;

struct Tile {
    x: usize,
    y: usize,
    is_unsafe: bool,
}

struct Target {
    x: usize,
    y: usize,
}

#[derive(Clone, Copy)]
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

fn generate_grid() -> Vec<Vec<Tile>> {
    let mut grid = Vec::with_capacity(16);

    let mut rng = rand::thread_rng();

    for i in 0..16 {
        let mut row = Vec::with_capacity(16);
        for j in 0..16 {
            let tile_type = if rng.gen_range(0..10) < 1 {
                true
            } else {
                false
            };

            let tile = Tile {
                x: i,
                y: j,
                is_unsafe: tile_type,
            };
            row.push(tile);
        }
        grid.push(row);
    }

    grid
}

fn move_target(target: &mut Target) {
    let mut rng = rand::thread_rng();
    if rng.gen_range(0..10) < 3 {
        let mut valid_directions = Vec::new();

        if target.x > 0 {
            valid_directions.push(Direction::Up);
        }
        if target.x < 15 {
            valid_directions.push(Direction::Down);
        }
        if target.y > 0 {
            valid_directions.push(Direction::Left);
        }
        if target.y < 15 {
            valid_directions.push(Direction::Right);
        }

        if !valid_directions.is_empty() {
            let direction = valid_directions[rng.gen_range(0..valid_directions.len())];

            match direction {
                Direction::Up => target.x -= 1,
                Direction::Down => target.x += 1,
                Direction::Left => target.y -= 1,
                Direction::Right => target.y += 1,
            }
        }
    }
}

fn main() {
    let grid = generate_grid();
    let mut target = Target {
        x: rand::thread_rng().gen_range(0..16),
        y: rand::thread_rng().gen_range(0..16),
    };

    // Simulate target movement for 10 ticks
    for tick in 1..=10 {
        move_target(&mut target);
        println!("Tick {}: Target is at ({}, {})", tick, target.x, target.y);
        for i in 0..16 {
            for j in 0..16 {
                let tile = &grid[i][j];
                let symbol = if i == target.x && j == target.y {
                    'T'
                } else if tile.is_unsafe {
                    'X'
                } else {
                    'O'
                };
                print!("{} ", symbol);
            }
            println!();
        }
        println!();
    }
}
