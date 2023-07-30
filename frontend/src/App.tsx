import GetButton from './lib/components/GetButton';
import PostButton from './lib/components/PostButton';

function App() {
	const postData = {
		test1: 'Hello',
		test2: 'world!',
	};

	return (
		<div className="App">
			<p>Hello world!</p>
			<GetButton url="http://127.0.0.1:8080/" />
			<PostButton url="http://127.0.0.1:8080/echo" postData={postData} />
		</div>
	);
}

export default App;
