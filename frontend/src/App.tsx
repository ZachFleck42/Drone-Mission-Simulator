import './App.css';
import { useState } from 'react';
import { Simulation } from './types/Simulation';
import RunSimulation from './components/RunSimulation';
import GridDisplay from './components/GridDisplay';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const [apiData, setApiData] = useState<Simulation>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);

	const handleServerResponse = (responseData: Simulation) => {
		console.log('Response data from SimulationParams:', responseData);
		setApiData(responseData);
		setCurrentFrameIndex(0);
	};

	return (
		<div className="App">
			<RunSimulation api={API} onServerResponse={handleServerResponse} />
			{apiData.length > 0 ? (
				<GridDisplay
					data={apiData}
					currentFrameIndex={currentFrameIndex}
					setCurrentFrameIndex={setCurrentFrameIndex}
				/>
			) : (
				<div style={{ marginTop: '100px' }}>Waiting for simulation data...</div>
			)}
		</div>
	);
}

export default App;
