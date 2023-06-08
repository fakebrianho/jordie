import { AmbientLight, DirectionalLight, PointLight } from 'three'

const addLight = () => {
	let lightA = new AmbientLight(0x000000, 0.5)
	let light = new DirectionalLight(0xffffff, 1)
	let lightP = new PointLight(0xfff, 1, 100)
	// light.position.set( 50, 50, 50 );
	light.position.set(1, 1, 1)
	return [light, lightA, lightP]
}

export default addLight
