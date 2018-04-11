/**
 * Created by supersoup on 18/4/6.
 */

define([
	'jquery'
], function ($) {
	function FixedHeadTable(options) {

		var defaultOptions = {

		};

		var obj = $.extend(true, defaultOptions, options);

		this.$doc = $(document);
		this.$wrap = $('#' + obj.wrapId);
		this.$thead = this.$wrap.find('.fixed-table-header');
		this.$theadX = this.$wrap.find('.fixed-table-x-header');
		this.$theadY = this.$wrap.find('.fixed-table-y-header');
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
			this.wrapWidth = this.$wrap.width();
			this.wrapHeight = this.$wrap.height();
			this.theadWidth = this.$thead.width();
			this.theadHeight = this.$thead.height();
			this.tbodyWidth = this.$tbody.width() + 14;
			this.tbodyHeight = this.$tbody.height() + 14;
			this.scrollBarXWidth = this.$scrollBarX.width();
			this.scrollBarYHeight = this.$scrollBarY.height();

			this.scaleX = (this.wrapWidth - this.theadWidth) / this.tbodyWidth;
			this.scaleY = (this.wrapHeight - this.theadHeight) / this.tbodyHeight;

			this.scrollScaleX = this.scrollBarXWidth / (this.tbodyWidth);
			this.scrollScaleY = this.scrollBarYHeight / (this.tbodyHeight);

			this.sliderXWidth = parseInt( this.scrollBarXWidth * this.scaleX );
			this.sliderYHeight = parseInt( this.scrollBarYHeight * this.scaleY );

			this.tbodyLeftBeforeInit = parseInt( this.$tbody.css('left') );
			this.tbodyTopBeforeInit = parseInt( this.$tbody.css('top') );

			this.$sliderX.width(this.sliderXWidth);
			this.$sliderY.height(this.sliderYHeight);
		},

		_initSliderX: function () {
			var that = this;
			var $slider = this.$sliderX;
			var $tbody = this.$tbody;
			var $doc = this.$doc;

			$slider.css('left', 0);
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

			$slider.css('top', 0);
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

		_computeX: function (options) {
			var leftBefore = options.leftBefore;
			var tbodyLeftBefore = options.tbodyLeftBefore;
			var move = options.move;

			var left;
			var leftChange;
			var tbodyLeft;

			if (move > 0) {
				left = Math.min(leftBefore + move, this.scrollBarXWidth - this.sliderXWidth);
			} else {
				left = Math.max(leftBefore + move, 0);
			}

			leftChange = left - leftBefore;
			tbodyLeft = left === 0 ? this.tbodyLeftBeforeInit : tbodyLeftBefore - (leftChange / this.scrollScaleX);

			this.$sliderX.css('left', left + 'px');
			this.$theadX.css('left', tbodyLeft + 'px');
			this.$tbody.css('left', tbodyLeft + 'px');
		},

		_computeY: function (options) {
			var topBefore = options.topBefore;
			var tbodyTopBefore = options.tbodyTopBefore;
			var move = options.move;
			var top;
			var topChange;
			var tbodyTop;

			if (move > 0) {
				top = Math.min(topBefore + move, this.scrollBarYHeight - this.sliderYHeight);
			} else {
				top = Math.max(topBefore + move, 0);
			}

			topChange = top - topBefore;
			tbodyTop = top === 0 ? this.tbodyTopBeforeInit : tbodyTopBefore - (topChange / this.scrollScaleY);

			this.$sliderY.css('top', top + 'px');
			this.$theadY.css('top', tbodyTop + 'px');
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