import RunSimulation from './lib/components/RunSimulation';
import './App.css';

function App() {
	const handleServerResponse = (responseData: any) => {
		console.log('Response data from SimulationParams:', responseData);
	};

	return (
		<div className="App">
			<RunSimulation onServerResponse={handleServerResponse} />
		</div>
	);
}

export default App;
