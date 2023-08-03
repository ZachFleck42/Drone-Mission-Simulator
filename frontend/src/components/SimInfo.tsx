import { Simulation } from '../types/Simulation';

interface CurrentSimInfoProps {
	sim: Simulation;
}

export default function CurrentSimInfo({ sim }: CurrentSimInfoProps) {
	return (
		<div className="current-sim-info-container">
			<p>stuff here</p>
		</div>
	);
}
