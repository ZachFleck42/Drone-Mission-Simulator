import { SimulationHistory } from '../types/Simulation';

interface HistoryListProps {
	sims: SimulationHistory[];
}

function formatTimestamp(timestamp: string): string {
	const date = new Date(Number(timestamp));

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	const formattedTimestamp = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
	return formattedTimestamp;
}

export default function HistoryList({ sims }: HistoryListProps) {
	const sortedSims = [...sims].sort(
		(a, b) => Number(b.timestamp) - Number(a.timestamp),
	);

	const handleSimulationClick = (simulation: SimulationHistory) => {
		console.log(simulation.timestamp);
	};

	return (
		<div className="sim-history-container">
			{sortedSims.map((simulation, index) => (
				<div
					key={index}
					className={`sim-history-item ${index % 2 === 0 ? 'even' : 'odd'}`}
					onClick={() => handleSimulationClick(simulation)}>
					<div className="sim-history-item-text">
						<div className="sim-history-item-name">
							{simulation.name ? simulation.name : 'No name'}
						</div>
						<div className="sim-history-item-time">
							{formatTimestamp(simulation.timestamp)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
