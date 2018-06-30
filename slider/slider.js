define([
	'text!./slider.html',
	'jquery',
	'css!./slider.css'
], function (html, $) {
	var $doc = $(document);
	var key = 0;
	
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
				value: 0
			};
			
			$.extend(this, defaultOptions, options);
			
			var $wrap = this.$wrap = $(this.wrap);
			$wrap.html(html);
			var $handler = this.$handler = $wrap.find('.slider-handler');
			var $range = this.$range = $wrap.find('.slider-range');
			var $bar = this.$bar = $wrap.find('.bar');
			var barWidth = this.barWidth = $bar.width();
			var widgetKey = this.widgetKey = 'slider' + key;

            $handler.on('mousedown', function (event) {
                that._handleDragStart(event);
            });
		},
		
		_handleDragStart: function (event) {
            var that = this;

			this.beginX = event.pageX;
			$doc.on('mousemove.' + this.widgetKey, function (event) {
                that._handleDrag(event);
            });
			$doc.one('mouseup', function (event) {
                that._handleDragEnd(event);
            })
		},
		
		_handleDrag: function (event) {
			console.log(event);
		},
		
		_handleDragEnd: function (event) {
            $doc.off('mousemove.' + this.widgetKey);
		},
		
		_adjustPosition: function () {
			
		},
		
		setValue: function () {
			
		},
		
		getValue: function () {
			
		}
	});
	
	return Slider;
});