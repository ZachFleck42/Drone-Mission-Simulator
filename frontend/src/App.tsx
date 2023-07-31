import './App.css';
import { useState } from 'react';
import { Simulation } from './types/Simulation';
import RunSimulation from './components/RunSimulation';
import EnvDisplay from './components/EnvDisplay';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const [apiData, setApiData] = useState<Simulation>([]);

	const handleServerResponse = (responseData: Simulation) => {
		console.log('Response data from SimulationParams:', responseData);
		setApiData(responseData);
	};

	return (
		<div className="App">
			<RunSimulation api={API} onServerResponse={handleServerResponse} />
			{apiData.length > 0 && <EnvDisplay data={apiData} />}
		</div>
	);
}

export default App;
