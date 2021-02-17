define([
	'jquery',
	'mock',
	'tabs',
	'./useTable',
	'./useTreeTable'
], function (
	$,
	mock,
	Tabs,
	useTable,
	useTreeTable,
) {
	return function () {
		var tabs = new Tabs({
			list: [{
				tab: $('#tab1').get(0),
				pane: $('#tabPane1').get(0),
				onEntry: function (isFirst) {
					if (isFirst) {
						useTable();
					}
				}
			}, {
				tab: $('#tab2').get(0),
				pane: $('#tabPane2').get(0),
				onEntry: function (isFirst) {
					if (isFirst) {
						useTreeTable();
					}
				}
			}],
			currentClassName: 'tab-item-current'
		});

		tabs.setCurrentIndex(0);
	}
});