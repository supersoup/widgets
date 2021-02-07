/**
 * @file checkboxAll
 * @author Tang Chao
 */


define([
    'jquery',
	'underscore',
	'ejs',
	'text!./chooser.ejs'
], function(
    $,
	_,
    ejs,
    ejsChooser
) {
	var CLASS_CURRENT = 'wd-chooser-button-current';
	var CLASS_BUTTON = 'wd-chooser-button';
	
	function Chooser(options) {
		this.node = options.node;
		this.list = options.list;
		this.className = options.className;
		this.onChoose = options.onChoose ? options.onChoose : $.noop;
		
		this._init();
	}
	
	$.extend(Chooser.prototype, {
		_init: function () {
			var that = this;
			var $wrap = this.$wrap = $('<div class="wd-chooser"></div>');
			$wrap.addClass(this.className);
			
			var str = ejs.render(ejsChooser, {
				list: this.list
			});
			
			this.isFirstList = _.map(this.list, function () {
				return true;
			});
			
			$wrap.html(str);
			this.$buttons = $wrap.find('.' + CLASS_BUTTON);
			
			$(this.node).after($wrap);
			
			$wrap.on('click', '.wd-chooser-button', function (event) {
				event.stopPropagation();
				var $target = $(event.target);
				var index = $target.attr('data-index') - 0;
				var item = that.list[index];
				var isFirst = that.isFirstList[index];
				
				that.currentIndex = index;
				that._changeClassNameByIndex();
				that.isFirstList[index] = false;
				
				that.onChoose(isFirst, {
					value: item.value,
					text: item.text,
					index: index
				});
			})
		},
		
		_changeClassNameByIndex: function () {
			var index = this.currentIndex;
			
			this.$buttons.each(function (i, item) {
				var $item = $(item);
				if ($item.attr('data-index') - 0 === index) {
					$item.addClass(CLASS_CURRENT);
				} else {
					$item.removeClass(CLASS_CURRENT);
				}
			})
		},
		
		setCurrentIndex: function (index, shouldExecOnChoose) {
			if (shouldExecOnChoose === undefined) {
				shouldExecOnChoose = true;
			}
			
			var item = this.list[index];
			var isFirst = this.isFirstList[index];
			this.currentIndex = index;
			this._changeClassNameByIndex();
			this.isFirstList[index] = false;
			
			if (shouldExecOnChoose) {
				this.onChoose(isFirst, {
					value: item.value,
					text: item.text,
					index: index
				});
			}
		},
		
		getValue: function () {
			return this.list[this.currentIndex].value;
		},
		
		getIndex: function () {
			return this.currentIndex;
		}
	});
	
    return Chooser;
});