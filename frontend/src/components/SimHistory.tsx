import { Simulation } from '../types/Simulation';

interface HistoryListProps {
	simulations: Simulation[];
}

export default function HistoryList({ simulations }: HistoryListProps) {
	const sizes = simulations.map((sim: Simulation, index) => (
		<p key={index}>{sim[0].environment.terrain.size}</p>
	));
	return <div>{sizes}</div>;
}
