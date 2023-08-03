import './App.css';
import { useState } from 'react';
import { Simulation, SimulationHistory } from './types/Simulation';
import ParamInputs from './components/ParamInputs';
import GridDisplay from './components/GridDisplay';
import SimulationCanvas from './components/CanvasDisplay';
import FrameControls from './components/FrameControls';
import HistoryList from './components/SimHistory';
import SimSettings from './components/SimSettings';
import CurrentSimInfo from './components/SimInfo';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const [activeData, setActiveData] = useState<Simulation>([]);
	const [simHistory, setSimHistory] = useState<SimulationHistory[]>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [animated, setAnimated] = useState<boolean>(true);
	const [threeD, setThreeD] = useState<boolean>(true);
	const [visTiles, setVisTiles] = useState<boolean>(true);
	const [hostileTiles, setHostileTiles] = useState<boolean>(true);
	const [pathHistory, setPathHistory] = useState<boolean>(false);
	const [unrevealedTiles, setUnrevealedTiles] = useState<boolean>(false);

	const handleServerResponse = (responseData: Simulation) => {
		setSimHistory((oldData) => [
			...oldData,
			{
				name: '',
				timestamp: Date.now().toString(),
				data: responseData,
			},
		]);

		setActiveData(responseData);
		setCurrentFrameIndex(0);
		setIsPlaying(false);
	};

	return (
		<div className="App">
			<div className="simulator">
				<div className="sim-inputs">
					<div className="sim-inputs-header">Parameters</div>
					<div className="sim-inputs-container">
						<ParamInputs api={API} onServerResponse={handleServerResponse} />
					</div>
					<div className="sim-settings-header">Display Settings</div>
					<div className="sim-settings-container">
						<SimSettings
							threeD={threeD}
							setThreeD={setThreeD}
							animated={animated}
							setAnimated={setAnimated}
							visTiles={visTiles}
							setVisTiles={setVisTiles}
							hostileTiles={hostileTiles}
							setHostileTiles={setHostileTiles}
							pathHistory={pathHistory}
							setPathHistory={setPathHistory}
							unrevealedTiles={unrevealedTiles}
							setUnrevealedTiles={setUnrevealedTiles}
						/>
					</div>
				</div>
				<div className="sim-display">
					<div className="sim-display-header">Simulation</div>
					<div className="sim-display-container">
						{activeData.length === 0 ? (
							<div style={{ color: 'white' }}>Waiting for data...</div>
						) : (
							<>
								{threeD ? (
									<SimulationCanvas
										data={activeData}
										currentFrameIndex={currentFrameIndex}
										showAnimation={animated}
										showVisTiles={visTiles}
										showHostileTiles={hostileTiles}
										showPathHistory={pathHistory}
										showUnrevealedTiles={unrevealedTiles}
									/>
								) : (
									<GridDisplay
										data={activeData}
										currentFrameIndex={currentFrameIndex}
									/>
								)}
							</>
						)}
						{activeData.length === 0 ? (
							''
						) : (
							<FrameControls
								maxFrames={activeData.length}
								currentFrameIndex={currentFrameIndex}
								setCurrentFrameIndex={setCurrentFrameIndex}
								isPlaying={isPlaying}
								setIsPlaying={setIsPlaying}
							/>
						)}
					</div>
				</div>
				<div className="sim-history">
					<div className="sim-history-header">History</div>
					<div className="sim-history-container">
						{activeData.length === 0 ? (
							<div className="sim-history-loading">Waiting for data...</div>
						) : (
							<HistoryList sims={simHistory} setSimHistory={setSimHistory} />
						)}
					</div>
					<div className="sim-info-header">Current Simulation Info</div>
					<div className="sim-info-container">
						{activeData.length === 0 ? (
							<div className="sim-info-loading">Waiting for data...</div>
						) : (
							<CurrentSimInfo
								sim={activeData}
								currentFrameIndex={currentFrameIndex}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
