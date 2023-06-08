import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import addLight from './lights'
import {
	addMeshes,
	addShader,
	addFloor,
	addIntro,
	matCapTest,
	wImage,
} from './addMeshes'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
import { addBlotter } from './addBlotter'
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import {
	EffectPass,
	SelectiveBloomEffect,
	BloomEffect,
	EffectComposer,
	RenderPass,
	Selection,
	BlendFunction,
} from 'postprocessing'
import { WaterPass } from './waterPass'
const params = {
	threshold: 0,
	strength: 1.5,
	radius: 0,
	exposure: 1,
}

let selectedObjects = new Selection()
let renderer, scene
renderer = new THREE.WebGLRenderer({
	alpha: false,
	powerPreference: 'high-performance',
	antialias: false,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize(sizes.width, sizes.height)
scene = new THREE.Scene()
const composer = new EffectComposer(renderer, {
	frameBufferType: THREE.HalfFloatType,
})
const waterpass = new WaterPass()

const meshes = {}
const lights = {}

init()
function init() {
	document.body.appendChild(renderer.domElement)
	meshes.default = addMeshes()
	meshes.shader = addShader('/6.jpg', [2, 0, 0])
	meshes.intro = addIntro()
	meshes.mat = matCapTest('/1.jpg', [1, 0, 0])
	meshes.mat = matCapTest('/2.jpg', [1, 0, 0])
	meshes.mat = matCapTest('/3.jpg', [1, 0, 0])
	meshes.mat = matCapTest('/4.jpg', [1, 0, 0])
	meshes.mat = matCapTest('/1.jpg', [1, 0, 0])
	meshes.mat = matCapTest('/1.jpg', [1, 0, 0])
	meshes.mat = matCapTest('/1.jpg', [1, 0, 0])
	lights.default = addLight()
	scene.add(meshes.mat)
	scene.add(meshes.default)
	scene.add(meshes.intro)
	scene.add(meshes.shader)
	scene.add(lights.default[0])
	scene.add(lights.default[1])
	addBlotter('J', 0.25, Math.random() * 4 - 2)
	addBlotter('O', 0.2, Math.random() * 4 - 2)
	addBlotter('R', 0.37, Math.random() * 4 - 2)
	addBlotter('D', 0.22, Math.random() * 4 - 2)
	addBlotter('I', 0.34, Math.random() * 4 - 2)
	addBlotter('E', 0.4, Math.random() * 4 - 2)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	initPost()
	animate()
	// window.addEventListener('click', () => {
	// 	waterpass.material.uniforms.byp.value = 2
	// 	bloomPass.strength = 0.2
	// })
}

function initPost() {
	const renderPass = new RenderPass(scene, camera)
	// composer.addPass(new RenderPass(scene, camera));

	composer.addPass(renderPass)
	const selectiveBloom = new SelectiveBloomEffect(scene, camera, {
		luminanceThreshold: 0.0001,
		radius: 0.594,
		blendFunction: BlendFunction.ADD,
		// luminanceSmoothing: 0.3,
		luminanceSmoothing: 0.577,
		intensity: 1.0,
	})
	selectedObjects.add(meshes.intro)
	selectiveBloom.selection = selectedObjects
	composer.addPass(new EffectPass(camera, selectiveBloom))
}

function animate() {
	requestAnimationFrame(animate)
	composer.render()
	meshes.shader.material.uniforms.uTime.value += 0.1
	meshes.mat.material.uniforms.uTime.value += 0.1
	if (meshes.mat.material.uniforms.u_EffectProgress.value < 2) {
		meshes.mat.material.uniforms.u_EffectProgress.value += 0.01
	}
	meshes.intro.material.uniforms.uTime.value += 0.03
	meshes.mat.material.uniforms.uTime.value += 0.1
	meshes.shader.material.uniforms.displacementStrength.value =
		PARAMS.displacementStrength
	lights.default[1].position.z = camera.position.z - 3.5
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
}
