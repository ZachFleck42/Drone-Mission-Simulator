import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';

interface SimParams {
	terrain_grid_size: number;
	terrain_hostile_rate: number;
	target_move_rate: number;
	drone_move_range: number;
	drone_vis_range: number;
	sim_max_frames: number;
}

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

export default function ParamInputs({
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

	const userInteraction = Object.values(interactedFields).some(
		(value) => value,
	);

	const [userInput, setInputData] = useState<SimParams>(() => {
		const initialData: SimParams = {} as SimParams;
		inputFields.forEach((field) => (initialData[field.key] = field.default));
		return initialData;
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		const numValue = parseInt(value, 10);

		if (!Number.isNaN(numValue) && numValue >= 0) {
			setInteractedFields((prevInteractedFields) => ({
				...prevInteractedFields,
				[name]: true,
			}));

			setInputData((prevData) => ({
				...prevData,
				[name]: numValue,
			}));
		} else {
			setInteractedFields((prevInteractedFields) => ({
				...prevInteractedFields,
				[name]: false,
			}));

			setInputData((prevData) => ({
				...prevData,
				[name]: inputFields.find((field) => field.key === name)?.default ?? 0,
			}));
		}
	};

	const handleSubmit = async () => {
		let params = userInput;

		if (params.terrain_grid_size < 2) {
			params.terrain_grid_size = 2;
		}

		try {
			const response: AxiosResponse = await axios.post(api, params);
			onServerResponse(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const resetToDefault = () => {
		const clearedData: SimParams = {} as SimParams;
		inputFields.forEach((field) => (clearedData[field.key] = field.default));
		setInteractedFields({
			terrain_grid_size: false,
			terrain_hostile_rate: false,
			target_move_rate: false,
			drone_move_range: false,
			drone_vis_range: false,
			sim_max_frames: false,
		});
		setInputData(clearedData);
	};

	return (
		<div className="params-container">
			<div className="params-input">
				{inputFields.map((field) => (
					<input
						key={field.key}
						type="number"
						name={field.key}
						value={interactedFields[field.key] ? userInput[field.key] : ''}
						onChange={handleInputChange}
						placeholder={`${field.label} (Default is ${field.default})`}
					/>
				))}
			</div>
			<div className="params-submit">
				<button onClick={resetToDefault} disabled={!userInteraction}>
					Reset to Default
				</button>
				<button onClick={handleSubmit}>Get simulation data</button>
			</div>
		</div>
	);
}
