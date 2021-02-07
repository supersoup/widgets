/**
 * @file input
 * @author Tang Chao
 */


define([
    'jquery',
	'util/browser'
], function(
    $,
    browser
) {
	function Input(options) {
		this.node = options.node;
		this.className = options.className !== undefined ? options.className : '';
		this.onChange = options.onChange ? options.onChange : $.noop;
		
		this._init();
	}
	
	$.extend(Input.prototype, {
		_init: function () {
			var that = this;
			var $input = this.$input = $('<input type="text"/>');
			$input.attr('class', this.className);
			this.isValueSetting = false;
			
			$(this.node).after($input);
			
			if (browser.isIE8) {
				$input.on('propertychange', function () {
					if (!that.isValueSetting) {
						that.onChange($input.val());
					}
					
				})
			} else {
				$input.on('input', function () {
					if (!that.isValueSetting) {
						that.onChange($input.val());
					}
				})
			}
		},
		
		setValue: function (value) {
			this.isValueSetting = true;
			
			this.$input.val(value);
			this.isValueSetting = false;
		},
		
		getValue: function () {
			return this.$input.val();
		}
	});
	
	return Input;
});