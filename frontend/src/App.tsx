import React, { useState } from 'react';
import GetButton from './lib/components/GetButton';
import PostButton from './lib/components/PostButton';
import './App.css';

type InputData = {
	env_terrain_grid_size: number;
	env_terrain_hostile_rate: number;
	env_target_move_rate: number;
	drone_move_range: number;
	drone_vis_range: number;
	sim_max_ticks: number;
};

function App() {
	const defaultInputData: InputData = {
		env_terrain_grid_size: 16,
		env_terrain_hostile_rate: 10,
		env_target_move_rate: 10,
		drone_move_range: 1,
		drone_vis_range: 2,
		sim_max_ticks: 64,
	};

	const [interactedFields, setInteractedFields] = useState<
		Record<keyof InputData, boolean>
	>({
		env_terrain_grid_size: false,
		env_terrain_hostile_rate: false,
		env_target_move_rate: false,
		drone_move_range: false,
		drone_vis_range: false,
		sim_max_ticks: false,
	});

	const [inputData, setInputData] = useState(defaultInputData);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		const numValue =
			value === ''
				? defaultInputData[name as keyof InputData]
				: parseInt(value, 10);

		setInteractedFields((prevInteractedFields) => ({
			...prevInteractedFields,
			[name]: true,
		}));

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
						interactedFields.env_terrain_grid_size
							? inputData.env_terrain_grid_size
							: ''
					}
					onChange={handleInputChange}
					placeholder={`Terrain grid size (default ${defaultInputData.env_terrain_grid_size})`}
				/>

				<input
					type="number"
					name="env_terrain_hostile_rate"
					value={
						interactedFields.env_terrain_hostile_rate
							? inputData.env_terrain_hostile_rate
							: ''
					}
					onChange={handleInputChange}
					placeholder={`Terrain hostile rate (default ${defaultInputData.env_terrain_hostile_rate})`}
				/>

				<input
					type="number"
					name="env_target_move_rate"
					value={
						interactedFields.env_target_move_rate
							? inputData.env_target_move_rate
							: ''
					}
					onChange={handleInputChange}
					placeholder={`Target move rate (default ${defaultInputData.env_target_move_rate})`}
				/>

				<input
					type="number"
					name="drone_move_range"
					value={
						interactedFields.drone_move_range ? inputData.drone_move_range : ''
					}
					onChange={handleInputChange}
					placeholder={`Drone move range (default ${defaultInputData.drone_move_range})`}
				/>

				<input
					type="number"
					name="drone_vis_range"
					value={
						interactedFields.drone_vis_range ? inputData.drone_vis_range : ''
					}
					onChange={handleInputChange}
					placeholder={`Drone visibility range (default ${defaultInputData.drone_vis_range})`}
				/>

				<input
					type="number"
					name="sim_max_ticks"
					value={
						interactedFields.sim_max_ticks
							? inputData.sim_max_ticks.toString()
							: ''
					}
					onChange={handleInputChange}
					placeholder={`Simulation ticks (default ${defaultInputData.sim_max_ticks})`}
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
