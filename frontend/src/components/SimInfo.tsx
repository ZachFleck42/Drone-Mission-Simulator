import { Simulation } from '../types/Simulation';

interface CurrentSimInfoProps {
	sim: Simulation;
	currentFrameIndex: number;
}

export default function CurrentSimInfo({
	sim,
	currentFrameIndex,
}: CurrentSimInfoProps) {
	const max_frames = sim.length;
	const frame = sim[currentFrameIndex];

	const [target_x, target_y] = [
		frame.environment.target.x,
		frame.environment.target.y,
	];

	const [drone_x, drone_y] = [frame.drone.x, frame.drone.y];
	const drone_status = frame.drone.status;

	return (
		<div className="sim-info-container">
			<div className="sim-info-text">
				<div className="sim-info-item">
					<div className="sim-info-item-name">Frame / Max Frames</div>
					<div className="sim-info-item-value"></div>
				</div>
			</div>
		</div>
	);
}
