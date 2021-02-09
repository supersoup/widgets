/**
 * Created by supersoup on 18/4/6.
 */

define([
	'jquery',
	'css!./fixedHeadTable.css'
], function (
	$
) {
	function FixedHeadTable(options) {

		var defaultOptions = {

		};

		var obj = $.extend(true, defaultOptions, options);

		this.$doc = $(document);
		this.$wrap = $('#' + obj.wrapId);
		this.$thead = this.$wrap.find('.fixed-table-header');
		this.$theadX = this.$wrap.find('.fixed-table-x-header');
		this.$theadY = this.$wrap.find('.fixed-table-y-header');
		this.$tfoot = this.$wrap.find('.fixed-table-footer');
		this.$tfootY = this.$wrap.find('.fixed-table-y-footer');
		this.$tbody = this.$wrap.find('.fixed-table-body');
		this.$scrollBarX = this.$wrap.find('.fixed-x-scroll-bar');
		this.$scrollBarY = this.$wrap.find('.fixed-y-scroll-bar');
		this.$sliderX = this.$wrap.find('.fixed-x-scroll-slider');
		this.$sliderY = this.$wrap.find('.fixed-y-scroll-slider');

		this._init();

		return this;
	}

	$.extend(FixedHeadTable.prototype, {

		_init: function () {
			this.refresh();

			this._initSliderX();
			this._initSliderY();
			this._initScrollEvent();
		},

		refresh: function () {
			//各块宽度
			this.wrapWidth = this.$wrap.width();
			this.wrapHeight = this.$wrap.height();
			this.theadWidth = this.$thead.width();
			this.theadHeight = this.$thead.height();
			this.tfootWidth = this.$tfoot.size() > 0 ? this.$tfoot.width() : 0;
			this.scrollBarXWidth = this.$scrollBarX.width();
			this.scrollBarYHeight = this.$scrollBarY.height();
			this.scrollBarXThick = this.$scrollBarX.height();
			this.scrollBarYThick = this.$scrollBarY.width();

			//要让表格滚动的内容体，能够滚到底部，必须加上被遮盖的部分
			this.tbodyWidth = this.$tbody.width() + this.tfootWidth + this.scrollBarYThick;
			this.tbodyHeight = this.$tbody.height() + this.scrollBarXThick;

			//滚动比例
			this.scrollScaleX = this.scrollBarXWidth / this.tbodyWidth;
			this.scrollScaleY = this.scrollBarYHeight / this.tbodyHeight;

			//设置slider
			this.sliderXWidth = parseInt( this.scrollBarXWidth * (this.wrapWidth - this.theadWidth) / this.tbodyWidth );
			this.sliderYHeight = parseInt( this.scrollBarYHeight * (this.wrapHeight - this.theadHeight) / this.tbodyHeight );
			this.$sliderX.width(this.sliderXWidth);
			this.$sliderY.height(this.sliderYHeight);

			//设置各个区块的位置
			var footLeft = this.wrapWidth - this.tfootWidth - this.scrollBarXThick;
			this.$theadX.css('left', this.theadWidth);
			this.$theadY.css('top', this.theadHeight);
			this.$tfoot.css('left', footLeft);
			this.$tfootY.css('left', footLeft)
				.css('top', this.theadHeight);
			this.$tbody.css('left', this.theadWidth)
				.css('top', this.theadHeight);
			this.$sliderX.css('left', 0);
			this.$sliderY.css('top', 0);
		},

		_initSliderX: function () {
			var that = this;
			var $slider = this.$sliderX;
			var $tbody = this.$tbody;
			var $doc = this.$doc;

			$slider.on('mousedown', function (event) {
				var pageXBefore = event.pageX;
				var leftBefore = parseInt( $slider.css('left') );
				var tbodyLeftBefore = parseInt( $tbody.css('left') );

				$doc.on('mousemove.fixedHeadTable', function (event) {
					event.preventDefault();
					that._computeX({
						move: event.pageX - pageXBefore,
						leftBefore: leftBefore,
						tbodyLeftBefore: tbodyLeftBefore
					})
				});
				$doc.one('mouseup', function () {
					console.log('mouseup');
					$doc.off('.fixedHeadTable');
				});
			})
		},

		_initSliderY: function () {
			var that = this;
			var $slider = this.$sliderY;
			var $tbody = this.$tbody;
			var $doc = this.$doc;

			$slider.on('mousedown', function (event) {
				var pageYBefore = event.pageY;
				var topBefore = parseInt( $slider.css('top') );
				var tbodyTopBefore = parseInt( $tbody.css('top') );

				$doc.on('mousemove.fixedHeadTable', function (event) {
					event.preventDefault();
					that._computeY({
						move: event.pageY - pageYBefore,
						topBefore: topBefore,
						tbodyTopBefore: tbodyTopBefore
					});
				});
				$doc.one('mouseup', function () {
					console.log('mouseup');
					$doc.off('.fixedHeadTable');
				});
			})
		},

		/**
		 * @param options.leftBefore
		 * @param options.tbodyLeftBefore
		 * @param options.move
		 */
		_computeX: function (options) {
			var leftBefore = options.leftBefore;
			var tbodyLeftBefore = options.tbodyLeftBefore;
			var move = options.move;
			var maxMove = this.scrollBarXWidth - this.sliderXWidth;
			var left;
			var leftChange;
			var tbodyLeft;

			if (move > 0) {
				left = Math.min(leftBefore + move, maxMove);
			} else {
				left = Math.max(leftBefore + move, 0);
			}

			leftChange = left - leftBefore;

			if (left === 0) {
				tbodyLeft = this.theadWidth;
			} else if (left === maxMove) {
				tbodyLeft = this.wrapWidth - this.tbodyWidth;
			} else {
				tbodyLeft = tbodyLeftBefore - (leftChange / this.scrollScaleX);
			}

			this.$sliderX.css('left', left + 'px');
			this.$theadX.css('left', tbodyLeft + 'px');
			this.$tbody.css('left', tbodyLeft + 'px');
		},

		/**
		 * @param options.topBefore
		 * @param options.tbodyTopBefore
		 * @param options.move
		 */
		_computeY: function (options) {
			var topBefore = options.topBefore;
			var tbodyTopBefore = options.tbodyTopBefore;
			var move = options.move;
			var maxMove = this.scrollBarYHeight - this.sliderYHeight;
			var top;
			var topChange;
			var tbodyTop;

			if (move > 0) {
				top = Math.min(topBefore + move, maxMove);
			} else {
				top = Math.max(topBefore + move, 0);
			}

			topChange = top - topBefore;

			if (top === 0) {
				tbodyTop = this.theadHeight;
			} else if (top === maxMove) {
				tbodyTop = this.wrapHeight - this.tbodyHeight;
			} else {
				tbodyTop = tbodyTopBefore - (topChange / this.scrollScaleY);
			}

			this.$sliderY.css('top', top + 'px');
			this.$theadY.css('top', tbodyTop + 'px');
			this.$tfootY.css('top', tbodyTop + 'px');
			this.$tbody.css('top', tbodyTop + 'px');
		},

		_initScrollEvent: function () {
			var that = this;
			that.$wrap.on('mousewheel', function (event) {
				event.preventDefault();
				event.stopPropagation();

				if (event.shiftKey) {
					that._computeX({
						move: - event.originalEvent.wheelDelta,
						leftBefore: parseInt( that.$sliderX.css('left') ),
						tbodyLeftBefore: parseInt( that.$tbody.css('left') )
					})
				} else {
					that._computeY({
						move: - event.originalEvent.wheelDelta,
						topBefore: parseInt( that.$sliderY.css('top') ),
						tbodyTopBefore: parseInt( that.$tbody.css('top') )
					})
				}
			});

		}
	});

	return FixedHeadTable
});