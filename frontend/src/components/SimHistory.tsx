import { useEffect, useState } from 'react';
import { SimulationHistory } from '../types/Simulation';
import editSVG from '../assets/edit.svg';

function formatTimestamp(timestamp: string): string {
	const date = new Date(Number(timestamp));

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	const formattedTimestamp = `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
	return formattedTimestamp;
}

interface HistoryListProps {
	sims: SimulationHistory[];
}

export default function HistoryList({ sims }: HistoryListProps) {
	const sortedSims = [...sims].sort(
		(a, b) => Number(b.timestamp) - Number(a.timestamp),
	);

	const handleSimulationClick = (simulation: SimulationHistory) => {
		console.log(simulation.timestamp);
	};

	const [removeLastBorder, setRemoveLastBorder] = useState(false);
	useEffect(() => {
		setRemoveLastBorder(sims.length > 5);
	}, [sims]);

	// Add isEditing state for each item
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editedName, setEditedName] = useState<string>('');

	const handleEditClick = (index: number) => {
		setEditingIndex(index);
		setEditedName(sortedSims[index].name);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEditedName(event.target.value);
	};

	const handleNameSubmit = (index: number) => {
		const updatedSims = [...sortedSims];
		updatedSims[index].name = editedName;
		setEditingIndex(null);
	};

	return (
		<div
			className={`sim-history-container ${
				removeLastBorder ? 'remove-border' : ''
			}`}>
			{sortedSims.map((simulation, index) => (
				<div
					key={index}
					className={`sim-history-item ${index % 2 === 0 ? 'even' : 'odd'} ${
						editingIndex === index ? 'editing' : ''
					}`}>
					<div className="sim-history-item-content">
						<div className="sim-history-item-name">
							{editingIndex === index ? (
								<input
									type="text"
									value={editedName}
									onChange={handleNameChange}
								/>
							) : simulation.name ? (
								simulation.name
							) : (
								'No name'
							)}
						</div>
						<div className="sim-history-item-time">
							{formatTimestamp(simulation.timestamp)}
						</div>
						<div className="sim-history-item-edit">
							{editingIndex === index ? (
								<button onClick={() => handleNameSubmit(index)}>Save</button>
							) : (
								<img
									src={editSVG}
									className="edit-icon"
									onClick={() => handleEditClick(index)}
								/>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
