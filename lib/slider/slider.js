/**
 * @file slider
 * @author Tang Chao
 */


define([
	'text!./slider.ejs',
	'jquery',
	'underscore'
], function (
	html,
	$,
	_
) {
	var $doc = $(document);
	var key = 0;
	
	/**
	 * Slider
	 * @param options:
	 * @param options.node 元素
	 * @param options.max
	 * @param options.min
	 * @param options.step
	 * @param options.onChange(value)
	 * @constructor
	 */
	function Slider(options) {
		this._init(options);
	}
	
	$.extend(Slider.prototype, {
		_init: function (options) {
            var that = this;
			var defaultOptions = {
				max: 100,
				min: 0,
				step: 1,
				width: '300px',
				onChange: $.noop
			};
			
			$.extend(this, defaultOptions, options);
			
			if ((this.max - this.min) % this.step !== 0) {
				throw new Error('step 必须被 (max - min) 整除');
			}
			
			var $node = this.$node = $(this.node);
			
			var $root = this.$root = $(html);
			var $bar = this.$bar = $root.find('.wd-slider-bar');
			var $mouseRange = this.$mouseRange = $root.find('.wd-slider-mouse-range');
			this.$handler = $root.find('.wd-slider-handler');
			this.$range = $root.find('.wd-slider-range');
			this.$tooltip = $root.find('.wd-slider-tooltip');
			this.widgetKey = 'slider' + key;
			this.renderTooltipText = options.renderTooltipText !== undefined ? options.renderTooltipText : false;
			
			$node.append($root);
			
			key ++;
			
			$bar.css('width', this.width);
			$mouseRange.css('width', this.width);
			
			this._positionBar();
			this._setScaleArray();
			//默认值为 min
			this.value = this.min;
			
			$mouseRange.on('mousedown', function (event) {
                that._handleDragStart(event);
            });
		},
		
		_positionBar: function () {
			var $bar = this.$bar;
			this.barLeftX = $bar.offset().left;
			this.barWidth = $bar.width();
			this.barRightX = this.barLeftX + this.barWidth;
		},
		
		_handleDragStart: function (event) {
            var that = this;
			
			this.dragX = event.pageX;
			this._positionBar();
			
			//考虑：是否开始点击时还需要再进行一次设置
			this._setScaleArray();
			
			//点下之后不拖动，同样可以设置值
			var index = this._findNearestIndex(this.dragX);
			this._setValueAndRender(index, true);
			
			if (this.renderTooltipText) {
				that.$tooltip.fadeIn(300);
			}
			
			//事件命名空间，点下时触发，松开时移除，避免在界面移动时随时触发
			$doc.on('mousemove.' + this.widgetKey, function (e) {
                that._handleDrag(e);
            });
			$doc.one('mouseup', function () {
				$doc.off('mousemove.' + that.widgetKey);
				that.$tooltip.fadeOut(300);
            })
		},
		
		_renderTooltip: function () {
			if (this.renderTooltipText) {
				var text = this.renderTooltipText(this.value);
				this.$tooltip.text(text);
				var width = this.$tooltip.outerWidth();
				this.$tooltip.css('marginLeft', (7 - width / 2 ) + 'px');
			}
		},
		
		_handleDrag: function (event) {
			this.dragX = event.pageX;
			var index = this._findNearestIndex(this.dragX);
			this._setValueAndRender(index, true);
		},
		
		_setValueAndRender: function(index, isExecOnChange) {
			var distValue;
			var distPosition;
			
			if (index === -1) {
				distValue = this.min;
				distPosition = this.barLeftX;
			} else {
				var scaleItem = this.scaleArray[index];
				if (this.dragX > scaleItem.mid) {
					distValue = scaleItem.rightValue;
					distPosition = scaleItem.right;
				} else {
					distValue = scaleItem.leftValue;
					distPosition = scaleItem.left;
				}
			}
			
			//如果值是一致的，则不需要操作 dom
			if (distValue === this.value) {
				return;
			}
			
			this.value = distValue;
			var distance = distPosition - this.barLeftX + 'px';
			this.$handler.css('left', distance);
			this.$range.css('width', distance);
			this.$tooltip.css('left', distance);
			this._renderTooltip();
			
			//只有操作控件才触发 onChange 方法
			if (isExecOnChange) {
				this.onChange(this.value);
			}
		},
		
		_setScaleArray: function () {
			var barLeftX = this.barLeftX;
			var barRightX = this.barRightX;
			var barWidth = this.barWidth;
			var step = this.step;
			var max = this.max;
			var min = this.min;
			
			var length = Math.round((max - min) / step);
			var stepLong = barWidth / length;
			var scaleArray = [];
			
			var m = barLeftX + stepLong / 2;
			var v = min;
			while(v <= max - step) {
				scaleArray.push({
					mid: m,
					left: m - stepLong / 2,
					right: m + stepLong / 2,
					leftValue: v,
					rightValue: v + step
				});
				
				m = m + stepLong;
				v = v + step;
			}
			
			//将两侧的坐标设为 bar 的两端，避免不精确的情况
			scaleArray[0].left = barLeftX;
			scaleArray[length - 1].right = barRightX;
			
			this.scaleArray = scaleArray;
		},
		
		_findScaleByValue: function (value) {
			var index;
			if (value === this.min) {
				return -1;
			} else {
				index = _.findIndex(this.scaleArray, function (item) {
					return item.rightValue === value;
				});
				
				if (index !== -1) {
					return index;
				} else {
					throw new Error('所设置的 value 不在可选的范围内');
				}
			}
		},
		
		//二分法查找，找到 x 坐落的区间，目前实现得不是太优美
		_findNearestIndex: function (x) {
			var arr = this.scaleArray;
			
			var left = 0;
			var right = arr.length - 1;
			var middle;
			
			if (x < arr[left].left) {
				return -1;
			}
			
			if (x > arr[right].right) {
				return right;
			}
			
			//找到最后两个区间
			do {
				middle = Math.floor((right + left) / 2);

				var rval = arr[middle].right;

				if (x < rval) {
					right = middle;
				} else {
					left = middle;
				}

			} while (right - left > 1);
			
			//判断最后两个区间
			if (x < arr[left].right) {
				return left;
			} else {
				return right;
			}
		},
		
		setValue: function (value) {
			if (typeof value !== 'number') {
				throw new Error('需要设置数字，建议为正整数');
			}
			
			if (value > this.max || value < this.min) {
				throw new Error('不能设置小于 min 或大于 max 的数值');
			}
			
			var index = this._findScaleByValue(value);
			
			//由于代码里要使用 dragX，目前暂时借用 item.right，后期再考虑优化
			this.dragX = this.scaleArray[index].right;
			this._setValueAndRender(index, false);
		},
		
		getValue: function () {
			return this.value;
		}
	});
	
	return Slider;
});