import { useState } from 'react';
import RunSimulation from './lib/components/RunSimulation';
import TerrainDisplay from './lib/components/TerrainDisplay';
import './App.css';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const [apiData, setApiData] = useState<any[]>([]);

	const handleServerResponse = (responseData: any[]) => {
		console.log('Response data from SimulationParams:', responseData);
		setApiData(responseData);
	};

	return (
		<div className="App">
			<RunSimulation api={API} onServerResponse={handleServerResponse} />
			{apiData.length > 0 && <TerrainDisplay data={apiData} />}
		</div>
	);
}

export default App;
