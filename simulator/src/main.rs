use rand::Rng;

struct Tile {
    x: usize,
    y: usize,
    is_safe: bool,
    has_target: bool,
}

#[derive(Clone, Copy)]
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

fn generate_grid() -> (Vec<Vec<Tile>>, (usize, usize)) {
    let mut grid = Vec::with_capacity(16);

    let mut rng = rand::thread_rng();

    let target_pos = (rng.gen_range(0..16), rng.gen_range(0..16));

    for x in 0..16 {
        let mut row = Vec::with_capacity(16);
        for y in 0..16 {
            let is_safe = if rng.gen_range(0..10) < 1 {
                false
            } else {
                true
            };

            let tile = Tile {
                x,
                y,
                is_safe,
                has_target: (x, y) == target_pos,
            };
            row.push(tile);
        }
        grid.push(row);
    }

    (grid, target_pos)
}

fn move_target(grid: &mut Vec<Vec<Tile>>, target: &mut (usize, usize)) {
    let mut rng = rand::thread_rng();
    if rng.gen_range(0..10) < 3 {
        let mut valid_directions = Vec::new();

        if target.0 > 0 {
            valid_directions.push(Direction::Up);
        }
        if target.0 < 15 {
            valid_directions.push(Direction::Down);
        }
        if target.1 > 0 {
            valid_directions.push(Direction::Left);
        }
        if target.1 < 15 {
            valid_directions.push(Direction::Right);
        }

        if !valid_directions.is_empty() {
            grid[target.0][target.1].has_target = false;
            let direction = valid_directions[rng.gen_range(0..valid_directions.len())];

            match direction {
                Direction::Up => target.0 -= 1,
                Direction::Down => target.0 += 1,
                Direction::Left => target.1 -= 1,
                Direction::Right => target.1 += 1,
            }

            grid[target.0][target.1].has_target = true;
        }
    }
}

fn main() {
    let (mut grid, mut target) = generate_grid();

    // Simulate target movement for 10 ticks
    for tick in 1..=10 {
        move_target(&mut grid, &mut target);
        println!("Tick {}: Target is at ({}, {})", tick, target.0, target.1);
        for i in 0..16 {
            for j in 0..16 {
                let tile = &grid[i][j];
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
        println!();
    }
}
