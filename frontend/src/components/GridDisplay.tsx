import { Simulation } from '../types/Simulation';

function GridDisplay({
	data,
	currentFrameIndex,
}: {
	data: Simulation;
	currentFrameIndex: number;
}) {
	const terrainGrids = data.map((item) => item.environment.terrain.grid);

	const targetPosition: { x: number; y: number } = {
		x: data[currentFrameIndex].environment.target.x,
		y: data[currentFrameIndex].environment.target.y,
	};

	const dronePosition: { x: number; y: number } = {
		x: data[currentFrameIndex].drone.x,
		y: data[currentFrameIndex].drone.y,
	};
	const visibleTiles: [number, number][] =
		data[currentFrameIndex].drone.visible_tiles;

	const currentGrid = terrainGrids[currentFrameIndex];

	return (
		<div className="grid-display">
			<div className="grid-container">
				{currentGrid.map((row, rowIndex) => (
					<div className="grid-row" key={rowIndex}>
						{row.map((cell, colIndex) => {
							const isTargetCell =
								targetPosition.x === rowIndex && targetPosition.y === colIndex;
							const isDroneCell =
								dronePosition.x === rowIndex && dronePosition.y === colIndex;
							const isCellVisible = visibleTiles.some(
								([x, y]) => rowIndex === x && colIndex === y,
							);
							const cellClassName = `grid-cell${
								cell.hostile ? ' hostile' : ''
							}${isCellVisible ? ' visible' : ''}${
								isCellVisible && cell.hostile ? ' visible-hostile' : ''
							}${isTargetCell ? ' target' : ''}`;
							return (
								<div className={cellClassName} key={colIndex}>
									{isTargetCell ? 'T' : ''}
									{isDroneCell ? 'D' : ''}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}

export default GridDisplay;
