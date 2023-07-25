pub struct Simulation {
    pub environment: crate::env::Environment,
    pub drone: crate::drone::Drone,
    pub tick: usize,
}

impl Simulation {
    pub fn new(environment: crate::env::Environment, drone: crate::drone::Drone) -> Self {
        let mut simulation = Simulation {
            environment,
            drone,
            tick: 0,
        };

        simulation
    }
}
