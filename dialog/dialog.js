define([
	'text!./dialog.ejs',
	'jquery',
	'../util/manualFadeIn',
	'ejs',
	'css!./dialog.css'
], function (
	html,
	$,
	manualFadeIn
) {
	var $window = $(window);
	var dialog;

	function Dialog(options) {
		var defaultOptions = {
			animateTime: 300,
			defaultContent: '是否确定？'    //如果不在打开时指定 content，则使用默认 defaultContent（可通过 config 修改 defaultContent）
		};
		$.extend(this, defaultOptions, options);

		this._init()
	}

	$.extend(Dialog.prototype, {
		_init: function () {
			var that = this;
			var $dialog = this.$dialog = $('<div class="dialog"></div>');
			$('body').append($dialog);

			$dialog.on('click', '.dialog-button',function (event) {
				event.stopPropagation();
				that._handleDialogButtonClick(event);
			})
		},

		_handleDialogButtonClick: function (event) {

			var $target = $(event.target);
			var index = $target.data('index');
			index = $.trim(index) - 0;
			var callback = this.handleList[index].callback;

			//这里是关闭的同时，就进行回调操作。设计为：dialog 不支持异步，过于复杂的交互，应该使用 modal
			this._close();

			if (callback) {
				callback();
			}
		},

		_open: function (event, options) {
			var handleList= this.handleList = options && options.handleList;
			var content = options && options.content;

			var $target = this.$target = $(event.target);
			var targetOffset = $target.offset();
			var targetOffsetTop = targetOffset.top;
			var targetOffsetLeft = targetOffset.left;
			var targetHeight = $target.outerHeight();
			// var targetWidth = $target.outerWidth();

			var windowScrollTop = $window.scrollTop();
			var windowHeight = $window.height();
			var windowWidth = $window.width();

			var $dialog = this.$dialog;
			$dialog.stop(true);

			var str = ejs.render(html, {
				content: content || this.defaultContent,
				handleList: handleList || []
			});
			$dialog.html(str);

			manualFadeIn($dialog, this.animateTime, function () {
				var $arrow = $dialog.find('.dialog-arrow');
				var $dialogWidth = $dialog.outerWidth();
				var $dialogHeight = $dialog.outerHeight();

				//调整水平方向在合适的位置上，过于靠右，则需要向左偏移，同时箭头还是应该指向该 target 左上角
				var left = Math.min( (windowWidth - $dialogWidth), targetOffsetLeft );
				var arrowLeft = targetOffsetLeft > left ? targetOffsetLeft - left + 10 + 'px' : '10px';

				//如果太靠下，则在上方展示 dialog
				var isTooBottom = windowScrollTop + windowHeight < targetOffsetTop + targetHeight + $dialogHeight;

				if (isTooBottom) {
					$dialog.css({
						top: targetOffsetTop - $dialogHeight + 'px',
						left: left
					});
					$arrow
						.addClass('dialog-arrow-bottom')
						.removeClass('dialog-arrow-top');
				} else {
					$dialog.css({
						top: targetOffsetTop + targetHeight,
						left: left
					});
					$arrow
						.addClass('dialog-arrow-top')
						.removeClass('dialog-arrow-bottom');
				}

				$arrow.css('left', arrowLeft);
			});
		},

		_close: function () {
			var time = this.animateTime;
			this.$dialog.fadeOut(time);
		}
	});

	$(document).on('click', function (event) {
		var $target = $(event.target);
		var isInDialog = !$target.hasClass('dialog') && !$target.parents().hasClass('dialog');
		var isAlreadyInit = dialog;
		var isHide;

		//todo:还存在 bug，每次打开后都会关闭
		if ( !(isInDialog || isAlreadyInit || isHide) ) {
			dialog._close();
		}
	});

	function init() {
		dialog = new Dialog();
	}

	/**
	 * config
	 * @param options
	 */
	function config(options) {
		if (!dialog) {
			init();
		}

		$.extend(dialog, options);
	}

	/**
	 * open
	 * @param event
	 * @param options.content
	 * @param options.handleList
	 */
	function open(event, options) {
		if (!dialog) {
			init();
		}

		dialog._open(event, options);
	}

	return {
		config: config,
		open: open
	}
});