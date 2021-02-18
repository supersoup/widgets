define([
	'jquery',
	'mock',
	'table',
	'pager'
], function (
	$,
	Mock,
	Table,
	Pager
) {
	return function () {

		var columns = [
			{title: 'id', dataIndex: 'id', width: 80, fixed: 'left'},
			{title: '姓名', dataIndex: 'name', width: 120, fixed: 'left'},
			{title: '年龄', dataIndex: 'age', width: 80, sorter: true},
			{title: '余额', dataIndex: 'money', width: 100, sorter: true},
			{title: '证件号码', dataIndex: 'number', width: 200},
			{title: '邮箱', dataIndex: 'email', width: 250},
			{title: 'ip地址', dataIndex: 'ip', width: 200},
			{title: '省份', dataIndex: 'province', width: 150},
			{title: '创建时间', dataIndex: 'create', width: 220},
			{title: '修改时间', dataIndex: 'update', width: 220},
			{title: '提交时间', dataIndex: 'submit', width: 220},
			{title: '宣言', dataIndex: 'say', width: 260},
			{title: '操作', dataIndex: 'id', width: 140, fixed: 'right',
				render: function (item, value) {
					return '<a class="wd-link" title="修改' +
						item.name +
						'的信息">修改</a> ' +
						'<a class="wd-link" title="删除' +
						item.name +
						'的信息">删除</a>';
				}
			},
		];



		var table = new Table({
			node: $('#display-table').get(0),
			checkboxDataIndex: 'id',
			sortTypeList: ['desc', 'asc', ''],
			hasColBorder: true,
			columns: columns
		});

		var pager = new Pager({
			node: $('#display-page-1').get(0),
			eachNumber: 10,
			eachNumberChangeable: true,
			goToPageable: true,
			callback: function (page, eachNumber) {
				var arrItem = [{
					id: '@increment',
					name: '@cname(2, 4)',
					age: '@integer(18, 60)',
					number: /[0-9]{18}/,
					email: '@email',
					ip: '@ip',
					province: '@province',
					create: '@datetime("yyyy-MM-dd HH:mm:ss")',
					update: '@datetime("yyyy-MM-dd HH:mm:ss")',
					submit: '@datetime("yyyy-MM-dd HH:mm:ss")',
					say: '@cparagraph(1)',
					money: '@integer(1000, 100000)'
				}];
				var mockObj = {};
				mockObj['array|' + eachNumber] = arrItem;
				var data = Mock.mock(mockObj);

				table.setDataSource(data.array);
			}
		});
		pager.setCount(400);
		pager.setPage(1);



	}
});