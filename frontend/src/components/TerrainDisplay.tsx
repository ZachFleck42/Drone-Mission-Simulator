import React, { useState } from 'react';

interface GridDisplayProps {
	data: any;
}

const TerrainDisplay: React.FC<GridDisplayProps> = ({ data }) => {
	const [currentGridIndex, setCurrentFrameIndex] = useState<number>(0);
	const terrainGrids = data.map((item: any) => item.environment.terrain.grid);

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

	if (!currentGrid || !currentGrid.length) {
		return null;
	}

	return (
		<div className="grid-display">
			<div className="grid-container">
				{currentGrid.map((row: any[], rowIndex: number) => (
					<div className="grid-row" key={rowIndex}>
						{row.map((cell: any, colIndex: number) => (
							<div
								className={`grid-cell${cell.hostile ? ' hostile' : ''}`}
								key={colIndex}
							/>
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
};

export default TerrainDisplay;
