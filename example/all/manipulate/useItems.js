define([
	'jquery',
	'items'
], function (
	$,
	Items
) {
	return function () {
		var items1 = new Items({
			node: $('#manipulate-items-1').get(0),
			shouldUnique: true
		});

		items1.addItem({ value: '1', text: '标签一' });
		items1.addItem({ value: '2', text: '标签二' });
		items1.addItem({ value: '3', text: '标签三' });
	}
});