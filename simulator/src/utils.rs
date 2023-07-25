use rand::Rng;

#[derive(Clone, Copy)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

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

pub fn random_in_range(lower: usize, upper: usize) -> usize {
    rand::thread_rng().gen_range(lower..upper)
}
