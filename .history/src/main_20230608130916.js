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
	meshes.default = addMeshes()
	meshes.intro = addIntro()
	meshes[1] = matCapTest('/1.jpg', [-2, 0, 0])
	meshes[2] = matCapTest('/2.jpg', [-1, 0, 0])
	meshes[3] = matCapTest('/3.jpg', [0, 0, 0])
	meshes[4] = matCapTest('/4.jpg', [1, 0, 0])
	meshes[5] = matCapTest('/5.jpg', [2, 0, 0])
	meshes[6] = wImage('/6.jpg', [3, 0, 0])
	meshes[7] = wImage('/7.jpg', [-2, 1, 0])
	meshes[8] = matCapTest('/8.jpg', [-2, 1, 0])
	meshes[9] = matCapTest('/9.jpg', [-1, 1, 0])
	lights.default = addLight()
	scene.add(meshes[1])
	scene.add(meshes[2])
	scene.add(meshes[3])
	scene.add(meshes[4])
	scene.add(meshes[5])
	scene.add(meshes[6])
	scene.add(meshes[7])
	scene.add(meshes[8])
	scene.add(meshes[9])
	scene.add(meshes.default)
	scene.add(meshes.intro)
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
	for (let i = 0; i < Object.keys(meshes).length - 3; i++) {
		initAnimation(i + 1)
	}
}

function initAnimation(index) {
	sheet.sequence.attachAudio({ source: '/jordan.mp3' }).then(() => {
		console.log('Audio loaded!')
	})
	// let mesh = new THREE.Mesh(
	// 	new THREE.BoxGeometry(1, 1),
	// 	new THREE.MeshBasicMaterial()
	// )
	console.log(index)
	console.log(meshes[index])
	theatreObjects[index] = sheet.object(`${index}`, {
		// Note that the rotation is in radians
		// (full rotation: 2 * Math.PI)
		position: types.compound({
			x: types.number(meshes[index].position.x, { range: [-2, 2] }),
			y: types.number(meshes[index].position.y, { range: [-2, 2] }),
			z: types.number(meshes[index].position.z, { range: [-2, 2] }),
		}),
	})
	theatreObjects[index].onValuesChange((values) => {
		const { x, y, z } = values.position

		meshes[index].rotation.set(x, y, z)
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
	selectedObjects.add(meshes.intro)
	selectiveBloom.selection = selectedObjects
	composer.addPass(new EffectPass(camera, selectiveBloom))
}

function animate() {
	requestAnimationFrame(animate)
	composer.render()
	// meshes.shader.material.uniforms.uTime.value += 0.1
	meshes[1].material.uniforms.uTime.value += 0.1
	meshes[2].material.uniforms.uTime.value += 0.1
	meshes[3].material.uniforms.uTime.value += 0.1
	meshes[4].material.uniforms.uTime.value += 0.1
	meshes[5].material.uniforms.uTime.value += 0.1
	meshes[6].material.uniforms.uTime.value += 0.1
	if (meshes[1].material.uniforms.u_EffectProgress.value < 2) {
		meshes[1].material.uniforms.u_EffectProgress.value += 0.01
		meshes[2].material.uniforms.u_EffectProgress.value += 0.01
		meshes[3].material.uniforms.u_EffectProgress.value += 0.01
		meshes[4].material.uniforms.u_EffectProgress.value += 0.01
		meshes[5].material.uniforms.u_EffectProgress.value += 0.01
		meshes[6].material.uniforms.u_EffectProgress.value += 0.01
	}
	meshes.intro.material.uniforms.uTime.value += 0.03
	lights.default[1].position.z = camera.position.z - 3.5
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
}
