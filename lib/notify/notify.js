/**
 * @file notify
 * @author Tang Chao
 */


define([
	'text!./notify.ejs',
	'jquery',
	'util/renderEjs',
], function (
	html,
	$,
	renderEjs
) {
	var $body = $('body');
	var animateTime = 200;
	var $notifyList = $('<ul class="wd-notify-list"></ul>');

	$body.append($notifyList);
	
	/**
	 * Notify
	 * @param options:
	 * @param options.type: undefined, 'success', 'fail'
	 * @param options.content {html} 注意安全性
	 * @param options.handleList {Array} 按钮列表:
	 * @param options.handleList[].text 按钮文字
	 * @param options.handleList[].isPrimary {boolean} 主按钮，可选
	 * @param options.handleList[].callback 按钮回调，可选
	 * @constructor
	 */
	function Notify(options) {
		var defaultOptions = {
			handleList: [],
			content: ''
		};

		var opts = $.extend(true, {}, defaultOptions, options);
		var that = this;
		var $notify = this.$notify = $('<li class="wd-notify"></li>');
		var type = opts.type;
		var content = opts.content;
		var handleList = this.handleList = opts.handleList;
		var time = opts.time;

		var str = renderEjs(html, {
			content: content,
			handleList: handleList
		});

		$notify.html(str);

		var $close = $notify.find('.wd-notify-close');
		$close.one('click', function () {
			that._close();
		});

		this.hasClosed = false;

		if (type === 'success') {
			$notify.addClass('wd-notify-success');
		} else if (type === 'fail') {
			$notify.addClass('wd-notify-fail');
		}

		$notify.on('click', '.wd-notify-button', function (event) {
			that._handleFooterButtonClick(event);
		});

		$notifyList.append($notify);

		$notify
			.animate({left: 0}, animateTime, function () {
				if (time) {
					setTimeout(function () {
						if (!that.hasClosed) {
							that._close();
						}
					}, time)
				}
			});

		return this;
	}

	$.extend(Notify.prototype, {
		_close: function () {
			var that = this;

			if (!this.hasClosed) {
				this.hasClosed = true;

				this.$notify.animate({left: 400 + 'px'}, animateTime, function () {
					that.$notify.remove();
				});
			}
		},

		_handleFooterButtonClick: function (event) {
			var handleList = this.handleList;
			var $target = $(event.target);
			var index = $.trim($target.data('index')) - 0;
			var callback = handleList[index].callback;

			this._close();

			if (callback) {
				callback();
			}
		}
	});

	return Notify;
});