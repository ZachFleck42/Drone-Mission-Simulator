pub struct Simulation {
    pub environment: crate::env::Environment,
    pub drone: crate::drone::Drone,
    pub tick: usize,
    pub max_ticks: Option<usize>,
}

impl Simulation {
    pub fn new(
        environment: crate::env::Environment,
        drone: crate::drone::Drone,
        max_ticks: Option<usize>,
    ) -> Self {
        let mut simulation = Simulation {
            environment,
            drone,
            tick: 0,
            max_ticks,
        };

        simulation
    }

    pub fn run(&mut self) {
        match self.max_ticks {
            Some(max_ticks) => {
                for _ in 0..max_ticks {
                    self.tick += 1;
                    // Tick logic
                }
            }
            None => loop {
                self.tick += 1;
                // Tick logic
            },
        }
    }
}
