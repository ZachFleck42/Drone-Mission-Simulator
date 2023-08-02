import './App.css';
import { useState } from 'react';
import { Simulation } from './types/Simulation';
import RunSimulation from './components/RunSimulation';
import GridDisplay from './components/GridDisplay';
import { Canvas } from '@react-three/fiber';
import SimulationCanvas from './components/CanvasDisplay';
import SimControls from './components/SimControls';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const [apiData, setApiData] = useState<Simulation>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	let threeD = true;

	const handleServerResponse = (responseData: Simulation) => {
		console.log('Response data from SimulationParams:', responseData);
		setApiData(responseData);
		setCurrentFrameIndex(0);
		setIsPlaying(false);
	};

	return (
		<div className="App">
			<div className="simulator">
				<div className="sim-params">
					<div className="sim-params-header">Simulation Parameters</div>
					<RunSimulation api={API} onServerResponse={handleServerResponse} />
				</div>
				<div className="simulation-container">
					<div className="simulation-container-header">Simulation</div>
					<div className="sim-display">
						{apiData.length <= 0 ? (
							<span>Waiting for data</span>
						) : (
							<>
								{threeD ? (
									<Canvas shadows>
										<SimulationCanvas
											data={apiData}
											currentFrameIndex={currentFrameIndex}
											setCurrentFrameIndex={setCurrentFrameIndex}
											isPlaying={isPlaying}
											setIsPlaying={setIsPlaying}
										/>
									</Canvas>
								) : (
									<GridDisplay
										data={apiData}
										currentFrameIndex={currentFrameIndex}
									/>
								)}
							</>
						)}
					</div>
					<div className="sim-controls">
						<SimControls
							maxFrames={apiData.length}
							currentFrameIndex={currentFrameIndex}
							setCurrentFrameIndex={setCurrentFrameIndex}
							isPlaying={isPlaying}
							setIsPlaying={setIsPlaying}
						/>
					</div>
				</div>
				<div className="sim-history">
					<div className="sim-history-header">Simulation History</div>
				</div>
			</div>
		</div>
	);
}

export default App;
