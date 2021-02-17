/**
 * @file search
 * @author Tang Chao
 */


define([
	'text!./search.ejs',
    'jquery',
	'util/browser',
	'underscore'
], function(
	html,
    $,
	browser,
	_
) {
	var key = 0;
	
	var CLASS_WRAP = 'wd-search-wrap';
	var CLASS_WRAP_OPEN = 'wd-search-wrap-open';
	var CLASS_BUTTON = 'wd-search-view-button';
	var CLASS_CLEAN = 'wd-search-view-clean';
	var CLASS_POP = 'wd-search-pop';
	var CLASS_INPUT = 'wd-search-input';
	var CLASS_LIST = 'wd-search-list';
	var CLASS_ITEM = 'wd-search-item';
	var CLASS_ITEM_CURRENT = 'wd-search-item-current';
	
	/**
	 * nSearch
	 * @param options:
	 * @param options.node 一个空的行内元素，整个组件将插入在这个 node 后面
	 * @param options.placeholder
	 * @param options.width
	 * @param options.height
	 * @param options.onChange(value, text, index) {Function}
	 * @param options.onSearch(text) {Function}
	 * @function setOptions(list) @param list: [{value: '', text: ''}]
	 * @constructor
	 */
	function Search(options) {
		this.node = options.node;
		this.placeholder = options.placeholder ? options.placeholder : '请选择';
		this.width = options.width;
		this.height = options.height;
		this.onChange = options.onChange ? options.onChange : $.noop;
		this.onSearch = options.onSearch ? options.onSearch : $.noop;
		this.cleanShouldTriggerOnChange = options.cleanShouldTriggerOnChange === undefined ? false : options.cleanShouldTriggerOnChange;
		this.className = options.className === undefined ? undefined : options.className;
		
		this._init();
	}
	
	$.extend(Search.prototype, {
		_init: function () {
			this.value = undefined;
			this.text = undefined;
			this.index = undefined;
			this.isPopShow = false;
			this.listData = [];
			this.widgetKey = 'search' + key;
			key++;
			
			var $html = $(html);
			var $wrap = this.$wrap = $html.filter('.' + CLASS_WRAP);
			var $button = this.$button = $wrap.find('.' + CLASS_BUTTON);
			var $pop = this.$pop = $wrap.find('.' + CLASS_POP);
			this.$input = $wrap.find('.' + CLASS_INPUT);
			this.$list = $wrap.find('.' + CLASS_LIST);
			var $clean = this.$clean = $wrap.find('.' + CLASS_CLEAN);
			
			if (this.className) {
				_.each(this.className.split(' '), function (item) {
					$wrap.addClass(item);
				})
			}
			
			//事件要用时注意，用这样的方式传递 this
			var that = this;
			$button.click(function (e) { that._onButtonClick(e); });
			$clean.click(function () {
				that._clean();
				if (that.cleanShouldTriggerOnChange) {
					that.onChange(undefined, undefined, undefined);
				}
			});
			$pop.on('click', function (e) { that._onPopClick(e); });
			this._bindInputInput();
			
			this._renderText();
			$(this.node).after($html);
		},
		
		_onButtonClick: function (e) {
			this._openPop();
			this.$input.focus();
			e.stopPropagation();
		},
		
		_bindInputInput: function () {
			var that = this;
			var $input = this.$input;
			
			//判断是否是 ie8
			if ('oninput' in $input.get(0)) {
				$input.on('input', function () {
					that.onSearch(that.$input.val());
				})
			} else {
				$input.on('propertychange', function () {
					
					// ie8 每次打开弹窗 clearInput 时也会触发，所以要判断一下状态一下。
					console.log(that.isIe8ClearInput);
					if (that.isIe8ClearInput === 'after') {
						that.onSearch(that.$input.val());
					}
				})
			}
		},
		
		_onPopClick: function (e) {
			e.stopPropagation();
			
			var $target = $(e.target);
			
			if ($target.hasClass(CLASS_ITEM)) {
				this._handleOptionClick($target);
			}
		},
		
		_openPop: function () {
			var that = this;
			this.isIe8ClearInput = 'before';
			this._clearInputText();
			this.isIe8ClearInput = 'after';
			this.$pop.show();
			
			$(document).on('click.' + this.widgetKey, function() {
				that._closePop();
			});
			
			this.$wrap.addClass(CLASS_WRAP_OPEN);
			this.isPopShow = true;
		},
		
		_handleOptionClick: function ($target) {
			var index = $target.attr('data-index');
			var oldValue = this.value;
			
			this._setValueAndTextAndIndex(index);
			this._renderItemClass();
			this._renderText();
			this._closePop();
			this.$clean.show();
			
			var newValue = this.value;
			
			if (oldValue !== newValue) {
				this.onChange(this.value, this.text, index);
			}
		},
		
		_setValueAndTextAndIndex: function (index) {
			if (index === -1) {
				this.index = undefined;
				this.value = undefined;
				this.text = undefined;
				return;
			}
			
			var item = this.listData[index];
			
			this.index = index;
			this.text = item.text;
			this.value = item.value;
		},
		
		_renderItemClass: function () {
			var currentSelector = '[data-value=' + this.value + ']';
			
			this.$wrap.find('.' + CLASS_ITEM_CURRENT).removeClass(CLASS_ITEM_CURRENT);
			var $itemCurrent = this.$list.find(currentSelector);
			$itemCurrent.addClass(CLASS_ITEM_CURRENT);
		},
		
		_renderText: function () {
			var $button = this.$button;
			
			if (this.text === undefined) {
				$button.text(this.placeholder);
			} else {
				$button.text(this.text)
			}
		},
		
		_closePop: function () {
			this.$pop.hide();
			$(document).off('click.' + this.widgetKey);
			
			this.$wrap.removeClass(CLASS_WRAP_OPEN);
			
			this.isPopShow = false;
		},
		
		_clearInputText: function () {
			//IE8 上如果重置操作会导致下一次输入有问题，所以不清空
			if (!browser.isIE8) {
				this.$input.val('');
			}
		},
		
		_clean: function () {
			this.value = undefined;
			this.text = undefined;
			this.index = undefined;
			
			this._renderText();
			
			this.$wrap.find('.' + CLASS_ITEM_CURRENT).removeClass(CLASS_ITEM_CURRENT);
			this.$clean.hide();
		},
		
		setOptions: function (list) {
			this.listData = $.extend(true, [], list);
			
			var arr = _.map(list, function (item, index) {
				return '<li class="wd-search-item" data-value="' +
					item.value +
					'" data-index="' +
					index +
					'">' +
					item.text +
					'</li>'
			});
			
			this.$list.html(arr);
			
			this._renderItemClass();
			this._renderText();
		},
		
		setValue: function (value) {
			if (value === undefined) {
				this._clean();
				return;
			}
			
			var index = _.findIndex(this.listData, function (item) {
				return item.value === value;
			});
			
			this._setValueAndTextAndIndex(index);
			this._renderItemClass();
			this._renderText();
			this.$clean.show();
		},
		
		getValue: function () {
			return this.value;
		}
	});
	
    return Search;
});