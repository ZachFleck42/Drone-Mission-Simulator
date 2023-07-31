import './App.css';
import { useState } from 'react';
import { Simulation } from './types/Simulation';
import RunSimulation from './components/RunSimulation';
import GridDisplay from './components/GridDisplay';
import TestCanvas from './components/TestCanvas';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const [apiData, setApiData] = useState<Simulation>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const handleServerResponse = (responseData: Simulation) => {
		console.log('Response data from SimulationParams:', responseData);
		setApiData(responseData);
		setCurrentFrameIndex(0);
		setIsPlaying(false);
	};

	return (
		<div className="App">
			<RunSimulation api={API} onServerResponse={handleServerResponse} />
			{apiData.length > 0 ? (
				<GridDisplay
					data={apiData}
					currentFrameIndex={currentFrameIndex}
					setCurrentFrameIndex={setCurrentFrameIndex}
					isPlaying={isPlaying}
					setIsPlaying={setIsPlaying}
				/>
			) : (
				<div style={{ marginTop: '100px' }}>Waiting for simulation data...</div>
			)}
			<div className="canvas-display">
				<TestCanvas />
			</div>
		</div>
	);
}

export default App;
