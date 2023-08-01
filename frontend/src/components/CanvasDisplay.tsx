import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements, MeshProps } from '@react-three/fiber';
import * as THREE from 'three';

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

function Grid() {
	return <div />;
}

export default Grid;
