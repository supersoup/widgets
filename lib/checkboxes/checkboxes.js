/**
 * @file chooser
 * @author Tang Chao
 */

define([
    'jquery',
	'ejs',
	'underscore',
	'text!./checkboxes.ejs'
], function(
    $,
    ejs,
    _,
    temp
) {
	// var CLASS_CHECKBOXES = 'wd-checkboxes';
	var CLASS_ALL = 'wd-checkboxes-all';
	var CLASS_WRAP = 'wd-checkbox-item-list-wrap';
	var CLASS_ITEM = 'wd-checkboxes-item';
	
	function Checkboxes(options) {
		this.node = options.node;
		this.hasAll = options.hasAll ? options.hasAll : false;
		this.list = options.list ? options.list : [];
		this.onChange = options.onChange ? options.onChange : $.noop;
		
		this._init();
		return this;
	}
	
	$.extend(Checkboxes.prototype, {
		_init: function () {
			this.$node = $(this.node);
			this.value = [];
			
			this._createItemList();
			this._bindEvents();
		},
		
		_createItemList: function () {
			var html = ejs.render(temp, {
				list: this.list,
				hasAll: this.hasAll
			});
			
			var $checkboxes = this.$checkboxes = $(html);
			
			this.$all = $checkboxes.find('.' + CLASS_ALL);
			this.$wrap = $checkboxes.find('.' + CLASS_WRAP);
			this.$checkboxList = $checkboxes.find('.' + CLASS_ITEM);
			this.$node.after($checkboxes);
		},
		
		_bindEvents: function () {
			var that = this;
			
			that.$checkboxes.on('click', '.' + CLASS_ITEM, function () {
				setTimeout(function () {
					that._changeOne();
				})
			});
			
			if (this.hasAll) {
				that.$all.click(function () {
					setTimeout(function () {
						that._changeAll();
					})
				});
			}
		},
		
		_changeOne: function () {
			var $checkboxList = this.$checkboxList;
			var $all = this.$all;
			var value = [];
			var allShouldValue = true;
			
			$checkboxList.each(function (i, item) {
				var $item = $(item);
				var itemValue = $item.prop('checked');
				
				if (!itemValue) {
					allShouldValue = false;
				} else {
					//强转字符串
					value.push($item.val() + '');
				}
			});
			
			$all.prop('checked', allShouldValue);
			this.value = value;
			
			this.onChange(this._getCloneValue());
		},
		
		_changeAll: function () {
			var $checkboxList = this.$checkboxList;
			var $all = this.$all;
			var checkAllValue = $all.prop('checked');
			
			$checkboxList.each(function (i, item) {
				$(item).prop('checked', checkAllValue);
			});
			
			this.value = _.map(this.list, function (item) {
				return item.value + '';
			});
			
			if (!checkAllValue) {
				this.value = [];
			}
			
			this.onChange(this._getCloneValue());
		},
		
		_getCloneValue: function () {
			return $.extend(true, [], this.value);
		},
		
		setValue: function (valueList) {
			var $checkboxList = this.$checkboxList;
			var that = this;
			$checkboxList.each(function (i, item) {
				var $item = $(item);
				var value = _.indexOf(valueList, $item.val() + '') >= 0;
				$item.prop('checked', value);
			});
			
			this.value = valueList;
			
			if (!that.hasAll) {
				return;
			}
			
			if (valueList.length === that.list.length) {
				that.$all.prop('checked', true);
			} else {
				that.$all.prop('checked', false);
			}
			
		},
		
		getValue: function () {
			return this._getCloneValue();
		}
	});
	
	return Checkboxes;
});