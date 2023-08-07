import React, { useState } from 'react';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Environment } from '../../types/Simulation';
import ToySoldierModel from '../../assets/models/toy_soldier.glb';

interface TargetProps extends MeshProps {
	environment: Environment;
	targetRef: React.MutableRefObject<THREE.Mesh>;
	showAnimation: boolean;
}

export default function TargetMesh({
	environment,
	targetRef,
	showAnimation,
}: TargetProps) {
	const model: any = useGLTF(ToySoldierModel);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useFrame((_, delta) => {
		const { x, y } = environment.target;
		if (showAnimation) {
			const speed = 2;
			const newX = position.x + (x - position.x) * speed * delta;
			const newY = position.y + (-y - position.y) * speed * delta;
			setPosition({ x: newX, y: newY });
			targetRef.current.position.set(newX, 0.79, newY);
		} else {
			targetRef.current.position.set(x, 0.79, -y);
		}
	});

	return (
		// <mesh castShadow ref={targetRef}>
		// 	<boxGeometry args={[0.5, 1, 0.5]} />
		// 	<meshStandardMaterial color={'orange'} />
		// </mesh>
		<primitive object={model.scene} ref={targetRef} scale={0.01} />
	);
}
