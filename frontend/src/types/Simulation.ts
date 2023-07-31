interface EnvGridPoint {
	x: number;
	y: number;
	hostile: boolean;
}

interface DroneGridPoint {
	x: number;
	y: number;
	hostile: string;
	content: string;
}

interface Terrain {
	size: number;
	grid: EnvGridPoint[][];
}

interface Target {
	x: number;
	y: number;
	move_rate: number;
	name: string | null;
}

interface Environment {
	terrain: Terrain;
	target: Target;
}

interface Drone {
	x: number;
	y: number;
	move_range: number;
	visibility_range: number;
	status: string;
	path_history: [number, number][];
	data: {
		grid_size: number;
		grid: DroneGridPoint[][];
		last_target_pos: [number, number] | null;
	};
	flags: string[];
}

interface Frame {
	frame_no: number;
	environment: Environment;
	drone: Drone;
}

export type Simulation = Frame[];
