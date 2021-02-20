define([
	'jquery',
	'chooser'
], function (
	$,
	Chooser
) {
	return function () {
		var chooser1 = new Chooser({
			node: $('#manipulate-chooser-1').get(0),
			list: [
				{value: 'a', text: '选项1'},
				{value: 'b', text: '选项2'},
				{value: 'c', text: '选项3'}
			],
		});

		chooser1.setCurrentIndex(2, true);
	}
});