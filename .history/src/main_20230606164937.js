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
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { EffectPass, SelectiveBloomEffect } from 'postprocessing'
import { WaterPass } from './waterPass'
const params = {
	threshold: 0,
	strength: 1.5,
	radius: 0,
	exposure: 1,
}
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	1.5,
	0.4,
	0.85
)

let renderer, scene
renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.toneMapping = THREE.ACESFilmicToneMapping
scene = new THREE.Scene()
const composer = new EffectComposer(renderer)
const waterpass = new WaterPass()

const meshes = {}
const lights = {}

const selectiveBloom = new SelectiveBloomEffect(scene, camera, {
	intensity: 1.5,
	luminanceThreshold: 0.0001,
	mipmapBlur: true,
	radius: 0.35,
})

init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	document.body.appendChild(renderer.domElement)
	meshes.default = addMeshes()
	meshes.shader = addShader('/6.jpg', [2, 0, 0])
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
	window.addEventListener('click', () => {
		waterpass.material.uniforms.byp.value = 2
		bloomPass.strength = 0.2
	})
}

function setSelectionBloom() {
	// let selectedObjects = new Selection()
	selectiveBloom.selection = meshes.intro
}

function initPost() {
	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)
	waterpass.factor = 1.5
	waterpass.material.uniforms.byp.value = 0
	composer.addPass(waterpass)
	setSelectionBloom()
	bloomPass.threshold = params.threshold
	bloomPass.strength = params.strength
	bloomPass.radius = params.radius
	composer.addPass(bloomPass)
	composer.addPass(new EffectPass(camera, bloom, selectiveBloom))
}

function animate() {
	requestAnimationFrame(animate)
	meshes.shader.material.uniforms.uTime.value += 0.1
	meshes.intro.material.uniforms.uTime.value += 0.03
	meshes.shader.material.uniforms.displacementStrength.value =
		PARAMS.displacementStrength
	lights.default[1].position.z = camera.position.z - 3.5
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
	composer.render()
}
