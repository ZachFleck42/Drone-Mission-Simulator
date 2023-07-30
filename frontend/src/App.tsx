import React, { useState } from 'react';
import GetButton from './lib/components/GetButton';
import PostButton from './lib/components/PostButton';
import './App.css';

function App() {
	const [inputData, setInputData] = useState({
		env_terrain_grid_size: 0,
		env_terrain_hostile_rate: 0,
		env_target_move_rate: 0,
		drone_move_range: 0,
		drone_vis_range: 0,
		sim_max_ticks: 0,
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		const numValue = value === '' ? 0 : parseInt(value, 10);

		if (!isNaN(numValue) && numValue >= 0) {
			setInputData((prevData) => ({
				...prevData,
				[name]: numValue,
			}));
		}
	};

	return (
		<div className="App">
			<p>Hello world!</p>
			<div className="input-container">
				<input
					type="number"
					name="env_terrain_grid_size"
					value={
						inputData.env_terrain_grid_size === 0
							? ''
							: inputData.env_terrain_grid_size
					}
					onChange={handleInputChange}
					placeholder="Terrain grid size (default 16)"
				/>
				<input
					type="number"
					name="env_terrain_hostile_rate"
					value={
						inputData.env_terrain_hostile_rate === 0
							? ''
							: inputData.env_terrain_hostile_rate
					}
					onChange={handleInputChange}
					placeholder="Terrain hostile rate (default 10)"
				/>
				<input
					type="number"
					name="env_target_move_rate"
					value={
						inputData.env_target_move_rate === 0
							? ''
							: inputData.env_target_move_rate
					}
					onChange={handleInputChange}
					placeholder="Target move rate (default 10)"
				/>
				<input
					type="number"
					name="drone_move_range"
					value={
						inputData.drone_move_range === 0 ? '' : inputData.drone_move_range
					}
					onChange={handleInputChange}
					placeholder="Drone move range (default 1)"
				/>
				<input
					type="number"
					name="drone_vis_range"
					value={
						inputData.drone_vis_range === 0 ? '' : inputData.drone_vis_range
					}
					onChange={handleInputChange}
					placeholder="Drone visibility range (default 2)"
				/>
				<input
					type="number"
					name="sim_max_ticks"
					value={inputData.sim_max_ticks === 0 ? '' : inputData.sim_max_ticks}
					onChange={handleInputChange}
					placeholder="Simulation ticks (default 100)"
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
