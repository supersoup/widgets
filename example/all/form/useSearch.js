define([
	'jquery',
	'underscore',
	'search'
], function (
	$,
	_,
	Search
) {
	return function () {
		var search = new Search({
			node: $('#form-search-1').get(0),
			placeholder: '请选择',
			onSearch: function (value) {
				setTimeout(function () {
					search.setOptions(createArray(value, 30))
				}, 300)
			}
		});

		return search;
	};

	function createArray(value, num) {
		var list = [];

		for (var i = 0; i < num; i ++) {
			list.push({
				text: value + i,
				value: value + i
			})
		}

		return list;
	}

});