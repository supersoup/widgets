define([
	'jquery',
	'css!./message.css'
], function (
	$
) {
	var $body = $('body');
	var animateTime = 200;

	function Message(options) {
		var that = this;
		var $message = this.$message = $('<div class="message"><div class="message-content"></div><div class="message-close">x</div></div>');
		var $content = $message.find('.message-content');
		var $close = $message.find('.message-close');
		var type = options.type;
		var time = options.time;

		this.hasClosed = false;

		$content.html(options.content);
		$close.one('click', function () {
			that._close();
		});

		if (type === 'success') {
			$message.addClass('message-success');
		} else if (type === 'fail') {
			$message.addClass('message-fail');
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
					that.$message.empty();
				});
			}
		}
	});

	return Message;
});