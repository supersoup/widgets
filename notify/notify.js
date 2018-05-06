define([
	'text!./notify.ejs',
	'jquery',
	'ejs',
	'css!./notify.css'
], function (
	html,
	$
) {
	var $body = $('body');
	var animateTime = 200;
	var $notifyList = $('<ul class="notify-list"></ul>');

	$body.append($notifyList);

	function Notify(options) {
		var defaultOptions = {
			handleList: [],
			content: ''
		};

		var opts = $.extend(true, {}, defaultOptions, options);
		var that = this;
		var $notify = this.$notify = $('<li class="notify"></li>');
		var type = opts.type;
		var content = opts.content;
		var handleList = this.handleList = opts.handleList;
		var time = opts.time;

		var str = ejs.render(html, {
			content: content,
			handleList: handleList
		});

		$notify.html(str);

		var $close = $notify.find('.notify-close');
		$close.one('click', function () {
			that._close();
		});

		this.hasClosed = false;

		if (type === 'success') {
			$notify.addClass('notify-success');
		} else if (type === 'fail') {
			$notify.addClass('notify-fail');
		}

		$notify.on('click', '.notify-button', function (event) {
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