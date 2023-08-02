import './App.css';
import { useState } from 'react';
import { Simulation } from './types/Simulation';
import ParamInputs from './components/ParamInputs';
import GridDisplay from './components/GridDisplay';
import SimulationCanvas from './components/CanvasDisplay';
import FrameControls from './components/FrameControls';
import HistoryList from './components/SimHistory';
import SimSettings from './components/SimSettings';

const API = 'http://127.0.0.1:8080/sim';

function timeout(delay: number) {
	return new Promise((res) => setTimeout(res, delay));
}

function App() {
	const [activeData, setActiveData] = useState<Simulation>([]);
	const [simHistory, setSimHistory] = useState<Simulation[]>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [animated, setAnimated] = useState<boolean>(true);
	const [threeD, setThreeD] = useState<boolean>(true);
	const [visTiles, setVisTiles] = useState<boolean>(true);
	const [hostileTiles, setHostileTiles] = useState<boolean>(true);
	const [pathHistory, setPathHistory] = useState<boolean>(false);
	const [unrevealedTiles, setUnrevealedTiles] = useState<boolean>(false);

	const handleServerResponse = (responseData: Simulation) => {
		setActiveData(responseData);
		setSimHistory((oldData) => [...oldData, responseData]);
		setCurrentFrameIndex(0);
		setIsPlaying(false);
	};

	return (
		<div className="App">
			<div className="simulator">
				<div className="sim-params">
					<div className="sim-params-header">Simulation Parameters</div>
					<div className="sim-params-inputs">
						<ParamInputs api={API} onServerResponse={handleServerResponse} />
					</div>
					<div className="sim-settings">
						<div className="sim-settings-header">Display Settings</div>
						<div className="sim-settings-toggles">
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
				</div>
				<div className="sim-display">
					<div className="sim-display-header">
						<div className="sim-display-title">Simulation</div>
					</div>
					<div className="sim-canvas">
						{activeData.length === 0 ? (
							<div className="loading-text">Waiting for data...</div>
						) : (
							<>
								{threeD ? (
									<SimulationCanvas
										data={activeData}
										currentFrameIndex={currentFrameIndex}
										setCurrentFrameIndex={setCurrentFrameIndex}
										isPlaying={isPlaying}
										setIsPlaying={setIsPlaying}
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
					<div className="sim-history-header">Simulation History</div>
					<HistoryList simulations={simHistory} />
				</div>
			</div>
		</div>
	);
}

export default App;
