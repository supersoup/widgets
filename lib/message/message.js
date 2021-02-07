/**
 * @file message
 * @author Tang Chao
 */

define([
	'jquery'
], function (
	$
) {
	var $body = $('body');
	var animateTime = 200;
	
	/**
	 * Message
	 * @param options:
	 * @param options.time: 不传则不自动关闭
	 * @param options.content
	 * @param options.type: undefined, 'success', 'fail'
	 * @returns {Message}
	 * @constructor
	 */
	function Message(options) {
		var that = this;
		var $message = this.$message = $('<div class="wd-message"><div class="wd-message-content"></div><div class="wd-message-close">x</div></div>');
		var $content = $message.find('.wd-message-content');
		var $close = $message.find('.wd-message-close');
		var type = options.type;
		var time = options.time;

		this.hasClosed = false;

		$content.html(options.content);
		$close.one('click', function () {
			that._close();
		});

		
		if (type === 'success') {
			$message.addClass('wd-message-success');
		} else if (type === 'fail') {
			$message.addClass('wd-message-fail');
		}

		$body.append($message);

		var height = this.height = $message.outerHeight();
		$message
			.css({
				top: -height + 'px',
				opacity: 1
			})
			.animate({top: '20px'}, animateTime, function () {
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

	$.extend(Message.prototype, {
		_close: function () {
			var that = this;

			if (!this.hasClosed) {
				this.hasClosed = true;

				this.$message.animate({'top': -this.height + 'px'}, animateTime, function () {
					that.$message.remove();
				});
			}
		}
	});

	return Message;
});