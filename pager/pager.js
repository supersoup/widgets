define([
	'text!./pager.ejs',
	'jquery',
	'ejs',
	'css!./pager.css'
], function (
	html,
	$
) {

	/**
	 * Pager
	 * @param options.node
	 * @param options.eachNumber
	 * @param options.callback
	 * @constructor
	 */
	function Pager(options) {
		var node = options.node;
		var eachPage = options.eachNumber || 10;
		var callback = options.callback || $.noop;

		if (!options.node || node.nodeType !== 1) {
			throw Error('请设置 node');
		}

		this.current = 1;
		this.count = 0;
		this.countShow = true;
		this.totalPage = 0;
		this.eachNumber = eachPage;
		this.pageWhich = '';

		this.$node = $(node);

		this.getData = callback;
		this._init();
	}

	$.extend(Pager.prototype, {
		_init: function () {
			var that = this;
			var pager = this.$node;

			pager
				.on('click', '.pager-button', function (event) {
					event.preventDefault();

					var $target = $(event.target);
					var pageStr = $target.data('value');
					pageStr = $.trim(pageStr);
					that.setPage(pageStr);
				})
				.on('click', '.pager-go-button', function (event) {
					event.preventDefault();

					var pageStr = that.$node.find('.pager-which').val();
					that.pageWhich = pageStr;
					pageStr = $.trim(pageStr);
					that.setPage(pageStr);
				})
				.on('change', '.pager-each-number', function (event) {
					event.preventDefault();

					var $target = $(event.target);
					that.eachNumber = $target.val();
					that.setPage(1, this.eachNumber);
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
				pageWhich: this.pageWhich
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
			this.countShow = true;
			this._render();
		},

		setTotal: function (total) {
			this.totalPage = total;
			this.countShow = false;
			this._render();
		}
	});

	return Pager;
});