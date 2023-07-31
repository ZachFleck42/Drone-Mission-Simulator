interface GridPoint {
	x: number;
	y: number;
	hostile: boolean;
}

interface Terrain {
	size: number;
	grid: GridPoint[][];
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
		grid: GridPoint[][];
		last_target_pos: [number, number] | null;
	};
	flags: string[];
}

interface Frame {
	frame_no: number;
	environment: Environment;
	drone: Drone;
}

type APIResponse = Frame[];

export {};
