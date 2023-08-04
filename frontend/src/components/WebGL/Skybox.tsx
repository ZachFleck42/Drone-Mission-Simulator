import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import rt from '../../assets/textures/skybox/arid2_rt.jpg';
import lf from '../../assets/textures/skybox/arid2_lf.jpg';
import up from '../../assets/textures/skybox/arid2_up.jpg';
import dn from '../../assets/textures/skybox/arid2_dn.jpg';
import bk from '../../assets/textures/skybox/arid2_bk.jpg';
import ft from '../../assets/textures/skybox/arid2_ft.jpg';

const cubeTextureLoader = new THREE.CubeTextureLoader();
const skyBoxTexture = cubeTextureLoader.load([rt, lf, up, dn, bk, ft]);

export default function SkyBox() {
	const { scene } = useThree();
	scene.background = skyBoxTexture;
	return null;
}
