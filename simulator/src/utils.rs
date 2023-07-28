use rand::Rng;

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
            if i != x || j != y {
                surrounding_tiles.push((i, j));
            }
        }
    }

    surrounding_tiles
}

pub fn get_distance_to_tile(
    origin_x: usize,
    origin_y: usize,
    target_x: usize,
    target_y: usize,
) -> f64 {
    let dx = origin_x as f64 - target_x as f64;
    let dy = origin_y as f64 - target_y as f64;
    (dx * dx + dy * dy).sqrt()
}

pub fn get_adjacent_tiles_in_clockwise_order(
    grid_size: usize,
    center_x: usize,
    center_y: usize,
) -> Vec<(usize, usize)> {
    let mut adjacent_tiles = Vec::new();
    let max_bound = grid_size as isize - 1;

    // Define the custom order for adjacent tiles in clockwise direction
    let order = [
        (-1, 0),  // Top
        (-1, 1),  // Top-right
        (0, 1),   // Right
        (1, 1),   // Bottom-right
        (1, 0),   // Bottom
        (1, -1),  // Bottom-left
        (0, -1),  // Left
        (-1, -1), // Top-left
    ];

    // Check each relative position in the custom order and add valid adjacent tiles to the vector
    for (dx, dy) in order.iter() {
        let x = center_x as isize + dx;
        let y = center_y as isize + dy;

        // Check if the calculated position is within the grid boundaries
        if x >= 0 && x <= max_bound && y >= 0 && y <= max_bound {
            adjacent_tiles.push((x as usize, y as usize));
        }
    }

    adjacent_tiles
}
