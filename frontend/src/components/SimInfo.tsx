import { Simulation } from '../types/Simulation';

interface CurrentSimInfoProps {
	sim: Simulation;
	currentFrameIndex: number;
}

export default function CurrentSimInfo({ sim }: CurrentSimInfoProps) {
	return (
		<div className="sim-info-container">
			<div className="sim-info-text">
				<div className="sim-info-item">
					<div className="sim-info-item-name"></div>
					<div className="sim-info-item-value"></div>
				</div>
			</div>
		</div>
	);
}
