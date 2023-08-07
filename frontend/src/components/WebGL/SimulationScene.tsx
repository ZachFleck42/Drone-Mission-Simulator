import { useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Simulation } from '../../types/Simulation';

import SkyBox from './Skybox';
import DroneMesh from './Drone';
import TargetMesh from './Target';
import { GroundMesh, TerrainTiles } from './Terrain';
import { VisibleTiles, PathTiles, UnknownTiles } from './Tiles';

interface SimulationCanvasProps {
	simulation: Simulation;
	currentFrameIndex: number;
	showAnimation: boolean;
	showVisTiles: boolean;
	showHostileTiles: boolean;
	showPathHistory: boolean;
	showUnknownTiles: boolean;
}

function SimulationRender(props: SimulationCanvasProps) {
	const { simulation, currentFrameIndex } = props;

	const grid_size = simulation.frames[0].environment.terrain.size;
	const [grid_center_x, grid_center_z] = [
		(grid_size - 1) / 2,
		-(grid_size - 1) / 2,
	];

	const [LightTarget] = useState(() => new THREE.Object3D());
	const targetRef = useRef<THREE.Mesh>(null!);
	const droneRef = useRef<THREE.Mesh>(null!);

	return (
		<Canvas shadows>
			<PerspectiveCamera
				makeDefault
				fov={75}
				position={[grid_center_x * 3, grid_size / 2, grid_center_z]}
			/>
			<OrbitControls
				maxPolarAngle={Math.PI / 2}
				target={[grid_center_x, 0, grid_center_z]}
			/>
			<ambientLight />
			<directionalLight
				castShadow
				position={[-grid_size, 20, -grid_size * 2]}
				target={LightTarget}
				intensity={2}
				color={'white'}
				shadow-mapSize-height={2048}
				shadow-mapSize-width={2048}
				shadow-camera-far={500}
				shadow-camera-top={10}
				shadow-camera-right={10}
				shadow-camera-bottom={-10}
				shadow-camera-left={-10}
			/>
			<primitive object={LightTarget} position={[grid_size, -1, 0]} />
			<SkyBox />
			<GroundMesh
				size={grid_size}
				position={[grid_center_x, 0, grid_center_z]}
			/>
			<group name="sim-objects">
				<TerrainTiles
					environment={simulation.frames[currentFrameIndex].environment}
					visible={props.showHostileTiles}
				/>
				<TargetMesh
					targetRef={targetRef}
					environment={simulation.frames[currentFrameIndex].environment}
					showAnimation={props.showAnimation}
				/>
				<DroneMesh
					droneRef={droneRef}
					drone={simulation.frames[currentFrameIndex].drone}
					showAnimation={props.showAnimation}
				/>
				<VisibleTiles
					tiles={simulation.frames[currentFrameIndex].drone.visible_tiles}
					visible={props.showVisTiles}
				/>
				<PathTiles
					tiles={simulation.frames[currentFrameIndex].drone.path_history}
					visible={props.showPathHistory}
				/>
				<UnknownTiles
					tiles={simulation.frames[currentFrameIndex].drone.unknown_tiles}
					visible={props.showUnknownTiles}
				/>
			</group>
		</Canvas>
	);
}

export default SimulationRender;
