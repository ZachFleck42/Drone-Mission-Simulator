use rand::Rng;

#[derive(Clone, Copy)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

/// Has a 50% chance to return 0 and a 50% chance to return 1
/// Used to randomly select from one of two items in an array or vec
pub fn coin_flip() -> usize {
    rand::thread_rng().gen_range(0..=1)
}

pub fn random_direction() -> Direction {
    match rand::thread_rng().gen_range(0..4) {
        0 => Direction::Up,
        1 => Direction::Down,
        2 => Direction::Left,
        _ => Direction::Right,
    }
}
