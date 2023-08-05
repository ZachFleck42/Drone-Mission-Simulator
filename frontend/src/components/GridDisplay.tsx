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
	const gridSize = simulation.frames[0].environment.terrain.size;

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

						const cellClassName = `sim-grid-display-cell
				  			${cell.hostile ? ' hostile' : ''}
				  			${isCellVisible ? ' visible' : ''}
				  			${isTargetCell ? ' target' : ''}
				  			${isCellVisible && cell.hostile ? ' visible-hostile' : ''}
							${gridSize > 32 ? 'small-font' : ''}`;

						const tileSize = 600 / gridSize;

						return (
							<div
								style={{
									width: `${tileSize}px`,
									height: `${tileSize}px`,
								}}
								className={cellClassName}
								key={colIndex}>
								<div className={'sim-grid-display-cell-content'}>
									{isTargetCell ? 'T' : ''}
									{isDroneCell ? 'D' : ''}
								</div>
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}

export default GridDisplay;
