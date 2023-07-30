import React, { useState } from 'react';
import GetButton from './lib/components/GetButton';
import PostButton from './lib/components/PostButton';
import './App.css';

function App() {
	const [inputData, setInputData] = useState({
		input1: '',
		input2: '',
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setInputData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	return (
		<div className="App">
			<p>Hello world!</p>
			<div className="input-container">
				<input
					type="text"
					name="test1"
					value={inputData.input1}
					onChange={handleInputChange}
					placeholder="Enter input 1"
				/>
				<input
					type="text"
					name="test2"
					value={inputData.input2}
					onChange={handleInputChange}
					placeholder="Enter input 2"
				/>
			</div>
			<GetButton url="http://127.0.0.1:8080/" />
			<PostButton url="http://127.0.0.1:8080/echo" postData={inputData} />
		</div>
	);
}

export default App;
