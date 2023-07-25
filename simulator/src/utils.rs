use rand::Rng;

pub fn coin_flip() -> usize {
    let mut rng = rand::thread_rng();
    rng.gen_range(0..=1)
}
