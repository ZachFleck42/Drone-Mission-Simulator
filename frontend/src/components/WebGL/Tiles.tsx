interface TileProps {
	tiles: [number, number][];
	visible: boolean;
}

export function VisibleTiles({ visible, ...props }: TileProps) {
	return (
		<group name="visible-tiles" visible={visible}>
			{props.tiles.map((tile, index) => {
				const [x, y] = tile;
				const tilePosition: any = [x, 0.15, -y];
				return (
					<mesh
						key={`visible-tile-${index}`}
						position={tilePosition}
						receiveShadow>
						<boxGeometry args={[1, 0.0001, 1]} />
						<meshStandardMaterial color={'green'} transparent opacity={0.2} />
					</mesh>
				);
			})}
		</group>
	);
}

export function PathTiles({ visible, ...props }: TileProps) {
	return (
		<group name="path-tiles" visible={visible}>
			{props.tiles.map((tile, index) => {
				const [x, y] = tile;
				const tilePosition: any = [x, 0.25, -y];
				return (
					<mesh
						key={`path-tile-${index}`}
						position={tilePosition}
						receiveShadow>
						<boxGeometry args={[1, 0.0001, 1]} />
						<meshStandardMaterial color={'blue'} transparent opacity={0.2} />
					</mesh>
				);
			})}
		</group>
	);
}

export function UnknownTiles({ visible, ...props }: TileProps) {
	return (
		<group name="unknown-tiles" visible={visible}>
			{props.tiles.map((tile, index) => {
				const [x, y] = tile;
				const tilePosition: any = [x, 0.2, -y];
				return (
					<mesh
						key={`unknown-tile-${index}`}
						position={tilePosition}
						receiveShadow>
						<boxGeometry args={[1, 0.0001, 1]} />
						<meshStandardMaterial color={'yellow'} transparent opacity={0.2} />
					</mesh>
				);
			})}
		</group>
	);
}
