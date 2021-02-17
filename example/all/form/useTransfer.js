define([
	'jquery',
	'transfer'
], function (
	$,
	Transfer
) {
	return function () {
		var list1 = [{
			text: 'aaa',
			value: '1'
		}, {
			text: 'bbb',
			value: '2'
		}, {
			text: 'ccc',
			value: '3'
		}, {
			text: 'ddd',
			value: '4'
		}, {
			text: 'eee',
			value: '5'
		}, {
			text: 'fff',
			value: '6'
		}];

		var list2 = [{
			text: 'eee',
			value: '5'
		}, {
			text: 'ggg',
			value: '7'
		}];

		var transfer = new Transfer({
			wrap: $('#form-transfer-1').get(0),
			list: list1,
			valueList: list2
		});

		console.log(transfer);
	}
});