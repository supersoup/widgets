define([
	'jquery',
	'tree',
	'dialog',
	'util/renderEjs',
	'../treeData',
	'text!./customTree.ejs'
], function (
	$,
	Tree,
	dialog,
	renderEjs,
	treeData,
	customTreeHTML
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

		var $tree4 = $('#display-tree-4');

		var tree4 = new Tree({
			node: $tree4.get(0),
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
				return renderEjs(customTreeHTML, {
					item: item,
					level: level,
					map: map
				});
			}
		});

		$tree4.on('click', '.js-display-custom-tree-item', function (event) {
			var $link = $(this);
			var wdTreeKey = $link.attr('data-map-key');
			var item = tree4.itemMap[wdTreeKey];

			dialog.open({
				node: this,
				content: '<table class="wd-table" style="font-size: 13px;"><tr><th>人口（万）</th><td>' +
					item.people +
					'</td></tr><tr><th>GDP（亿元）</th><td>' +
					item.gdp +
					'</td></tr><tr><th>面积（平方公里）</th><td>' +
					item.area +
					'</td></tr></table>'
			})
		})



	}
});