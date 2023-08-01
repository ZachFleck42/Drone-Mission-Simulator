import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements, MeshProps } from '@react-three/fiber';
import * as THREE from 'three';
import { Simulation } from '../types/Simulation';

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

function SimScene({
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
	const terrainGrids = data.map((item) => item.environment.terrain.grid);
	const droneGrids = data.map((item) => item.drone.data.grid);

	const targetPosition: { x: number; y: number } = {
		x: data[currentFrameIndex].environment.target.x,
		y: data[currentFrameIndex].environment.target.y,
	};

	const dronePosition: { x: number; y: number } = {
		x: data[currentFrameIndex].drone.x,
		y: data[currentFrameIndex].drone.y,
	};
	const visibleTiles: [number, number][] =
		data[currentFrameIndex].drone.visible_tiles;

	const currentGrid = terrainGrids[currentFrameIndex];
	return <div />;
}

export default SimScene;
