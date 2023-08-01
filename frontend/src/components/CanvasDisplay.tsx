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

interface TargetProps {
	environment: Environment;
	targetRef: React.MutableRefObject<THREE.Mesh>;
}

function Target({ environment, targetRef }: TargetProps) {
	useFrame(() => {
		const { x, y } = environment.target;
		targetRef.current.position.set(x, 0.5, y);
	});

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

	const groupRef = useRef(null!);
	const targetRef = useRef<THREE.Mesh>(null!);

	useFrame(() => {
		const frame = data[currentFrameIndex];
		const { drone, environment } = frame;

		const { x, y } = environment.target;
		targetRef.current.position.set(x, 0.5, y);
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
				environment={data[currentFrameIndex].environment}
				targetRef={targetRef}
			/>
		</group>
	);
}

export default SimulationCanvas;
