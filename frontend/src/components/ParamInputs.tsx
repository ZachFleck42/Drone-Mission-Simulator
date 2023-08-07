import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import tooltipSVG from '../assets/icons/tooltip.svg';

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
	tooltip_content: string;
}> = [
	{
		key: 'terrain_grid_size',
		label: 'Terrain grid size',
		default: 16,
		tooltip_content: `Terrain will be generated as a square of dimensions size * size`,
	},
	{
		key: 'terrain_hostile_rate',
		label: 'Terrain hostile rate',
		default: 10,
		tooltip_content: `The % chance of for any given terrain to be 'hostile', or impossible for the drone to move over`,
	},
	{
		key: 'target_move_rate',
		label: 'Target move rate',
		default: 10,
		tooltip_content:
			'The % chance of the target moving during each tick of the simulation',
	},
	{
		key: 'drone_move_range',
		label: 'Drone move range',
		default: 1,
		tooltip_content:
			'The amount of tiles the drone can move during one tick of the simulation',
	},
	{
		key: 'drone_vis_range',
		label: 'Drone visibility range',
		default: 2,
		tooltip_content: `The radius of tiles the drone can 'see' from its current position`,
	},
	{
		key: 'sim_max_frames',
		label: 'Simulation ticks',
		default: 64,
		tooltip_content: `How many cycles of target/drone movement the simulation should render`,
	},
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

	// User interaction is tracked in order to display placeholder text instead of
	// the default values
	const userInteraction = Object.values(interactedFields).some(
		(value) => value,
	);

	// Initialize the input values with defaults to allow blank-form submission
	const [userInput, setInputData] = useState<SimParams>(() => {
		const initialData: SimParams = {} as SimParams;
		inputFields.forEach((field) => (initialData[field.key] = field.default));
		return initialData;
	});

	// Only allow numerical values greater than 0 in all fields
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

		// Grid size should not be less than 2
		if (params.terrain_grid_size < 2) {
			params.terrain_grid_size = 2;
		}

		// Hostile rate and target rate shouldn not exceed 98/99
		if (params.terrain_hostile_rate > 98) {
			params.terrain_hostile_rate = 98;
		}

		if (params.target_move_rate > 99) {
			params.target_move_rate = 99;
		}

		// Drone_vis_range shouldn't exceed the size of the grid
		if (params.drone_vis_range > params.terrain_grid_size) {
			params.drone_vis_range = params.terrain_grid_size;
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
		<div className="sim-params-container">
			<div className="sim-params-fields">
				{inputFields.map((field) => (
					<div key={field.key} className="sim-param-input-field">
						<input
							type="number"
							name={field.key}
							value={interactedFields[field.key] ? userInput[field.key] : ''}
							onChange={handleInputChange}
							placeholder={`${field.label} (Default: ${field.default})`}
						/>
						<img
							src={tooltipSVG}
							alt={`${field.label}`}
							className="sim-param-tooltip-icon"
							id={field.key}
						/>
						<Tooltip
							className="sim-param-tooltip"
							anchorSelect={`#${field.key}`}
							content={`${field.tooltip_content}`}
							style={{ zIndex: '1' }}
						/>
					</div>
				))}
			</div>
			<div className="sim-params-buttons">
				<button
					className="sim-params-reset"
					onClick={resetToDefault}
					disabled={!userInteraction}>
					Reset to Default
				</button>
				<button className="sim-params-submit" onClick={handleSubmit}>
					Get simulation
				</button>
			</div>
		</div>
	);
}
