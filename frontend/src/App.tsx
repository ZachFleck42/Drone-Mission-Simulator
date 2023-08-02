import './App.css';
import { useState } from 'react';
import Toggle from 'react-toggle';
import { Simulation } from './types/Simulation';
import ParamInputs from './components/ParamInputs';
import GridDisplay from './components/GridDisplay';
import SimulationCanvas from './components/CanvasDisplay';
import FrameControls from './components/FrameControls';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const [apiData, setApiData] = useState<Simulation>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [threeD, setDimensions] = useState<boolean>(true);

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
					<div className="sim-inputs">
						<ParamInputs api={API} onServerResponse={handleServerResponse} />
					</div>
					<div className="sim-controls">
						<FrameControls
							maxFrames={apiData.length}
							currentFrameIndex={currentFrameIndex}
							setCurrentFrameIndex={setCurrentFrameIndex}
							isPlaying={isPlaying}
							setIsPlaying={setIsPlaying}
						/>
					</div>
				</div>
				<div className="sim-display">
					<div className="sim-display-header">
						<div className="sim-display-title">Simulation</div>
						<label className="threeD-toggle">
							<Toggle
								icons={false}
								defaultChecked={true}
								onChange={() => {
									setDimensions(!threeD);
								}}
							/>
						</label>
					</div>
					<div className="sim-canvas">
						{apiData.length <= 0 ? (
							<div>Waiting for data...</div>
						) : (
							<>
								{threeD ? (
									<SimulationCanvas
										data={apiData}
										currentFrameIndex={currentFrameIndex}
										setCurrentFrameIndex={setCurrentFrameIndex}
										isPlaying={isPlaying}
										setIsPlaying={setIsPlaying}
									/>
								) : (
									<GridDisplay
										data={apiData}
										currentFrameIndex={currentFrameIndex}
									/>
								)}
							</>
						)}
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
