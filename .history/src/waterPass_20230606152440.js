import {
	Mesh,
	OrthographicCamera,
	PlaneBufferGeometry,
	Scene,
	ShaderMaterial,
	UniformsUtils,
	Vector2,
} from 'three'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'
import vertex from '/@/shaders/waterVertex.glsl'
import fragment from '/@/shaders/waterFragment.glsl'
const WaterShader = {
	uniforms: {
		byp: { value: 0 },
		tex: { type: 't', value: null },
		time: { type: 'f', value: 0.0 },
		factor: { type: 'f', value: 1.5 },
		resolution: { type: 'v2', value: new Vector2(500, 500) },
	},
	vertexShader: vertex,
	fragmentShader: fragment,
}

class WaterPass extends Pass {
	constructor(dt_size) {
		super()
		if (WaterShader === undefined)
			console.error('THREE.WaterPass relies on THREE.WaterShader')
		const shader = WaterShader
		this.uniforms = UniformsUtils.clone(shader.uniforms)
		// dt_size = 6
		this.uniforms['resolution'].value = new Vector2(dt_size, dt_size)
		// this.uniforms['resolution'].value = new Vector2(20000, 20000)
		this.material = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
		})
		this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
		this.scene = new Scene()
		this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null)
		this.quad.frustumCulled = false // Avoid getting clipped
		this.scene.add(this.quad)
		this.factor = 0
		this.time = 0
	}

	render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
		// const factor = Math.max(0, this.factor)
		// this.uniforms['byp'].value = factor ? 0 : 1
		this.uniforms['bvp'].value = 3
		this.uniforms['tex'].value = readBuffer.texture
		this.uniforms['time'].value = this.time
		this.uniforms['factor'].value = this.factor
		this.time += 0.05
		this.quad.material = this.material

		// Update the size of the render target to match the renderer
		let size = new Vector2()
		renderer.getDrawingBufferSize(size)
		readBuffer.setSize(size.x, size.y)

		if (this.renderToScreen) {
			renderer.setRenderTarget(null)
			renderer.render(this.scene, this.camera)
		} else {
			renderer.setRenderTarget(writeBuffer)
			if (this.clear) renderer.clear()
			renderer.render(this.scene, this.camera)
		}
	}

	// render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
	// 	const factor = Math.max(0, this.factor)
	// 	this.uniforms['byp'].value = factor ? 0 : 1
	// 	this.uniforms['tex'].value = readBuffer.texture
	// 	this.uniforms['time'].value = this.time
	// 	this.uniforms['factor'].value = this.factor
	// 	this.time += 0.05
	// 	this.quad.material = this.material
	// 	if (this.renderToScreen) {
	// 		renderer.setRenderTarget(null)
	// 		renderer.render(this.scene, this.camera)
	// 	} else {
	// 		renderer.setRenderTarget(writeBuffer)
	// 		if (this.clear) renderer.clear()
	// 		renderer.render(this.scene, this.camera)
	// 	}
	// }
}

export { WaterPass }
