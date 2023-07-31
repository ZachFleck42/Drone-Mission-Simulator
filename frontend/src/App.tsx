import './App.css';
import { useState, useRef } from 'react';
import { Simulation } from './types/Simulation';
import RunSimulation from './components/RunSimulation';
import GridDisplay from './components/GridDisplay';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const API = 'http://127.0.0.1:8080/sim';

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

function App() {
	const [apiData, setApiData] = useState<Simulation>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const handleServerResponse = (responseData: Simulation) => {
		console.log('Response data from SimulationParams:', responseData);
		setApiData(responseData);
		setCurrentFrameIndex(0);
		setIsPlaying(false);
	};

	return (
		<div className="App">
			<RunSimulation api={API} onServerResponse={handleServerResponse} />
			{apiData.length > 0 ? (
				<GridDisplay
					data={apiData}
					currentFrameIndex={currentFrameIndex}
					setCurrentFrameIndex={setCurrentFrameIndex}
					isPlaying={isPlaying}
					setIsPlaying={setIsPlaying}
				/>
			) : (
				<div style={{ marginTop: '100px' }}>Waiting for simulation data...</div>
			)}
			<div>
				<Canvas>
					<OrbitControls />
					<ambientLight />
					<axesHelper />
					<pointLight position={[10, 10, 10]} />
					<Box position={[-1.2, 0, 0]} />
					<Box position={[1.2, 0, 0]} />
				</Canvas>
			</div>
		</div>
	);
}

export default App;
