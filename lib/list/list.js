/**
 * @file list
 * @author Tang Chao
 */


define([
	'jquery',
	'underscore'
], function(
	$,
	_
) {
	/**
	 * Table
	 * @param options:
	 * @param options.node {Element} 元素
	 * @param options.columns {Array} 列定义
	 * @param options.columns[].render：{Function} 渲染函数，请返回安全的 html
	 * @constructor
	 */
	function List(options) {
		this.node = options.node;
		this.render = options.render ? options.render : $.noop;
		
		this._init();
	}
	
	$.extend(List.prototype, {
		_init: function () {
			this.$wrap = $(this.node);
			this.dataSource = [];
		},
		
		_render: function () {
			var that = this;
			var strArr = _.map(this.dataSource, function (item, index) {
				return that.render(item, index)
			});
			
			this.$wrap.html(strArr.join(''));
			
		},
		
		setDataSource: function (dataSource) {
			this.dataSource = $.extend(true, [], dataSource);
			this._render();
		},
		
		clear: function () {
			this.dataSource = [];
			this._render();
		}
	});
	
	return List;
});