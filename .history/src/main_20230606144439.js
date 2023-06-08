import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import addLight from './lights'
import { addMeshes, addShader, addFloor, addIntro } from './addMeshes'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
import { addBlotter } from './addBlotter'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js'
import { WaterPass } from './waterPass'

let renderer, scene
renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.toneMapping = THREE.ACESFilmicToneMapping
scene = new THREE.Scene()
const composer = new EffectComposer(renderer)

const meshes = {}
const lights = {}

init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	document.body.appendChild(renderer.domElement)
	meshes.default = addMeshes()
	meshes.shader = addShader()
	meshes.intro = addIntro()
	lights.default = addLight()
	meshes.floor = addFloor()
	scene.add(meshes.default)
	scene.add(meshes.intro)
	scene.add(meshes.shader)
	scene.add(meshes.floor)
	scene.add(lights.default[0])
	scene.add(lights.default[1])
	// scene.add(lights.default[2])
	addBlotter('J', 0.25, Math.random() * 4 - 2)
	addBlotter('O', 0.2, Math.random() * 4 - 2)
	addBlotter('R', 0.37, Math.random() * 4 - 2)
	addBlotter('D', 0.22, Math.random() * 4 - 2)
	addBlotter('I', 0.34, Math.random() * 4 - 2)
	addBlotter('E', 0.4, Math.random() * 4 - 2)
	// addSpline(scene)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	initPost()
	animate()
	// window.addEventListener('click', () => {
	// 	camera.position.z--
	// })
}

function initPost() {
	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const glitchPass = new GlitchPass()
	composer.addPass(glitchPass)

	// const waterpass = new WaterPass()
	// waterpass.factor = 1.5
	// composer.addPass(waterpass)
}

function animate() {
	requestAnimationFrame(animate)
	meshes.shader.material.uniforms.uTime.value += 0.1
	meshes.intro.material.uniforms.uTime.value += 0.03
	meshes.shader.material.uniforms.displacementStrength.value =
		PARAMS.displacementStrength
	// meshes.shader.rotation.y -= 0.01
	// meshes.shader.rotation.z += 0.01
	// console.log(camera.position)
	// console.log(lights.default[3])
	// lights.default[3].position = camera.position.clone()
	lights.default[1].position.z = camera.position.z - 3.5
	// lights.default[2].position.set(camera.position)
	// lights.default[3].position.set(camera.position)
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
	// renderer.render(scene, camera)
	composer.render()
}
