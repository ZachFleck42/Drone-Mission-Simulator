import SimulationParams from './lib/components/SimulationParams';
import './App.css';

function App() {
	const handleServerResponse = (responseData: any) => {
		console.log('Response data from SimulationParams:', responseData);
	};

	return (
		<div className="App">
			<SimulationParams onServerResponse={handleServerResponse} />
		</div>
	);
}

export default App;
