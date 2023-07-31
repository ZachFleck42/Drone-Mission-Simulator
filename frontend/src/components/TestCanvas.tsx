import * as THREE from 'three';
import { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Box(props: ThreeElements['mesh']) {
	const meshRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	useFrame((state, delta) => (meshRef.current.rotation.x += delta));
	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	);
}

function Plane(props: ThreeElements['mesh']) {
	const meshRef = useRef<THREE.Mesh>(null!);
	return (
		<mesh {...props} ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry attach="geometry" args={[100, 100]} />
			<meshLambertMaterial
				attach="material"
				color="lightblue"
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

export default function ZCanvas() {
	return (
		<Canvas>
			<OrbitControls />
			<ambientLight />
			<axesHelper />
			<pointLight position={[10, 10, 10]} />
			<Plane />
			<Box position={[0, 2, 0]} />
		</Canvas>
	);
}
