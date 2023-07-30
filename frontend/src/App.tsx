import React, { useState } from 'react';
import GetButton from './lib/components/GetButton';
import PostButton from './lib/components/PostButton';
import './App.css';

function App() {
	const [inputData, setInputData] = useState({
		env_terrain_grid_size: '',
		env_terrain_hostile_rate: '',
		env_target_move_rate: '',
		drone_move_range: '',
		drone_vis_range: '',
		sim_max_ticks: '',
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
					type="number"
					name="env_terrain_grid_size"
					value={inputData.env_terrain_grid_size}
					onChange={handleInputChange}
					placeholder="Terrain grid size"
				/>
				<input
					type="number"
					name="env_terrain_hostile_rate"
					value={inputData.env_terrain_hostile_rate}
					onChange={handleInputChange}
					placeholder="Terrain hostile rate"
				/>
				<input
					type="number"
					name="env_target_move_rate"
					value={inputData.env_target_move_rate}
					onChange={handleInputChange}
					placeholder="Target move rate"
				/>
				<input
					type="number"
					name="drone_move_range"
					value={inputData.drone_move_range}
					onChange={handleInputChange}
					placeholder="Drone move range"
				/>
				<input
					type="number"
					name="drone_vis_range"
					value={inputData.drone_vis_range}
					onChange={handleInputChange}
					placeholder="Drone visibility range"
				/>
				<input
					type="number"
					name="sim_max_ticks"
					value={inputData.sim_max_ticks}
					onChange={handleInputChange}
					placeholder="Simulation ticks"
				/>
			</div>
			<GetButton url="http://127.0.0.1:8080/hello" />
			<PostButton
				buttonText="Echo"
				url="http://127.0.0.1:8080/echo"
				postData={inputData}
			/>
			<PostButton
				buttonText="Sim"
				url="http://127.0.0.1:8080/sim"
				postData={inputData}
			/>
		</div>
	);
}

export default App;
