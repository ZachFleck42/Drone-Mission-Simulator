import { useState } from 'react';
import { Simulation } from '../types/Simulation';

function GridDisplay({ data }: { data: Simulation }) {
	const [currentGridIndex, setCurrentFrameIndex] = useState<number>(0);
	const terrainGrids = data.map((item) => item.environment.terrain.grid);
	const droneGrids = data.map((item) => item.drone.data.grid);

	const targetPosition: { x: number; y: number } = {
		x: data[currentGridIndex].environment.target.x,
		y: data[currentGridIndex].environment.target.y,
	};

	const dronePosition: { x: number; y: number } = {
		x: data[currentGridIndex].drone.x,
		y: data[currentGridIndex].drone.y,
	};

	const firstFrame = () => {
		setCurrentFrameIndex(0);
	};

	const previousFrame = () => {
		setCurrentFrameIndex((prevIndex) => prevIndex - 1);
	};

	const nextFrame = () => {
		setCurrentFrameIndex((prevIndex) => prevIndex + 1);
	};

	const lastFrame = () => {
		setCurrentFrameIndex(terrainGrids.length - 1);
	};

	const currentGrid = terrainGrids[currentGridIndex];

	return (
		<div className="grid-display">
			<div className="grid-container">
				{currentGrid.map((row, rowIndex) => (
					<div className="grid-row" key={rowIndex}>
						{row.map((cell, colIndex) => (
							<div
								className={`grid-cell${cell.hostile ? ' hostile' : ''}${
									targetPosition.x === rowIndex && targetPosition.y === colIndex
										? ' target'
										: ''
								}`}
								key={colIndex}>
								{targetPosition.x === rowIndex && targetPosition.y === colIndex
									? 'T'
									: ''}
								{dronePosition.x === rowIndex && dronePosition.y === colIndex
									? 'D'
									: ''}
							</div>
						))}
					</div>
				))}
			</div>
			<div className="frame-buttons">
				<button onClick={firstFrame}>&lt; &lt;</button>
				<button onClick={previousFrame} disabled={currentGridIndex === 0}>
					&lt;
				</button>
				<span>
					{currentGridIndex} / {terrainGrids.length - 1}
				</span>
				<button
					onClick={nextFrame}
					disabled={currentGridIndex === terrainGrids.length - 1}>
					&gt;
				</button>
				<button onClick={lastFrame}>&gt; &gt;</button>
			</div>
		</div>
	);
}

export default GridDisplay;
