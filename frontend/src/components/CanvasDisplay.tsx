import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, MeshProps, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Drone, Environment, Simulation } from '../types/Simulation';
import rt from '../assets/textures/skybox/arid2_rt.jpg';
import lf from '../assets/textures/skybox/arid2_lf.jpg';
import up from '../assets/textures/skybox/arid2_up.jpg';
import dn from '../assets/textures/skybox/arid2_dn.jpg';
import bk from '../assets/textures/skybox/arid2_bk.jpg';
import ft from '../assets/textures/skybox/arid2_ft.jpg';
import dirt from '../assets/textures/dirt.png';

const loader = new THREE.CubeTextureLoader();
const skyBoxTexture = loader.load([rt, lf, up, dn, bk, ft]);
const loader2 = new THREE.TextureLoader();
const dirtTextue = loader2.load(dirt);

interface TerrainBackgroundProps extends MeshProps {
	size: number;
}

function TerrainBackground({ ...props }: TerrainBackgroundProps) {
	return (
		<mesh position={props.position} receiveShadow>
			<boxGeometry args={[props.size, 0.1, props.size]} />
			<meshStandardMaterial map={dirtTextue} color={'#d0a770'} />
		</mesh>
	);
}

interface TerrainTileProps extends MeshProps {
	color: string;
	size: number;
}

function TerrainTile({ color, size, ...props }: TerrainTileProps) {
	const tileRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);

	return (
		<mesh
			{...props}
			ref={tileRef}
			receiveShadow
			onClick={(event) => console.log(tileRef.current.position)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}
			scale={[size, size, 1]}>
			<boxGeometry args={[1, 1, 0.001]} />
			<meshStandardMaterial
				color={hovered ? 'white' : color}
				transparent
				opacity={0.5}
			/>
		</mesh>
	);
}

interface GridProps {
	environment: Environment;
	tileSize: number;
}

function TerrainTiles({ environment, tileSize }: GridProps) {
	const { terrain } = environment;

	return (
		<group name="tiles" rotation={[-Math.PI / 2, 0, 0]}>
			{terrain.grid.map((row, rowIndex) => {
				return row.map((tile, colIndex) => {
					const { x, y, hostile } = tile;
					const position: [number, number, number] = [
						x * tileSize,
						y * tileSize,
						0.05,
					];
					const color = hostile ? 'red' : '#d0a770';
					return (
						<TerrainTile
							key={`tile-${rowIndex}-${colIndex}`}
							position={position}
							color={color}
							size={tileSize}
						/>
					);
				});
			})}
		</group>
	);
}

function SkyBox() {
	const { scene } = useThree();
	scene.background = skyBoxTexture;
	return null;
}

interface DroneProps extends MeshProps {
	drone: Drone;
	droneRef: React.MutableRefObject<THREE.Mesh>;
}

function DroneMesh({ drone, droneRef }: DroneProps) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const visibleTiles = drone.visible_tiles;

	useFrame((_, delta) => {
		const { x, y } = drone;
		const speed = 1.5;
		const newX = position.x + (x - position.x) * speed * delta;
		const newY = position.y + (-y - position.y) * speed * delta;
		setPosition({ x: newX, y: newY });
		droneRef.current.position.set(newX, 1.5, newY);
	});

	return (
		<group name="drone">
			<mesh castShadow ref={droneRef}>
				<sphereGeometry args={[0.25, 32, 16]} />
				<meshStandardMaterial color={'blue'} />
			</mesh>

			{visibleTiles.map((tile, index) => {
				const [x, y] = tile;
				const tilePosition: any = [x, 0.051, -y];
				return (
					<group name="drone-tiles">
						<mesh
							key={`visible-tile-${index}`}
							position={tilePosition}
							receiveShadow>
							<boxGeometry args={[1, 0.0001, 1]} />
							<meshStandardMaterial
								color={'yellow'}
								transparent
								opacity={0.5}
							/>
						</mesh>
					</group>
				);
			})}
		</group>
	);
}

interface TargetProps extends MeshProps {
	environment: Environment;
	targetRef: React.MutableRefObject<THREE.Mesh>;
}

function TargetMesh({ environment, targetRef }: TargetProps) {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useFrame((_, delta) => {
		const { x, y } = environment.target;
		const speed = 2;
		const newX = position.x + (x - position.x) * speed * delta;
		const newY = position.y + (-y - position.y) * speed * delta;
		setPosition({ x: newX, y: newY });
		targetRef.current.position.set(newX, 0.5, newY);
	});

	return (
		<mesh castShadow ref={targetRef}>
			<boxGeometry args={[0.5, 1, 0.5]} />
			<meshStandardMaterial color={'orange'} />
		</mesh>
	);
}

interface SimulationCanvasProps {
	data: Simulation;
	currentFrameIndex: number;
	setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

function SimulationCanvas(props: SimulationCanvasProps) {
	const { data, currentFrameIndex } = props;

	const grid_size = data[0].environment.terrain.size;
	const [grid_center_x, grid_center_z] = [
		(grid_size - 1) / 2,
		-(grid_size - 1) / 2,
	];
	const targetRef = useRef<THREE.Mesh>(null!);
	const droneRef = useRef<THREE.Mesh>(null!);

	return (
		<Canvas shadows>
			<PerspectiveCamera
				makeDefault
				fov={75}
				position={[grid_center_x * 3, grid_size / 2, grid_center_z]}
			/>
			<OrbitControls
				maxPolarAngle={Math.PI / 2}
				target={[grid_center_x, 0, grid_center_z]}
			/>
			<ambientLight />
			<directionalLight
				position={[grid_center_x, 20, grid_center_z]}
				intensity={1}
				color={'white'}
				castShadow
				shadow-camera-bottom={-grid_size * 2}
				shadow-camera-left={-grid_size * 2}
				shadow-camera-right={grid_size * 2}
				shadow-camera-top={grid_size * 2}
			/>
			<SkyBox />
			<TerrainBackground
				size={grid_size}
				position={[grid_center_x, 0, grid_center_z]}
			/>
			<group name="sim-objects">
				<TerrainTiles
					environment={data[currentFrameIndex].environment}
					tileSize={1}
				/>
				<TargetMesh
					targetRef={targetRef}
					environment={data[currentFrameIndex].environment}
				/>
				<DroneMesh droneRef={droneRef} drone={data[currentFrameIndex].drone} />
			</group>
		</Canvas>
	);
}

export default SimulationCanvas;
