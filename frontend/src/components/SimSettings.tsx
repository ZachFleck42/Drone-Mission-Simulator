import React from 'react';
import Toggle from 'react-toggle';

export default function SimSettings({
	threeD,
	setThreeD,
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
			<Toggle
				icons={false}
				defaultChecked={threeD}
				onChange={() => {
					setThreeD(!threeD);
				}}
			/>
			<Toggle
				icons={false}
				defaultChecked={visTiles}
				onChange={() => {
					setVisTiles(!visTiles);
				}}
			/>
			<Toggle
				icons={false}
				defaultChecked={hostileTiles}
				onChange={() => {
					setHostileTiles(!hostileTiles);
				}}
			/>
			<Toggle
				icons={false}
				defaultChecked={pathHistory}
				onChange={() => {
					setPathHistory(!pathHistory);
				}}
			/>
			<Toggle
				icons={false}
				defaultChecked={unrevealedTiles}
				onChange={() => {
					setUnrevealedTiles(!unrevealedTiles);
				}}
			/>
		</div>
	);
}
