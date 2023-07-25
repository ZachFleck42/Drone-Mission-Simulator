use rand::Rng;

#[derive(Clone, Copy)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

/// Returns a copy of a random element in the provided data structure.
/// Structure must implement the 'Clone' trait.
pub fn random_choice<T: Clone>(data: &[T]) -> T {
    let random_index = rand::thread_rng().gen_range(0..data.len());
    data[random_index].clone()
}