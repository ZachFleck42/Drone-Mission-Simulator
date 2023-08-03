import { Simulation } from '../types/Simulation';

interface HistoryListProps {
	simulations: [string, Simulation][];
}

export default function HistoryList({ simulations }: HistoryListProps) {
	const sizes = simulations.map((sim: [string, Simulation], index) => (
		<p key={index}>{sim[1][index].environment.terrain.size}</p>
	));
	return <div className="sim-history-container">{sizes}</div>;
}
