import RunSimulation from './lib/components/RunSimulation';
import './App.css';

const API = 'http://127.0.0.1:8080/sim';

function App() {
	const handleServerResponse = (responseData: any) => {
		console.log('Response data from SimulationParams:', responseData);
	};

	return (
		<div className="App">
			<RunSimulation api={API} onServerResponse={handleServerResponse} />
		</div>
	);
}

export default App;
