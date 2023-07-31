import { useState } from 'react';
import { Simulation } from '../types/Simulation';

function EnvDisplay({ data }: { data: Simulation }) {
	const [currentGridIndex, setCurrentFrameIndex] = useState<number>(0);
	const terrainGrids = data.map((item) => item.environment.terrain.grid);
	const targetPosition: { x: number; y: number } = {
		x: data[currentGridIndex].environment.target.x,
		y: data[currentGridIndex].environment.target.y,
	};

	const previousFrame = () => {
		setCurrentFrameIndex(
			(prevIndex) =>
				(prevIndex - 1 + terrainGrids.length) % terrainGrids.length,
		);
	};

	const nextFrame = () => {
		setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % terrainGrids.length);
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
									targetPosition.x === colIndex && targetPosition.y === rowIndex
										? ' target'
										: ''
								}`}
								key={colIndex}>
								{targetPosition.x === colIndex && targetPosition.y === rowIndex
									? 'T'
									: ''}
							</div>
						))}
					</div>
				))}
			</div>
			<div className="frame-buttons">
				<button onClick={previousFrame} disabled={terrainGrids.length <= 1}>
					&lt;
				</button>
				<button onClick={nextFrame} disabled={terrainGrids.length <= 1}>
					&gt;
				</button>
			</div>
		</div>
	);
}

export default EnvDisplay;
