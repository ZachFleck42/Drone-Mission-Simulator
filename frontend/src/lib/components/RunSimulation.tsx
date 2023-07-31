import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';

type SimParams = {
	terrain_grid_size: number;
	terrain_hostile_rate: number;
	target_move_rate: number;
	drone_move_range: number;
	drone_vis_range: number;
	sim_max_frames: number;
};

const inputFields: Array<{
	key: keyof SimParams;
	label: string;
	default: number;
}> = [
	{ key: 'terrain_grid_size', label: 'Terrain grid size', default: 16 },
	{ key: 'terrain_hostile_rate', label: 'Terrain hostile rate', default: 10 },
	{ key: 'target_move_rate', label: 'Target move rate', default: 10 },
	{ key: 'drone_move_range', label: 'Drone move range', default: 1 },
	{ key: 'drone_vis_range', label: 'Drone visibility range', default: 2 },
	{ key: 'sim_max_frames', label: 'Simulation ticks', default: 64 },
];

function RunSimulation({
	api,
	onServerResponse,
}: {
	api: string;
	onServerResponse: (responseData: any) => void;
}) {
	const [interactedFields, setInteractedFields] = useState<
		Record<keyof SimParams, boolean>
	>({
		terrain_grid_size: false,
		terrain_hostile_rate: false,
		target_move_rate: false,
		drone_move_range: false,
		drone_vis_range: false,
		sim_max_frames: false,
	});

	const [SimParams, setInputData] = useState<SimParams>(() => {
		const initialData: SimParams = {} as SimParams;
		inputFields.forEach((field) => (initialData[field.key] = field.default));
		return initialData;
	});

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
					: inputFields.find((field) => field.key === name)?.default ?? 0,
		}));
	};

	const handleSubmit = async () => {
		let data = SimParams;
		try {
			const response: AxiosResponse = await axios.post(api, data);
			onServerResponse(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="run-simulation">
			<div className="simulation-params">
				{inputFields.map((field) => (
					<input
						key={field.key}
						type="number"
						name={field.key}
						value={interactedFields[field.key] ? SimParams[field.key] : ''}
						onChange={handleInputChange}
						placeholder={`${field.label} (Default is ${field.default})`}
					/>
				))}
			</div>
			<button onClick={handleSubmit}>Get simulation data</button>
		</div>
	);
}

export default RunSimulation;