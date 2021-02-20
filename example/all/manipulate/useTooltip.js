define([
	'jquery',
	'tooltip'
], function (
	$,
	tooltip
) {
	return function () {
		tooltip.init('.manipulate-tooltip-1', 200);
	}
});