define([
	'jquery'
], function ($) {
	
	/**
	 * CheckboxList
	 * @param options.checkboxAll 指定全选的 input
	 * @param options.checkboxAllText 没有指定全选 input 时，自动添加的文字，默认为全选
	 * @param options.wrap checkbox 的外层包裹元素
	 * @constructor
	 */
	function CheckboxList(options) {
		this._init(options);
		return this;
	}
	
	$.extend(CheckboxList.prototype, {
		_init: function (options) {
			var that = this;
			var checkboxAll = options.checkboxAll;
			var checkboxAllText = options.checkboxAllText || '全选';
			var $wrap = $(options.wrap);
			var $checkboxList = $wrap.find('input[type=checkbox]');
			var $checkboxAll;
			var checkboxAllLabel;
			
			if (!checkboxAll) {
				checkboxAllLabel = $('<label><input type="checkbox"><span>' + checkboxAllText + '</span></label>');
				$wrap.prepend(checkboxAllLabel);
				$checkboxAll = checkboxAllLabel.find('input');
			} else {
				$checkboxAll = $(checkboxAll);
				$checkboxList.each(function (i, item) {
					var $item = $(item);
					
					if ($item.is($checkboxAll)) {
						Array.prototype.splice.call($checkboxList, i, 1);
					}
				})
			}
			
			this.$checkboxAll = $checkboxAll;
			this.$checkboxList = $checkboxList;
			
			this._changeOne();
			
			$wrap.on('click', 'input', function () {
				that._changeOne();
			});
			
			$checkboxAll.click(function () {
				that._changeAll();
			});
		},
		
		_changeOne: function () {
			var $checkboxList = this.$checkboxList;
			var $checkboxAll = this.$checkboxAll;
			var allShouldValue = true;
			
			$checkboxList.each(function (i, item) {
				var itemValue = $(item).prop('checked');
				
				if (!itemValue) {
					allShouldValue = false;
					return false;
				}
			});
			
			$checkboxAll.prop('checked', allShouldValue);
			
		},
		
		_changeAll: function () {
			var $checkboxList = this.$checkboxList;
			var $checkboxAll = this.$checkboxAll;
			var value = $checkboxAll.prop('checked');
			
			$checkboxList.each(function (i, item) {
				$(item).prop('checked', value);
			})
		}
	});
	
	return CheckboxList;
	
});