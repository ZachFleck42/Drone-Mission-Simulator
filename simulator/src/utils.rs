use rand::Rng;

#[derive(Clone, Copy)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

pub fn coin_flip() -> usize {
    let mut rng = rand::thread_rng();
    rng.gen_range(0..=1)
}
