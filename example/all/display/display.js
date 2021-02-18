define([
	'jquery',
	'mock',
	'tabs',
	'./useTable',
	'./useTreeTable',
	'./useTree',
	'./useList'
], function (
	$,
	mock,
	Tabs,
	useTable,
	useTreeTable,
	useTree,
	useList
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
			}, {
				tab: $('#tab3').get(0),
				pane: $('#tabPane3').get(0),
				onEntry: function (isFirst) {
					if (isFirst) {
						useTree();
					}
				}
			}, {
				tab: $('#tab4').get(0),
				pane: $('#tabPane4').get(0),
				onEntry: function (isFirst) {
					if (isFirst) {
						useList();
					}
				}
			}],
			currentClassName: 'tab-item-current'
		});

		tabs.setCurrentIndex(0);
	}
});