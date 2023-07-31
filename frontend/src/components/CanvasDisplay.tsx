import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

function Tile(props: ThreeElements['mesh'], size: number, color: string) {
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
			<meshStandardMaterial color={color} side={THREE.DoubleSide}/>
		</mesh>
	);
}

function Grid() {
	return (
	)
}

export default Grid;
