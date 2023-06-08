import {
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	ShaderMaterial,
	Vector2,
	Vector4,
	DoubleSide,
	PlaneGeometry,
	MeshPhysicalMaterial,
	MeshMatcapMaterial,
	TorusKnotGeometry,
	MeshBasicMaterial,
	RepeatWrapping,
} from 'three'
import { TextureLoader } from 'three'
import vertexShader from '/@/shaders/vertex.glsl'
import imageShader from '/@/shaders/pageVertex.glsl'
import introFragment from '/@/shaders/introFragment.glsl'
import fragmentShader from '/@/shaders/fragment.glsl'
import mFragment from '/@/shaders/mFragment.glsl'
import mVertex from '/@/shaders/mVertex.glsl'
export const addMeshes = () => {
	const geometry = new BoxGeometry(1, 1, 1)
	const material = new MeshStandardMaterial({ color: 0xff0000 })
	const mesh = new Mesh(geometry, material)
	mesh.position.set(-2, 0, 0)
	return mesh
}

export const verticalImage = (url, pos) => {
	const texture = new TextureLoader().load(url)
	const geometry = new PlaneGeometry(0.9, 1.6, 50, 50)
	const material = new ShaderMaterial({
		extensions: {
			derivatives: '#extension GL_OES_standard_derivatives : enable',
		},
		uniforms: {
			uTime: { value: 0 },
			uTex: { value: texture },
			resolution: { value: new Vector4() },
			displacementStrength: { value: 0.5 },
		},
		transparent: true,
		vertexShader: imageShader,
		fragmentShader: fragmentShader,
	})
	const mesh = new Mesh(geometry, material)
	mesh.position.set(pos)
	return mesh
}

export const addShader = (url, pos) => {
	const t = new TextureLoader().load(url)
	const geometry = new PlaneGeometry(1.6, 0.9, 50, 50)
	const material = new ShaderMaterial({
		extensions: {
			derivatives: '#extension GL_OES_standard_derivatives : enable',
		},
		side: DoubleSide,
		uniforms: {
			uTime: { type: 'f', value: 0 },
			uTex: { value: t },
			resolution: { type: 'v4', value: new Vector4() },
			uvRate1: {
				value: new Vector2(1, 1),
			},
			displacementStrength: { type: 'f', value: 0.5 },
		},
		// wireframe: true,
		transparent: true,
		vertexShader: imageShader,
		fragmentShader: fragmentShader,
	})
	const mesh = new Mesh(geometry, material)
	mesh.position.set(...pos)
	return mesh
}

export const matCapTest = (textures) => {
	textures.texture.wrapS = textures.texture.wrapT = RepeatWrapping
	const geometry = new PlaneGeometry(0.9, 1.6, 50, 50)
	const MatcapSwitchMaterial = new ShaderMaterial({
		vertexShader: mVertex,
		fragmentShader: mFragment,
		transparent: false,
		side: DoubleSide,
		uniforms: {
			u_EmissionColor: {
				value: new Vector4(168 / 255, 217 / 255, 26 / 255, 1),
			},
			t_MatcapA: { value: null },
			t_MatcapB: { value: null },
			u_EffectProgress: { value: 0 },
			u_StripSize: { value: 0.1 },
			u_Texture: { value: textures.texture },
			u_MatcapA: { value: textures.m1 },
			u_MatcapB: { value: textures.m2 },
			uTime: { value: 0 },
			u_NoiseStrength: { value: 1.0 },
		},
	})
	const mesh = new Mesh(geometry, MatcapSwitchMaterial)
	return mesh
}

export const addFloor = () => {
	const loader = new TextureLoader()
	// const texture = new TextureLoader().load('/matcap.png')
	const aoMap = loader.load('/ao.jpg')
	const normalMap = loader.load('/normal.jpg')
	const roughnessMap = loader.load('/roughness.jpg')
	const displacementMap = loader.load('/height.png')
	const geometry = new PlaneGeometry(20, 80, 50, 50)
	const material = new MeshStandardMaterial({
		color: '#ffffff',
		roughness: 0.41,
		metalness: 0.65,
	})
	// const geometry = new TorusKnotGeometry(10, 3, 100, 16)
	// const material = new MeshMatcapMaterial()
	// const material = new MeshPhysicalMaterial({
	// 	// color: '#ff0000',
	// 	reflectivity: 0.69,
	// 	metalness: 0.65,
	// 	roughness: 0.41,
	// 	aoMap: aoMap,
	// 	normalMap: normalMap,
	// 	roughnessMap: roughnessMap,
	// 	displacementMap: displacementMap,
	// })
	// material.matcap = texture
	const mesh = new Mesh(geometry, material)
	mesh.rotation.x = -Math.PI / 2
	mesh.position.set(0, -1, -30)
	return mesh
}
export const addIntro = () => {
	const geometry = new PlaneGeometry(10, 5, 50, 50)
	const material = new ShaderMaterial({
		extensions: {
			derivatives: '#extension GL_OES_standard_derivatives : enable',
		},
		side: DoubleSide,
		uniforms: {
			uTime: { type: 'f', value: 0 },
			// uTex: { value: t },
			resolution: {
				type: 'v2',
				value: new Vector2(50, 50),
			},
			uvRate1: {
				value: new Vector2(1, 1),
			},
			displacementStrength: { type: 'f', value: 0.5 },
		},
		// wireframe: true,
		// transparent: true,
		vertexShader: vertexShader,
		fragmentShader: introFragment,
	})
	const mesh = new Mesh(geometry, material)
	mesh.position.set(0, 0, 4)
	return mesh
}
