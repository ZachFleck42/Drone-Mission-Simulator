import { Simulation } from '../types/Simulation';

interface CurrentSimInfoProps {
	simulation: Simulation;
	currentFrameIndex: number;
}

export default function CurrentSimInfo({
	simulation,
	currentFrameIndex,
}: CurrentSimInfoProps) {
	const max_frames = simulation.frames.length - 1;
	const frame = simulation.frames[currentFrameIndex];

	const [target_x, target_y] = [
		frame.environment.target.x,
		frame.environment.target.y,
	];

	const grid_size = frame.environment.terrain.size;
	const [drone_x, drone_y] = [frame.drone.x, frame.drone.y];
	const drone_status = frame.drone.status;

	return (
		<div className="sim-info">
			<div className="sim-info-item">
				<div className="sim-info-item-name">Current frame:</div>
				<div className="sim-info-item-value">
					{currentFrameIndex} / {max_frames}
				</div>
			</div>
			<div className="sim-info-item">
				<div className="sim-info-item-name">Drone status:</div>
				<div className="sim-info-item-value">{drone_status}</div>
			</div>
			<div className="sim-info-item">
				<div className="sim-info-item-name">Drone position:</div>
				<div className="sim-info-item-value">
					{drone_y + 1}, {grid_size - drone_x}
				</div>
			</div>
			<div className="sim-info-item">
				<div className="sim-info-item-name">Target position:</div>
				<div className="sim-info-item-value">
					{target_y + 1}, {grid_size - target_x}
				</div>
			</div>
		</div>
	);
}
