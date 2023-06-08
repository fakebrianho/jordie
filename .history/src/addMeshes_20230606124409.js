import {
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	ShaderMaterial,
	Vector2,
	Vector4,
	DoubleSide,
	PlaneGeometry,
} from 'three'
import { TextureLoader } from 'three'
import vertexShader from '/@/shaders/vertex.glsl'
import imageShader from '/@/shaders/pageVertex.glsl'
import fragmentShader from '/@/shaders/fragment.glsl'
import SplineLoader from '@splinetool/loader'

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

export const addShader = () => {
	const t = new TextureLoader().load('6.jpg')
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
	mesh.position.set(2, 0, 0)
	return mesh
}

export const addSpline = () => {
	//
}
