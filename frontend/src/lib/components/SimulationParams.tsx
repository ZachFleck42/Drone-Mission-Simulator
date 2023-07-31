import React, { useState } from 'react';
import PostButton from './PostButton';

type InputData = {
	env_terrain_grid_size: number;
	env_terrain_hostile_rate: number;
	env_target_move_rate: number;
	drone_move_range: number;
	drone_vis_range: number;
	sim_max_ticks: number;
};

const defaultInputData: InputData = {
	env_terrain_grid_size: 16,
	env_terrain_hostile_rate: 10,
	env_target_move_rate: 10,
	drone_move_range: 1,
	drone_vis_range: 2,
	sim_max_ticks: 64,
};

const inputFields: Array<{ key: keyof InputData; label: string }> = [
	{ key: 'env_terrain_grid_size', label: 'Terrain grid size' },
	{ key: 'env_terrain_hostile_rate', label: 'Terrain hostile rate' },
	{ key: 'env_target_move_rate', label: 'Target move rate' },
	{ key: 'drone_move_range', label: 'Drone move range' },
	{ key: 'drone_vis_range', label: 'Drone visibility range' },
	{ key: 'sim_max_ticks', label: 'Simulation ticks' },
];

function SimulationParams() {
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
		const numValue = value === '' ? undefined : parseInt(value, 10);

		setInteractedFields((prevInteractedFields) => ({
			...prevInteractedFields,
			[name]: value !== '',
		}));

		setInputData((prevData) => ({
			...prevData,
			[name]:
				numValue !== undefined
					? numValue
					: defaultInputData[name as keyof InputData],
		}));
	};

	return (
		<div className="App">
			<div className="input-container">
				{inputFields.map((field) => (
					<input
						key={field.key}
						type="number"
						name={field.key}
						value={interactedFields[field.key] ? inputData[field.key] : ''}
						onChange={handleInputChange}
						placeholder={`${field.label} (default is ${
							defaultInputData[field.key]
						})`}
					/>
				))}
			</div>
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

export default SimulationParams;
