import * as THREE from 'three';
import { MeshProps } from '@react-three/fiber';
import { Environment } from '../../types/Simulation';
import dirt from '../../assets/textures/dirt.jpg';

const textureLoader = new THREE.TextureLoader();
const dirtTexture = textureLoader.load(dirt);

interface GroundMeshProps extends MeshProps {
	size: number;
}

export function GroundMesh({ size, ...props }: GroundMeshProps) {
	return (
		<mesh position={props.position} receiveShadow>
			<boxGeometry args={[size, 0.1, size]} />
			<meshStandardMaterial map={dirtTexture} />
		</mesh>
	);
}

interface TerrainTileProps extends MeshProps {
	environment: Environment;
	visible: boolean;
}

export function TerrainTiles({ environment, visible }: TerrainTileProps) {
	const { terrain } = environment;

	return (
		<group name="tiles" rotation={[-Math.PI / 2, 0, 0]} visible={visible}>
			{terrain.grid.map((row, rowIndex) => {
				return row.map((tile, colIndex) => {
					const { x, y, hostile } = tile;
					if (hostile) {
						const position: [number, number, number] = [x, y, 0.1];
						return (
							<mesh
								receiveShadow
								key={`tile-${rowIndex}-${colIndex}`}
								position={position}>
								<boxGeometry args={[1, 1, 0.001]} />
								<meshStandardMaterial
									transparent
									opacity={0.4}
									color={'#b91c1c'}
								/>
							</mesh>
						);
					} else {
						return null;
					}
				});
			})}
		</group>
	);
}
