define([
	'text!./slider.html',
	'jquery',
	'css!./slider.css'
], function (html, $) {
	var $doc = $(document);
	
	function Slider(options) {
		this._init(options);
	}
	
	$.extend(Slider.prototype, {
		_init: function (options) {
			var defaultOptions = {
				max: 100,
				min: 0,
				step: 1,
				value: 0
			};
			
			$.extend(this, defaultOptions, options);
			
			var $wrap = this.$wrap = $(this.wrap);
			$wrap.html(html);
			
			$wrap.mousedown(function () {
				
			});
			
			
		},
		
		_handleDragStart: function (event) {
			
		},
		
		_handleDrag: function (event) {
			
		},
		
		_handleDragEnd: function (event) {
			
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