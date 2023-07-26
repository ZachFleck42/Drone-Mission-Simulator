use rand::Rng;

pub static DIRECTIONS: [(i32, i32); 4] = [
    // (-1, -1),
    (-1, 0),
    // (-1, 1),
    (0, -1),
    (0, 1),
    // (1, -1),
    (1, 0),
    // (1, 1),
];

/// Returns a copy of a random element in the provided data structure.
/// Structure must implement the 'Clone' trait.
pub fn random_choice<T: Clone>(data: &[T]) -> T {
    let random_index = rand::thread_rng().gen_range(0..data.len());
    data[random_index].clone()
}
