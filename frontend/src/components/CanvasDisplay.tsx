import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements, MeshProps } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, Simulation, Drone } from '../types/Simulation';
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei';

interface GridTileProps extends MeshProps {
	color: string;
}

function GridTile({ color, ...props }: GridTileProps) {
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
			<planeGeometry />
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
	const currentFrameData = data[currentFrameIndex];

	return (
		<Canvas>
			<PerspectiveCamera makeDefault fov={75} position={[4, 6, 4]} />
			<OrbitControls />
			<ambientLight />
		</Canvas>
	);
}

export default SimulationCanvas;
