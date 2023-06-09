// var material = new Blotter.LiquidDistortMaterial()

export function addBlotter(texter, uSpeed) {
	var text = new Blotter.Text(texter, {
		family: "'EB Garamond', serif",
		size: 100,
		fill: '#FFF',
		paddingLeft: 40,
		paddingRight: 40,
	})

	var material = new Blotter.LiquidDistortMaterial()

	// Play with the value for uSpeed. Lower values slow
	// down animation, while higher values speed it up. At
	// a speed of 0.0, animation is stopped entirely.
	material.uniforms.uSpeed.value = uSpeed

	// Try uncommenting the following line to play with
	// the "volatility" of the effect. Higher values here will
	// produce more dramatic changes in the appearance of your
	// text as it animates, but you will likely want to keep
	// the value below 1.0.
	//material.uniforms.uVolatility.value = 0.30;

	var blotter = new Blotter(material, {
		texts: text,
	})

	console.log(texter)
	var elem = document.getElementById(texter)
	var scope = blotter.forText(text)

	scope.appendTo(elem)
}
