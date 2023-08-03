import React, { useState } from 'react';
import { Simulation, SimulationHistory } from '../types/Simulation';
import editSVG from '../assets/edit.svg';
import trashSVG from '../assets/delete.svg';

interface HistoryListProps {
	simHistory: SimulationHistory[];
	setSimHistory: React.Dispatch<React.SetStateAction<SimulationHistory[]>>;
	activeData: Simulation;
	setActiveData: React.Dispatch<React.SetStateAction<Simulation>>;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
}

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

export default function HistoryList({
	simHistory,
	setSimHistory,
	activeData,
	setActiveData,
	setIsPlaying,
	setCurrentFrameIndex,
}: HistoryListProps) {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editedName, setEditedName] = useState<string>('');

	const handleEditClick = (index: number) => {
		setEditingIndex(index);
		setEditedName(simHistory[index].name);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEditedName(event.target.value);
	};

	const handleNameSubmit = (index: number) => {
		const updatedSims = [...simHistory];
		updatedSims[index].name = editedName;
		setSimHistory(updatedSims);
		setEditingIndex(null);
	};

	const handleNameKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && editingIndex !== null) {
			handleNameSubmit(editingIndex);
		}
	};

	const handleDeleteClick = (index: number) => {
		const updatedSims = [...simHistory];
		const deletedSimulation = updatedSims.splice(index, 1)[0]; // Remove and store the deleted simulation
		setSimHistory(updatedSims);

		if (activeData === deletedSimulation.data) {
			setCurrentFrameIndex(0);
			setIsPlaying(false);
		}
	};

	return (
		<div className="sim-history-list">
			{simHistory.map((simulation, index) => (
				<div
					key={index}
					className={`sim-history-item ${index % 2 === 0 ? 'even' : 'odd'} ${
						editingIndex === index ? 'editing' : ''
					}`}>
					<div className="sim-history-item-text">
						<div className="sim-history-item-name">
							{editingIndex === index ? (
								<input
									type="text"
									value={editedName}
									className="sim-history-item-name-edit-field"
									onChange={handleNameChange}
									onKeyUp={handleNameKeyUp}
									autoFocus
								/>
							) : simulation.name ? (
								simulation.name
							) : (
								'Unnamed Simulation'
							)}
						</div>
						<div className="sim-history-item-time">
							{formatTimestamp(simulation.timestamp)}
						</div>
					</div>
					<div className="sim-history-item-edit-name">
						{editingIndex === index ? (
							<button
								className="sim-history-item-edit-save"
								onClick={() => handleNameSubmit(index)}>
								Save
							</button>
						) : (
							<img
								src={editSVG}
								onClick={() => handleEditClick(index)}
								className="sim-history-item-edit-icon"
							/>
						)}
					</div>
					<img
						src={trashSVG}
						onClick={() => handleDeleteClick(index)}
						className="sim-history-item-delete-icon"
					/>
				</div>
			))}
		</div>
	);
}
