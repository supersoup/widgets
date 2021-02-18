define([
	'jquery',
	'mock',
	'list',
	'checkboxAll',
	'pager',
	'util/renderEjs',
	'text!./list1.ejs',
	'text!./list2.ejs',
	'text!./list3.ejs'
], function (
	$,
	Mock,
	List,
	CheckboxAll,
	Pager,
	renderEjs,
	list1HTML,
	list2HTML,
	list3HTML
) {
	return function () {

		var list1 = new List({
			node: $('#display-list-1').get(0),
			render: function (item) {
				return renderEjs(list1HTML, item);
			}
		});

		var list2 = new List({
			node: $('#display-list-2').get(0),
			render: function (item) {
				return renderEjs(list2HTML, item);
			}
		});

		var list3 = new List({
			node: $('#display-list-3').get(0),
			render: function (item) {
				return renderEjs(list3HTML, item);
			}
		});

		var checkboxAll = new CheckboxAll({
			//全选框元素
			checkbox: $('#display-list-3-all').get(0),
			//要管理的 checkbox 具有的类，必须和其他无关元素区分开
			findClassName: 'js-display-list-checkbox-item',
		});

		var pager = new Pager({
			node: $('#display-page-2').get(0),
			eachNumber: 5,
			countShow: false,
			callback: function (page) {
				var data = Mock.mock({
					'array1|5': [{
						id: '@increment',
						author: '@cname(2, 4)',
						time: '@datetime("yyyy-MM-dd HH:mm:ss")',
						title: '@ctitle(10, 20)',
						text: '@cparagraph(3, 5)',
						color: '@color'
					}],
					'array2|5': [{
						title: '@ctitle(8, 16)',
						income1: '@float(-20, 30, 2, 2)',
						income2: '@float(-20, 30, 2, 2)',
						income3: '@float(-20, 30, 2, 2)',
						income4: '@float(-20, 30, 2, 2)',
						income5: '@float(-20, 30, 2, 2)',
						income6: '@float(-20, 30, 2, 2)',
					}],
					'array3|10': [{
						id: '@increment',
						title: '@ctitle(8, 16)',
						time: '@datetime("yyyy-MM-dd HH:mm:ss")',
					}]
				});

				list1.setDataSource(data.array1);
				list2.setDataSource(data.array2);
				list3.setDataSource(data.array3);

				checkboxAll.reset();
			}
		});
		pager.setCount(1000);
		pager.setPage(1);


	}
});