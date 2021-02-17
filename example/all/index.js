define([
	'jquery',
	'underscore',
	'./init/init',
	'./form/form',
	'./display/display',
], function (
	$,
	_,
	init,
	form,
	display
) {
	init();
	form();
	display();
});