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
import studio from '@theatre/studio'
import { getProject, types } from '@theatre/core'

import {
	EffectPass,
	SelectiveBloomEffect,
	BloomEffect,
	EffectComposer,
	RenderPass,
	Selection,
	BlendFunction,
} from 'postprocessing'

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

const meshes = {}
const lights = {}
const intro = {}
const def = {}
const theatreObjects = { 1: 'test' }
studio.initialize()
/* ... */
const project = getProject('THREE.js x Theatre.js')
const sheet = project.sheet('Animated scene')
// Create a Theatre.js object with the props you want to
// animate

init()
function init() {
	document.body.appendChild(renderer.domElement)
	// def.default = addMeshes()
	intro.intro = addIntro()
	meshes[0] = matCapTest('/1.jpg', [-1.25, 0, -2])
	meshes[1] = matCapTest('/2.jpg', [2.5, 0.5, -4.5])
	meshes[2] = matCapTest('/8.jpg', [0.75, 1.5, -8])
	meshes[3] = wImage('/7.jpg', [-1, 0, -15])
	meshes[4] = matCapTest('/11.jpg', [1, 0.25, -25])
	meshes[5] = matCapTest('/4.jpg', [-2, 0, -35])
	meshes[6] = matCapTest('/20.jpg', [-2, 1, -35])
	meshes[7] = matCapTest('/19.jpg', [0, 0, -35])
	meshes[8] = wImage('/15.jpg', [0, 0.5, -45])
	meshes[9] = matCapTest('/9.jpg', [-2.35, 0.75, -45])
	meshes[10] = wImage('/14.jpg', [2, 0, -45])
	meshes[11] = wImage('/17.jpg', [0.75, -1.75, -47])
	meshes[12] = wImage('/16.jpg', [2, 1.25, -44])
	meshes[13] = matCapTest('/21.jpg', [-2, -1.5, -44])
	meshes[14] = wImage('/6.jpg', [-2, 1.5, -43])
	meshes[15] = wImage('/18.jpg', [-2, 1.5, -43])
	meshes[16] = wImage('/10.jpg', [-2, 1.5, -43])
	meshes[17] = wImage('/10.jpg', [-2, 1.5, -43])
	lights.default = addLight()
	scene.add(meshes[0])
	scene.add(meshes[1])
	scene.add(meshes[2])
	scene.add(meshes[3])
	scene.add(meshes[4])
	scene.add(meshes[5])
	scene.add(meshes[6])
	scene.add(meshes[7])
	scene.add(meshes[8])
	scene.add(meshes[9])
	scene.add(meshes[10])
	scene.add(meshes[11])
	scene.add(meshes[12])
	scene.add(meshes[13])
	scene.add(meshes[14])
	scene.add(meshes[15])
	// scene.add(def.default)
	scene.add(intro.intro)
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
	initCameraAnimation()
	initAnimations()
	initPost()
	animate()
	// window.addEventListener('click', () => {
	// 	waterpass.material.uniforms.byp.value = 2
	// 	bloomPass.strength = 0.2
	// })
}

function initAnimations() {
	// console.log(meshes.length)
	sheet.sequence.attachAudio({ source: '/jordan.mp3' }).then(() => {
		console.log('Audio loaded!')
	})
	for (let i = 0; i < Object.keys(meshes).length; i++) {
		initAnimation(i)
	}
}

function initCameraAnimation() {
	const myCamera = sheet.object('camera', {
		position: types.compound({
			x: types.number(camera.position.x, { range: [-80, 5] }),
			y: types.number(camera.position.y, { range: [-80, 5] }),
			z: types.number(camera.position.z, { range: [-80, 5] }),
		}),
	})
	myCamera.onValuesChange((values) => {
		const { x, y, z } = values.position

		camera.position.set(x, y, z)
	})
}

function initAnimation(index) {
	// let mesh = new THREE.Mesh(
	// 	new THREE.BoxGeometry(1, 1),
	// 	new THREE.MeshBasicMaterial()
	// )
	theatreObjects[index] = sheet.object(`${index}`, {
		position: types.compound({
			x: types.number(meshes[index].position.x, { range: [-80, 10] }),
			y: types.number(meshes[index].position.y, { range: [-80, 10] }),
			z: types.number(meshes[index].position.z, { range: [-80, 10] }),
		}),
		progress: types.number(
			meshes[index].material.uniforms.u_EffectProgress.value,
			{ range: [-2, 2] }
		),
	})
	theatreObjects[index].onValuesChange((values) => {
		const { x, y, z } = values.position
		let u_EffectProgress = values.progress
		meshes[index].position.set(x, y, z)
		meshes[index].material.uniforms.u_EffectProgress.value =
			u_EffectProgress
	})
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
	selectedObjects.add(intro.intro)
	selectiveBloom.selection = selectedObjects
	composer.addPass(new EffectPass(camera, selectiveBloom))
}

function animate() {
	requestAnimationFrame(animate)
	composer.render()
	// meshes.shader.material.uniforms.uTime.value += 0.1
	meshes[0].material.uniforms.uTime.value += 0.1
	meshes[1].material.uniforms.uTime.value += 0.1
	meshes[2].material.uniforms.uTime.value += 0.1
	meshes[3].material.uniforms.uTime.value += 0.1
	meshes[4].material.uniforms.uTime.value += 0.1
	meshes[5].material.uniforms.uTime.value += 0.1
	meshes[6].material.uniforms.uTime.value += 0.1
	meshes[7].material.uniforms.uTime.value += 0.1
	meshes[8].material.uniforms.uTime.value += 0.1
	meshes[9].material.uniforms.uTime.value += 0.1
	meshes[10].material.uniforms.uTime.value += 0.1
	meshes[11].material.uniforms.uTime.value += 0.1
	meshes[12].material.uniforms.uTime.value += 0.1
	meshes[13].material.uniforms.uTime.value += 0.1
	meshes[14].material.uniforms.uTime.value += 0.1
	meshes[15].material.uniforms.uTime.value += 0.1
	// meshes[0].material.uniforms.u_EffectProgress.value = 2.0
	if (meshes[1].material.uniforms.u_EffectProgress.value < 2) {
		// meshes[0].material.uniforms.u_EffectProgress.value += 0.01
		// meshes[1].material.uniforms.u_EffectProgress.value += 0.01
		// meshes[2].material.uniforms.u_EffectProgress.value += 0.01
		// meshes[3].material.uniforms.u_EffectProgress.value += 0.01
		// meshes[4].material.uniforms.u_EffectProgress.value += 0.01
		// meshes[5].material.uniforms.u_EffectProgress.value += 0.01
		// meshes[6].material.uniforms.u_EffectProgress.value += 0.01
	}
	intro.intro.material.uniforms.uTime.value += 0.03
	lights.default[1].position.z = camera.position.z - 3.5
	// def.default.rotation.x += 0.01
	// def.default.rotation.y += 0.01
}
