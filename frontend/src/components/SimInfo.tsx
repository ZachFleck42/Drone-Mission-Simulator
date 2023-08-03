import { Simulation } from '../types/Simulation';

interface CurrentSimInfoProps {
	sim: Simulation;
	currentFrameIndex: number;
}

export default function CurrentSimInfo({
	sim,
	currentFrameIndex,
}: CurrentSimInfoProps) {
	const max_frames = sim.length - 1;
	const frame = sim[currentFrameIndex];

	const [target_x, target_y] = [
		frame.environment.target.x,
		frame.environment.target.y,
	];

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
					{drone_x}, {drone_y}
				</div>
			</div>
			<div className="sim-info-item">
				<div className="sim-info-item-name">Target position:</div>
				<div className="sim-info-item-value">
					{target_x}, {target_y}
				</div>
			</div>
		</div>
	);
}
