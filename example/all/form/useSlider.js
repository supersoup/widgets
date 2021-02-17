define([
	'jquery',
	'slider'
], function (
	$,
	Slider
) {
	return function () {
		return new Slider({
			node: $('#form-slider-1').get(0),
			step: 2,
			max: 100,
			min: 60,
			width: '220px',
			renderTooltipText: function (value) {
				return value + '%';
			}
		});
	}
});