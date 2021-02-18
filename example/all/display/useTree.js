define([
	'jquery',
	'tree',
	'../treeData'
], function (
	$,
	Tree,
	treeData
) {
	return function () {
		new Tree({
			node: $('#display-tree-1').get(0),
			data: $.extend(true, [], treeData),
			valueKey: 'id'
		});

		new Tree({
			node: $('#display-tree-2').get(0),
			data: $.extend(true, [], treeData),
			valueKey: 'id',
			type: 'select'
		});

		new Tree({
			node: $('#display-tree-3').get(0),
			data: $.extend(true, [], treeData),
			valueKey: 'id',
			type: 'checkbox'
		});

		new Tree({
			node: $('#display-tree-4').get(0),
			data: $.extend(true, [], treeData),
			valueKey: 'id',
			type: 'custom',
			itemRender: function (item, level) {
				var map = {
					0: '省份：',
					1: '城市：',
					2: '区县：'
				};

				//每个 item 都有一个 wdTreeKey，可以通过 tree.itemMap[wdTreeKey] 来获取 item 的信息
				return '<a class="wd-link" data-map-key="' + item.wdTreeKey + '">' + map[level] + item.id + '-' + item.title + '</a>';
			}
		});

	}
});