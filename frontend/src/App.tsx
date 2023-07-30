import FetchButton from './lib/components/FetchButton';

function App() {
	return (
		<div className="App">
			<p>Hello world!</p>
			<FetchButton url="http://127.0.0.1:8080/" />
		</div>
	);
}

export default App;
