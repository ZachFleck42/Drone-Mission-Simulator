import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements, MeshProps } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, Simulation, Drone } from '../types/Simulation';
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei';

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

// function Target() {}

function SimulationCanvas({
	data,
	currentFrameIndex,
	setCurrentFrameIndex,
	isPlaying,
	setIsPlaying,
}: {
	data: Simulation;
	currentFrameIndex: number;
	setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const grid_size = data[0].environment.terrain.size;

	const sceneRef = React.useRef(null!);
	const gridRef = React.useRef(null!);

	useFrame(() => {
		const frame = data[currentFrameIndex];
		const { drone, environment } = frame;
	});

	return (
		<group name="scene">
			<PerspectiveCamera makeDefault fov={75} position={[4, 6, 4]} />
			<OrbitControls maxPolarAngle={Math.PI / 2} />
			<ambientLight />
			<directionalLight position={[0, 10, 0]} intensity={0.5} color={'white'} />
			<Grid environment={data[0].environment} drone={data[0].drone} />
		</group>
	);
}

export default SimulationCanvas;
