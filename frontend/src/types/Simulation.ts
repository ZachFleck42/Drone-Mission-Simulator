export interface EnvGridPoint {
	x: number;
	y: number;
	hostile: boolean;
}

export interface DroneGridPoint {
	x: number;
	y: number;
	hostile: string;
	content: string;
}

export interface Terrain {
	size: number;
	grid: EnvGridPoint[][];
	hostile_rate: number;
}

export interface Target {
	x: number;
	y: number;
	move_rate: number;
	name: string | null;
}

export interface Environment {
	terrain: Terrain;
	target: Target;
}

export interface Drone {
	x: number;
	y: number;
	move_range: number;
	visibility_range: number;
	status: string;
	visible_tiles: [number, number][];
	unknown_tiles: [number, number][];
	path_history: [number, number][];
	data: {
		grid_size: number;
		grid: DroneGridPoint[][];
		last_target_pos: [number, number] | null;
	};
	flags: string[];
}

export interface Frame {
	frame_no: number;
	environment: Environment;
	drone: Drone;
}

export interface Simulation {
	id: string;
	timestamp: number;
	frames: Frame[];
}

export interface SimulationHistory {
	name: string;
	simulation: Simulation;
}
