define([
	'jquery',
	'checkboxes'
], function (
	$,
	Checkboxes
) {
	return function () {
		return new Checkboxes({
			node: $('#form-checkboxes-1').get(0),
			hasAll: true,
			list: [
				{text: '苹果', value: 'apple'},
				{text: '香蕉', value: 'banana'},
				{text: '桔子', value: 'orange'}
			]
		})
	}
});