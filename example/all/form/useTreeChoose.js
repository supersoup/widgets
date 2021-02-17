define([
	'jquery',
	'treeChoose',
	'../treeData'
], function(
	$,
	TreeChoose,
	data
) {
	return function () {
		var def = $.Deferred();
		var asyncData;

		//用定时器模拟 ajax
		setTimeout(function () {
			asyncData = data;
			def.resolve();
		}, 100);

		var promise = def.promise();

		var treeChoose1 = new TreeChoose({
			node: $('#form-tree-choose-1').get(0),
			type: 'select',

			//type 为 select 时有效，明确设置为 false 时不可选择，为 undefined 或 true 均可以选择。不设置该项则都可以选择
			selectableList: [false, undefined, true],
			valueKey: 'id',
			onChange: function (value) {
				console.log(value);
			}
		});

		var treeChoose2 = new TreeChoose({
			node: $('#form-tree-choose-2').get(0),
			type: 'checkbox',
			onChange: function (value) {
				console.log(value);
			}
		});

		//树的值是向后端动态获取的，所以只能异步设置 options
		//search 的用法也应该是这样
		promise.done(function () {
			treeChoose1.setOptions(asyncData);
			treeChoose2.setOptions(asyncData);
		});
	}
});