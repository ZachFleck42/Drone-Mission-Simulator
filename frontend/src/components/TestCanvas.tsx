import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function ThreeCanvas() {
	const canvasRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		// Scene
		const scene = new THREE.Scene();

		// Camera
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);
		camera.position.z = 5;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		canvasRef.current.appendChild(renderer.domElement);

		// Cube
		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		// Animation
		const animate = () => {
			requestAnimationFrame(animate);

			// Rotate the cube
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render(scene, camera);
		};

		animate();

		return () => {
			// Clean up resources when the component is unmounted
			renderer.dispose();
			canvasRef.current!.removeChild(renderer.domElement);
		};
	}, []);

	return <div ref={canvasRef} />;
}

export default ThreeCanvas;
