/**
 * @file dialog
 * @author Tang Chao
 */


define([
	'text!./dialog.ejs',
	'jquery',
	'util/renderEjs',
], function (
	html,
	$,
	renderEjs
) {
	var $window = $(window);
	var dialog;

	function Dialog(options) {
		var defaultOptions = {
			animateTime: 200,
			//如果不在打开时指定 content，则使用默认 defaultContent（可通过 config 修改 defaultContent）
			defaultContent: '是否确定？'
		};
		$.extend(this, defaultOptions, options);

		this._init()
	}

	$.extend(Dialog.prototype, {
		_init: function () {
			var that = this;
			var $dialog = this.$dialog = $('<div class="wd-dialog"></div>');
			$('body').append($dialog);
			that.isOpening = false;
			
			$dialog.on('click', '.wd-dialog-button',function (event) {
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

		_open: function (options) {
			var that = this;
			var handleList= this.handleList = options && options.handleList;
			var content = options && options.content;
			var target = options.node;

			var $target = this.$target = $(target);
			var targetOffset = $target.offset();
			var targetOffsetTop = targetOffset.top;
			var targetOffsetLeft = targetOffset.left;
			var targetHeight = $target.outerHeight();

			var windowScrollTop = $window.scrollTop();
			var windowHeight = $window.height();
			var windowWidth = $window.width();

			var $dialog = this.$dialog;
			$dialog.stop(true);

			var str = renderEjs(html, {
				content: content || this.defaultContent,
				handleList: handleList || []
			});
			$dialog.html(str);

			manualFadeIn($dialog, this.animateTime, function () {
				var $arrow = $dialog.find('.wd-dialog-arrow');
				var $arrowBorder = $dialog.find('.wd-dialog-arrow-border');
				var $dialogWidth = $dialog.outerWidth();
				var $dialogHeight = $dialog.outerHeight();

				//调整水平方向在合适的位置上，过于靠右，则需要向左偏移，同时箭头还是应该指向该 target 左上角
				var left = Math.min( (windowWidth - $dialogWidth), targetOffsetLeft );
				var arrowLeft = targetOffsetLeft > left ? targetOffsetLeft - left + 10 + 'px' : '10px';

				//如果太靠下，则在上方展示 dialog
				var isTooBottom = windowScrollTop + windowHeight + 12 < targetOffsetTop + targetHeight + $dialogHeight;

				if (isTooBottom) {
					$dialog
						.addClass('wd-dialog-top')
						.css({
							top: targetOffsetTop - $dialogHeight - 12 + 'px',
							left: left
						})

				} else {
					$dialog
						.removeClass('wd-dialog-top')
						.css({
							top: targetOffsetTop + targetHeight + 12 + 'px',
							left: left
						})
				}

				$arrow.css('left', arrowLeft);
				$arrowBorder.css('left', arrowLeft);

				//为了阻止本次点击冒泡到 document 上，导致 dialog 打开就关闭
				that.isOpening = true;
				setTimeout(function () {
					that.isOpening = false;
				}, 10)

			});
		},

		_close: function () {
			var time = this.animateTime;
			this.$dialog.fadeOut(time);
		}
	});

	$(document).on('click', function (event) {
		var $target = $(event.target);
		var isInDialog = $target.hasClass('wd-dialog') || $target.parents().hasClass('wd-dialog');
		var isNotInit = !dialog;
		var isOpening = dialog && dialog.isOpening;
		
		if (isInDialog || isNotInit || isOpening) {
			return;
		}
		
		dialog._close();
	});

	function init() {
		dialog = new Dialog();
	}
	
	function manualFadeIn($node, time, callback) {
		$node.css({
			opacity: 0,
			display: 'block'
		});
		
		var cbVal = callback();
		
		if (cbVal && $.isFunction(cbVal.then)) {
			cbVal.then(animate)
		} else {
			animate();
		}
		
		function animate() {
			$node.animate({
				opacity: 1
			}, time);
		}
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