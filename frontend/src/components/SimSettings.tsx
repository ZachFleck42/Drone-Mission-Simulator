import React from 'react';
import Toggle from 'react-toggle';

export default function SimSettings({
	threeD,
	setThreeD,
	animated,
	setAnimated,
	visTiles,
	setVisTiles,
	hostileTiles,
	setHostileTiles,
	pathHistory,
	setPathHistory,
	unrevealedTiles,
	setUnrevealedTiles,
}: {
	threeD: boolean;
	setThreeD: React.Dispatch<React.SetStateAction<boolean>>;
	animated: boolean;
	setAnimated: React.Dispatch<React.SetStateAction<boolean>>;
	visTiles: boolean;
	setVisTiles: React.Dispatch<React.SetStateAction<boolean>>;
	hostileTiles: boolean;
	setHostileTiles: React.Dispatch<React.SetStateAction<boolean>>;
	pathHistory: boolean;
	setPathHistory: React.Dispatch<React.SetStateAction<boolean>>;
	unrevealedTiles: boolean;
	setUnrevealedTiles: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<div className="sim-settings-toggles">
			<div className="sim-settings-toggle-item">
				<p>Enable 3D:</p>
				<Toggle
					icons={false}
					defaultChecked={threeD}
					onChange={() => {
						setThreeD(!threeD);
					}}
				/>
			</div>
			<div className="sim-settings-toggle-item">
				<p>Enable animation:</p>
				<Toggle
					icons={false}
					defaultChecked={animated}
					onChange={() => {
						setAnimated(!animated);
					}}
				/>
			</div>
			<div className="sim-settings-toggle-item">
				<p>Show visible tiles:</p>
				<Toggle
					icons={false}
					defaultChecked={visTiles}
					onChange={() => {
						setVisTiles(!visTiles);
					}}
				/>
			</div>
			<div className="sim-settings-toggle-item">
				<p>Show hostile tiles:</p>
				<Toggle
					icons={false}
					defaultChecked={hostileTiles}
					onChange={() => {
						setHostileTiles(!hostileTiles);
					}}
				/>
			</div>
			<div className="sim-settings-toggle-item">
				<p>Show unrevealed tiles:</p>
				<Toggle
					icons={false}
					defaultChecked={unrevealedTiles}
					onChange={() => {
						setUnrevealedTiles(!unrevealedTiles);
					}}
				/>
			</div>
			<div className="sim-settings-toggle-item">
				<p>Show path history:</p>
				<Toggle
					icons={false}
					defaultChecked={pathHistory}
					onChange={() => {
						setPathHistory(!pathHistory);
					}}
				/>
			</div>
		</div>
	);
}
