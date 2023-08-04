import React, { useEffect, useState } from 'react';
import { Simulation, SimulationHistory } from '../types/Simulation';
import editSVG from '../assets/icons/edit.svg';
import saveSVG from '../assets/icons/save.svg';
import trashSVG from '../assets/icons/delete.svg';
import rightSVG from '../assets/icons/right.svg';
import downSVG from '../assets/icons/down.svg';

interface HistoryListProps {
	simHistory: SimulationHistory[];
	setSimHistory: React.Dispatch<React.SetStateAction<SimulationHistory[]>>;
	activeData: Simulation;
	setActiveData: React.Dispatch<React.SetStateAction<Simulation>>;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
}

function formatTimestamp(timestamp: number): string {
	const date = new Date(timestamp);

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
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
	const [removeLastBorder, setRemoveLastBorder] = useState(false);

	useEffect(() => {
		setRemoveLastBorder(simHistory.length > 5);
		setEditingIndex(null);
		setExpandedIndex(null);
	}, [simHistory]);

	const handleEditClick = (index: number) => {
		setEditingIndex(index);
		setEditedName(simHistory[index].name);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		if (inputValue.length <= 20) {
			setEditedName(inputValue);
		}
	};

	const handleNameKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && editingIndex !== null) {
			handleNameSubmit(editingIndex);
		}

		if (event.key === 'Escape' && editingIndex !== null) {
			setEditingIndex(null);
		}
	};

	const handleNameSubmit = (index: number) => {
		const updatedSims = [...simHistory];
		updatedSims[index].name = editedName;
		setSimHistory(updatedSims);
		setEditingIndex(null);
	};

	const handleDeleteClick = (index: number) => {
		const updatedSims = [...simHistory];
		const deletedSimulation = updatedSims.splice(index, 1)[0];
		setSimHistory(updatedSims);
		setEditingIndex(null);

		if (activeData === deletedSimulation.simulation) {
			setCurrentFrameIndex(0);
			setIsPlaying(false);
		}
	};

	const handleDoubleClick = (index: number) => {
		setActiveData(simHistory[index].simulation);
	};

	const handleExpandClick = (index: number) => {
		setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
	};

	return (
		<div className="sim-history-list">
			{simHistory.map((entry, index) => (
				<div
					key={index}
					style={{ height: expandedIndex === index ? '200px' : '58px' }}
					onDoubleClick={() => handleDoubleClick(index)}
					className={`
					sim-history-item
					${index % 2 === 0 ? 'even' : 'odd'}
					${editingIndex === index ? 'editing' : ''}
					${expandedIndex === index ? 'expanded' : ''}
					${activeData.id === entry.simulation.id ? 'active' : ''}
					${removeLastBorder ? 'remove-border' : ''}`}>
					<div className="sim-history-item-content">
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
								) : entry.name ? (
									entry.name
								) : (
									'Unnamed Simulation'
								)}
							</div>
							<div className="sim-history-item-time">
								{formatTimestamp(entry.simulation.timestamp)}
							</div>
						</div>
						<div className="sim-history-item-edit-name">
							{editingIndex === index ? (
								<img
									src={saveSVG}
									className="sim-history-item-save-icon"
									onClick={() => handleNameSubmit(index)}
								/>
							) : (
								<img
									src={editSVG}
									onClick={() => handleEditClick(index)}
									className="sim-history-item-edit-icon"
								/>
							)}
						</div>
						<div className="sim-history-item-delete">
							<img
								src={trashSVG}
								onClick={() => handleDeleteClick(index)}
								className="sim-history-item-delete-icon"
							/>
						</div>
						<div className="sim-history-expand">
							<img
								src={expandedIndex === index ? downSVG : rightSVG}
								onClick={() => handleExpandClick(index)}
								className="sim-history-item-expand-icon"
							/>
						</div>
					</div>
					<div className="sim-history-item-expanded">
						<div className="sim-history-expanded-item">
							<div className="sim-history-expanded-item-key">
								Terrain grid size:
							</div>
							<div className="sim-history-expanded-item-value">
								{entry.simulation.frames[0].environment.terrain.size}
							</div>
						</div>
						<div className="sim-history-expanded-item">
							<div className="sim-history-expanded-item-key">
								Terrain hostile rate:
							</div>
							<div className="sim-history-expanded-item-value">
								{entry.simulation.frames[0].environment.terrain.hostile_rate}
							</div>
						</div>
						<div className="sim-history-expanded-item">
							<div className="sim-history-expanded-item-key">
								Target move rate:
							</div>
							<div className="sim-history-expanded-item-value">
								{entry.simulation.frames[0].environment.target.move_rate}
							</div>
						</div>
						<div className="sim-history-expanded-item">
							<div className="sim-history-expanded-item-key">
								Drone move range:
							</div>
							<div className="sim-history-expanded-item-value">
								{entry.simulation.frames[0].drone.move_range}
							</div>
						</div>
						<div className="sim-history-expanded-item">
							<div className="sim-history-expanded-item-key">
								Drone visiblity range:
							</div>
							<div className="sim-history-expanded-item-value">
								{entry.simulation.frames[0].drone.visibility_range}
							</div>
						</div>
						<div className="sim-history-expanded-item">
							<div className="sim-history-expanded-item-key">
								Simulation ticks:
							</div>
							<div className="sim-history-expanded-item-value">
								{entry.simulation.frames.length - 1}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
