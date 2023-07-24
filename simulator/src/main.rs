use rand::Rng;

struct Tile {
    x: usize,
    y: usize,
    is_unsafe: bool,
}

fn generate_grid() -> Vec<Vec<Tile>> {
    let mut grid = Vec::with_capacity(256);
    let mut rng = rand::thread_rng();

    for i in 0..16 {
        let mut row = Vec::with_capacity(16);
        for j in 0..16 {
            let tile_type = if rng.gen::<f64>() < 0.1 { true } else { false };

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

fn main() {
    let grid = generate_grid();

    for i in 0..16 {
        for j in 0..16 {
            let tile = &grid[i][j];
            print!("({},{}) - {:?}  ", tile.x, tile.y, tile.is_unsafe);
        }
        println!();
    }
}
