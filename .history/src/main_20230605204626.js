import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import addLight from './lights'
import { addMeshes, addShader } from './addMeshes'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
import { addBlotter } from './addBlotter'
let renderer, scene
renderer = new THREE.WebGLRenderer()
scene = new THREE.Scene()

const meshes = {}
const lights = {}

init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	document.body.appendChild(renderer.domElement)
	meshes.default = addMeshes()
	meshes.shader = addShader()
	lights.default = addLight()
	scene.add(meshes.default)
	scene.add(meshes.shader)
	scene.add(lights.default)
	addBlotter('J', 0.25)
	addBlotter('O', 0.2)
	addBlotter('R', 0.37)
	addBlotter('D', 0.22)
	addBlotter('I', 0.34)
	addBlotter('E', 0.4)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	animate()
}

function animate() {
	requestAnimationFrame(animate)
	meshes.shader.material.uniforms.uTime.value += 0.1
	meshes.shader.material.uniforms.displacementStrength.value =
		PARAMS.displacementStrength
	// meshes.shader.rotation.y -= 0.01
	// meshes.shader.rotation.z += 0.01
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
	renderer.render(scene, camera)
}
