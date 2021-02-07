/**
 * @file pager
 * @author Tang Chao
 */


define([
	'text!./pager.ejs',
	'jquery',
	'ejs'
], function (
	html,
	$
) {
	
	var CLASS_BUTTON = 'wd-pager-button';
	var CLASS_GO = 'wd-pager-go-button';
	var CLASS_WHICH = 'wd-pager-which';
	var CLASS_NUMBER = 'wd-pager-each-number';
	
	/**
	 * Pager
	 * @param options.node 元素
	 * @param options.eachNumber 每页条数
	 * @param options.eachNumberChangeable 是否可切换每页显示, 默认 false
	 * @param options.goToPageable 是否可跳转第几页， 默认 false
	 * @param options.countShow 是否显示总数， 默认 true
	 * @param options.eachNumber 每页条数
	 * @param options.callback(page, eachNumber) 改变页码、每页条数之后的回调
	 * @constructor
	 * @function setPage(number) 代码控制跳转到第几页
	 * @function setCount(number) 更新总条数
	 */
	function Pager(options) {
		var node = options.node;

		if (!options.node || node.nodeType !== 1) {
			throw Error('请设置 node');
		}
		
		this.className = options.className;
		this.eachNumberChangeable = !!options.eachNumberChangeable;
		this.goToPageable = !!options.goToPageable;
		this.countShow = options.countShow === undefined ? true : options.countShow;
		this.getData = options.callback || $.noop;
		this.eachNumber = options.eachNumber || 10;
		this.current = 1;
		this.count = 0;
		
		this.totalPage = 0;
		
		this.pageWhich = '';

		this.$node = $(node);

		
		this._init();
	}

	$.extend(Pager.prototype, {
		_init: function () {
			var that = this;
			var $pager = this.$node;
			$pager.addClass(this.className);

			$pager
				.on('click', '.' + CLASS_BUTTON, function (event) {
					event.preventDefault();

					var $target = $(event.target);
					var pageStr = $target.attr('data-value');
					pageStr = $.trim(pageStr);
					that.setPage(pageStr);
				})
				.on('click', '.' + CLASS_GO, function (event) {
					event.preventDefault();

					var pageStr = that.$node.find('.' + CLASS_WHICH).val();
					that.pageWhich = pageStr;
					pageStr = $.trim(pageStr);
					that.setPage(pageStr);
				})
				.on('change', '.' + CLASS_NUMBER, function (event) {
					event.preventDefault();

					var $target = $(event.target);
					that.eachNumber = $target.val() - 0;
					that.totalPage = Math.ceil(that.count / that.eachNumber);
					that.setPage(that.current, this.eachNumber);
				});

			this._render();
		},
		_render: function () {
			var options = {
				eachNumber: this.eachNumber,
				current: this.current,
				count: this.count,
				totalPage: this.totalPage,
				countShow: this.countShow,
				pageWhich: this.pageWhich,
				eachNumberChangeable: this.eachNumberChangeable,
				goToPageable: this.goToPageable
			};
			var str = ejs.render(html, options);

			this.$node.html(str);
		},

		_transInputToNumber: function (pageStr) {
			var number;
			var totalPage = this.totalPage;

			if (pageStr > totalPage && totalPage > 0) {
				number = totalPage;
			} else if (pageStr < 1) {
				number = 1;
			} else if (isNaN(pageStr - 0)) {
				number = 1;
			} else {
				number = pageStr - 0;
			}

			return number;
		},

		/*
		* 多个地方调用：
		* 1. 可以手动在该实例上调用，即请求第一页
		* 2. 在组件内部事件各个钩子上调用
		* 如果不设置 eachNumber，就不会覆盖组建当前 eachNumber
		* */
		setPage: function (page, eachNumber) {
			var eachNum = eachNumber || this.eachNumber;
			
			this.eachNumber = eachNum;
			this.current = this._transInputToNumber(page);
			
			this._render();
			this.getData(this.current, eachNum);
		},

		setCount: function (count) {
			this.count = count;
			this.totalPage = Math.ceil(this.count / this.eachNumber);
			
			this._render();
		},

		setTotal: function (total) {
			this.totalPage = total;
			
			this._render();
		},
		
		getState: function () {
			return {
				current: this.current,
				eachNumber: this.eachNumber,
				count: this.count,
				totalPage: this.totalPage
			}
		}
	});

	return Pager;
});