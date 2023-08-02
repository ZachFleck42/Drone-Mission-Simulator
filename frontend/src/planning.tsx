import React from 'react';

function App() {
	return (
		<div className="App">
			<div className="simulator">
				<div className="sim-params">
					<div className="sim-params-header">Simulation Parameters</div>
				</div>
				<div className="simulation-container">
					<div className="simulation-container-header">Simulation</div>
					<div className="sim-display"></div>
					<div className="sim-controls"></div>
				</div>
				<div className="sim-history">
					<div className="sim-history-header">Simulation History</div>
				</div>
			</div>
		</div>
	);
}
