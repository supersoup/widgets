define([
	'navigator'
], function (
	Navigator
) {
	return function () {
		var pages = [
			{text: '综合示例', value: '/widgets/example/all/index.html'}
		];

		var navigator = new Navigator({
			node: $('#navigator').get(0),
			allList: pages,
			storeListKey: 'store-wd-navigator-list-front'
		});

		navigator.setCurrentStatus('/widgets/example/all/index.html');
	}
});