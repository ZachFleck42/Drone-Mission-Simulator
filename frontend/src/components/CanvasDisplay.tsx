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
	const meshRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	return (
		<mesh
			{...props}
			ref={meshRef}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<planeGeometry args={[size, size]} />
			<meshStandardMaterial color={color} side={THREE.DoubleSide} />
		</mesh>
	);
}

function Grid() {}

function Drone() {}

function Target() {}

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
	useFrame(() => {
		const frame = data[currentFrameIndex];
		const { drone, environment } = frame;
	});

	return (
		<group>
			<PerspectiveCamera makeDefault fov={75} position={[4, 6, 4]} />
			<OrbitControls />
			<directionalLight position={[0, 10, 0]} />
		</group>
	);
}

export default SimulationCanvas;
