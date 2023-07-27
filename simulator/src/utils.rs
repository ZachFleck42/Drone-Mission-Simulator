use rand::Rng;

pub static DIRECTIONS: [(i32, i32); 8] = [
    (-1, -1),
    (-1, 0),
    (-1, 1),
    (0, -1),
    (0, 1),
    (1, -1),
    (1, 0),
    (1, 1),
];

/// Returns a copy of a random element in the provided data structure.
/// Structure must implement the 'Clone' trait.
pub fn random_choice<T: Clone>(data: &[T]) -> T {
    let random_index = rand::thread_rng().gen_range(0..data.len());
    data[random_index].clone()
}

pub fn get_surrounding_tiles(
    grid_size: usize,
    radius: usize,
    x: usize,
    y: usize,
) -> Vec<(usize, usize)> {
    let max_bound = grid_size - 1;

    // Calculate the boundaries for the visible range around the drone
    let min_x = x.saturating_sub(radius);
    let max_x = std::cmp::min(x + radius, max_bound);
    let min_y = y.saturating_sub(radius);
    let max_y = std::cmp::min(y + radius, max_bound);

    let mut surrounding_tiles = Vec::new();
    for i in min_x..=max_x {
        for j in min_y..=max_y {
            surrounding_tiles.push((i, j));
        }
    }

    surrounding_tiles
}
