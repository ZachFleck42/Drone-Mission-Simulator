import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeElements, MeshProps } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Environment, Simulation, Drone } from '../types/Simulation';

interface GridTileProps extends MeshProps {
	color: string;
	size: number;
}

function GridTile({ color, size, ...props }: GridTileProps) {
	const tileRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	return (
		<mesh
			{...props}
			ref={tileRef}
			onClick={(event) => console.log(tileRef.current.position)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<planeGeometry args={[size, size]} />
			<meshStandardMaterial
				color={hovered ? 'white' : color}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

interface GridProps {
	environment: Environment;
	drone: Drone;
}

function Grid({ environment, drone }: GridProps) {
	const { terrain } = environment;
	const size = terrain.size;
	const visibleTiles = drone.visible_tiles;

	return (
		<group rotation={[-Math.PI / 2, 0, 0]}>
			{terrain.grid.map((row, rowIndex) => {
				return row.map((tile, colIndex) => {
					const { x, y, hostile } = tile;
					const position: [number, number, number] = [x, y, 0];
					const color = hostile ? 'red' : 'lightgreen';
					return (
						<GridTile
							key={`tile-${rowIndex}-${colIndex}`}
							position={position}
							color={color}
							size={1}
						/>
					);
				});
			})}
		</group>
	);
}

// function Drone() {}

interface TargetProps extends MeshProps {
	environment: Environment;
}

function Target({ environment, ...props }: TargetProps) {
	const targetRef = useRef<THREE.Mesh>(null!);
	const target_x = environment.target.x;
	const target_y = environment.target.y;
	return (
		<mesh ref={targetRef}>
			<boxGeometry args={[0.5, 1, 0.5]} />
			<meshStandardMaterial color={'orange'} />
		</mesh>
	);
}

interface SimulationCanvasProps {
	data: Simulation;
	currentFrameIndex: number;
	setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

function SimulationCanvas(props: SimulationCanvasProps) {
	const {
		data,
		currentFrameIndex,
		setCurrentFrameIndex,
		isPlaying,
		setIsPlaying,
	} = props;

	const sceneRef = useRef(null!);
	const gridRef = useRef(null!);
	const groupRef = useRef(null!);
	const targetRef = useRef<THREE.Mesh>(null!);

	useFrame(() => {
		const frame = data[currentFrameIndex];
		const { drone, environment } = frame;
		const target = environment.target;

		// Set target's position to [target.x, target.y, 0]
		// targetRef.current.position.set(target.x, target.y, 0);
	});

	return (
		<group ref={groupRef} name="scene">
			<PerspectiveCamera makeDefault fov={75} position={[3, 6, 3]} />
			<OrbitControls maxPolarAngle={Math.PI / 2} />
			<ambientLight />
			<directionalLight position={[0, 10, 0]} intensity={0.5} color={'white'} />
			<Grid
				environment={data[currentFrameIndex].environment}
				drone={data[currentFrameIndex].drone}
			/>
			<Target
				ref={targetRef}
				environment={data[currentFrameIndex].environment}
			/>
		</group>
	);
}

export default SimulationCanvas;
