import { SimulationHistory } from '../types/Simulation';

interface HistoryListProps {
	sims: SimulationHistory[];
}

export default function HistoryList({ sims }: HistoryListProps) {
	const handleSimulationClick = (simulation: SimulationHistory) => {
		console.log(simulation.timestamp);
	};

	return (
		<div className="sim-history-container">
			{sims.map((simulation, index) => (
				<div
					key={index}
					className="sim-history-item"
					onClick={() => handleSimulationClick(simulation)}>
					<div className="sim-history-item-name">{simulation.name}</div>
					<div className="sim-history-item-time">{simulation.timestamp}</div>
				</div>
			))}
		</div>
	);
}
