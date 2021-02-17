define([
	'number'
], function (
	number
) {
	return function () {
		number.init({
			selector: '#form-number-1',
			step: 0.1,
			max: 30
		})
	}
});