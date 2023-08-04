import { Simulation } from '../types/Simulation';

function GridDisplay({
	simulation,
	currentFrameIndex,
}: {
	simulation: Simulation;
	currentFrameIndex: number;
}) {
	const terrainGrids = simulation.frames.map(
		(item) => item.environment.terrain.grid,
	);

	const targetPosition: { x: number; y: number } = {
		x: simulation.frames[currentFrameIndex].environment.target.x,
		y: simulation.frames[currentFrameIndex].environment.target.y,
	};

	const dronePosition: { x: number; y: number } = {
		x: simulation.frames[currentFrameIndex].drone.x,
		y: simulation.frames[currentFrameIndex].drone.y,
	};
	const visibleTiles: [number, number][] =
		simulation.frames[currentFrameIndex].drone.visible_tiles;

	const currentGrid = terrainGrids[currentFrameIndex];

	return (
		<div className="sim-grid-display">
			{currentGrid.map((row, rowIndex) => (
				<div className="sim-grid-display-row" key={rowIndex}>
					{row.map((cell, colIndex) => {
						const isTargetCell =
							targetPosition.x === rowIndex && targetPosition.y === colIndex;
						const isDroneCell =
							dronePosition.x === rowIndex && dronePosition.y === colIndex;
						const isCellVisible = visibleTiles.some(
							([x, y]) => rowIndex === x && colIndex === y,
						);
						const cellClassName = `sim-grid-display-cell${
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
	);
}

export default GridDisplay;
