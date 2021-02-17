define([
	'jquery',
	'mock',
	'tabs'
], function (
	$,
	mock,
	Tabs
) {
	return function () {

		var tabs = new Tabs({
			list: [{
				tab: $('#tab1').get(0),
				pane: $('#tabPane1').get(0),
				onEntry: function (isFirst) {
					if (isFirst) {

					}
				}
			}]
		})

	}
});