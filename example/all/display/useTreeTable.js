define([
	'jquery',
	'underscore',
	'treeTable',
	'../treeData'
], function (
	$,
	_,
	TreeTable,
	treeData
) {
	return function () {
		var columns = [
			{title: '区域名称', dataIndex: 'title'},
			{title: '编号', dataIndex: 'id'},
			{title: '人口（万）', dataIndex: 'people', sorter: true},
			{title: 'GDP（亿）', dataIndex: 'gdp', sorter: true},
			{title: '面积（平方公里）', dataIndex: 'area', sorter: true},
			{title: '操作', dataIndex: 'id',
				render: function (item, value) {
					return '<a class="wd-link">查看更多：' +
						item.title +
						'</a>'
				}
			},
		];

		var treeTable = new TreeTable({
			node: $('#display-tree-table').get(0),
			levelCount: 3,
			sortTypeList: ['desc', 'asc', ''],
			hasColBorder: true,
			columns: columns,
			fixHeight: '500px',
			onSort: function (dataIndex, sortType) {
				console.log(dataIndex, sortType);
				//使用前端排序，具体看一下 sortByFrontend 的说明
				var sortedDataSource = sortByFrontend(treeData, dataIndex, sortType);
				console.log(sortedDataSource);
				treeTable.setDataSource(sortedDataSource);
			}
		})

		treeTable.setDataSource(treeData);

		//前端排序
		function sortByFrontend(tree, dataIndex, sortType) {
			var treeClone = $.extend(true, [], tree);

			if (sortType === '') {
				return treeClone;
			}

			sort(treeClone);

			return treeClone;

			function sort(t) {
				t.sort(sortBy);

				if (sortType === 'desc') {
					t.reverse()
				}

				_.each(t, function (item) {
					if (item.children !== undefined) {
						sort(item.children);
					}
				})
			}

			function sortBy(a, b) {
				var va = a[dataIndex];
				var vb = b[dataIndex];

				va = va !== undefined ? va : 0;
				vb = vb !== undefined ? vb : 0;

				return va - vb;
			}

		}

	}
});