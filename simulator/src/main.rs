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

struct Target {
    x: usize,
    y: usize,
}

struct Terrain {
    size: usize,
    tiles: Vec<Vec<Tile>>,
}

impl Terrain {
    fn new(size: usize) -> Self {
        let mut terrain = Terrain {
            size,
            tiles: Vec::with_capacity(size*size),
        };

        let mut rng = rand::thread_rng();

        for x in 0..size {
            let mut row = Vec::with_capacity(size);
            for y in 0..size {
                let hostile = rng.gen_range(0..10) < 1;

                let tile = Tile {
                    x,
                    y,
                    hostile,
                };
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
                let symbol = if tile.hostile {
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

fn main() {
    let mut terrain = Terrain::new(8);
    terrain.print()

    // Simulate target movement for 10 ticks
    // for tick in 1..=10 {
    //     grid.move_target();
    //     println!(
    //         "Tick {}: Target is at ({}, {})",
    //         tick, grid.target.x, grid.target.y
    //     );
    //     terrain.print();
    // }
}