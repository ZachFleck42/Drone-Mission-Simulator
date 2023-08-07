import React, { useState } from 'react';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Drone } from '../../types/Simulation';
import DroneModel from '../../assets/models/drone.glb';

interface DroneProps extends MeshProps {
	drone: Drone;
	droneRef: React.MutableRefObject<THREE.Mesh>;
	showAnimation: boolean;
}

export default function DroneMesh({
	drone,
	droneRef,
	showAnimation,
}: DroneProps) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const model: any = useGLTF(DroneModel);

	useFrame((_, delta) => {
		const { x, y } = drone;

		if (showAnimation) {
			const speed = 1.8;
			const newX = position.x + (x - position.x) * speed * delta;
			const newY = position.y + (-y - position.y) * speed * delta;
			setPosition({ x: newX, y: newY });
			droneRef.current.position.set(newX, 1.5, newY);
		} else {
			droneRef.current.position.set(x, 1.5, -y);
		}
	});

	return (
		// <mesh castShadow ref={droneRef}>
		// 	<sphereGeometry args={[0.25, 32, 16]} />
		// 	<meshStandardMaterial color={'blue'} />
		// </mesh>
		<primitive object={model.scene} ref={droneRef} scale={0.5} castShadow />
	);
}
