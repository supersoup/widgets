define([
	'jquery',
	'underscore',
	'./init/init',
	'./form/form',
	'./display/display',
	'./manipulate/manipulate',
], function (
	$,
	_,
	init,
	form,
	display,
	manipulate
) {
	init();
	form();
	display();
	manipulate();
});