import * as THREE from 'three';
import { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei';

function DirectionalLightWithHelper(props: ThreeElements['directionalLight']) {
	const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
	useHelper(directionalLightRef, THREE.DirectionalLightHelper);

	return <directionalLight ref={directionalLightRef} {...props} />;
}

function CustomBox(props: ThreeElements['mesh']) {
	const meshRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	useFrame(
		(state, delta) => (
			(meshRef.current.rotation.x += delta),
			(meshRef.current.rotation.y += delta)
		),
	);
	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'red'} />
		</mesh>
	);
}

function CustomPlane(props: ThreeElements['mesh']) {
	const meshRef = useRef<THREE.Mesh>(null!);
	return (
		<mesh {...props} ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry args={[10, 10]} />
			<meshStandardMaterial color="lightgreen" side={THREE.DoubleSide} />
		</mesh>
	);
}

export default function TestCanvas() {
	return (
		<Canvas>
			<PerspectiveCamera makeDefault fov={75} position={[1, 1, 5]} />
			<OrbitControls />
			<ambientLight />
			<DirectionalLightWithHelper
				position={[0, 5, 0]}
				intensity={0.5}
				color={'white'}
			/>
			<axesHelper />
			<CustomPlane />
			<CustomBox position={[0, 2, 0]} />
		</Canvas>
	);
}
