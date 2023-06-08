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

studio.initialize()
/* ... */
const project = getProject('THREE.js x Theatre.js')
const sheet = project.sheet('Animated scene')
// Create a Theatre.js object with the props you want to
// animate
const torusKnotObj = sheet.object('Torus Knot', {
	// Note that the rotation is in radians
	// (full rotation: 2 * Math.PI)
	rotation: types.compound({
		x: types.number(mesh.rotation.x, { range: [-2, 2] }),
		y: types.number(mesh.rotation.y, { range: [-2, 2] }),
		z: types.number(mesh.rotation.z, { range: [-2, 2] }),
	}),
})

init()
function init() {
	document.body.appendChild(renderer.domElement)
	meshes.default = addMeshes()
	meshes.intro = addIntro()
	meshes._1 = matCapTest('/1.jpg', [-2, 0, 0])
	meshes._2 = matCapTest('/2.jpg', [-1, 0, 0])
	meshes._3 = matCapTest('/3.jpg', [0, 0, 0])
	meshes._4 = matCapTest('/4.jpg', [1, 0, 0])
	meshes._5 = matCapTest('/5.jpg', [2, 0, 0])
	meshes._6 = wImage('/6.jpg', [3, 0, 0])
	meshes._7 = wImage('/7.jpg', [-2, 1, 0])
	meshes._8 = matCapTest('/8.jpg', [-2, 1, 0])
	meshes._9 = matCapTest('/9.jpg', [-1, 1, 0])
	lights.default = addLight()
	scene.add(meshes._1)
	scene.add(meshes._2)
	scene.add(meshes._3)
	scene.add(meshes._4)
	scene.add(meshes._5)
	scene.add(meshes._6)
	scene.add(meshes._7)
	scene.add(meshes._8)
	scene.add(meshes._9)
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
	initAnimation()
	initPost()
	animate()
	// window.addEventListener('click', () => {
	// 	waterpass.material.uniforms.byp.value = 2
	// 	bloomPass.strength = 0.2
	// })
}

function initAnimation() {
	torusKnotObj.onValuesChange((values) => {
		const { x, y, z } = values.rotation

		mesh.rotation.set(x * Math.PI, y * Math.PI, z * Math.PI)
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
	meshes._1.material.uniforms.uTime.value += 0.1
	meshes._2.material.uniforms.uTime.value += 0.1
	meshes._3.material.uniforms.uTime.value += 0.1
	meshes._4.material.uniforms.uTime.value += 0.1
	meshes._5.material.uniforms.uTime.value += 0.1
	meshes._6.material.uniforms.uTime.value += 0.1
	if (meshes._1.material.uniforms.u_EffectProgress.value < 2) {
		meshes._1.material.uniforms.u_EffectProgress.value += 0.01
		meshes._2.material.uniforms.u_EffectProgress.value += 0.01
		meshes._3.material.uniforms.u_EffectProgress.value += 0.01
		meshes._4.material.uniforms.u_EffectProgress.value += 0.01
		meshes._5.material.uniforms.u_EffectProgress.value += 0.01
		meshes._6.material.uniforms.u_EffectProgress.value += 0.01
	}
	meshes.intro.material.uniforms.uTime.value += 0.03
	lights.default[1].position.z = camera.position.z - 3.5
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
}
