/**
 * @file searchSuper
 * @author Tang Chao
 */


define([
	'text!./searchSuper.ejs',
	'jquery',
	'store',
	'../util/browser',
	'underscore',
	'json3'
], function(
	html,
	$,
	store,
	browser,
	_
) {
	var key = 0;
	
	var CLASS_WRAP = 'wd-search-super-wrap';
	var CLASS_WRAP_OPEN = 'wd-search-super-wrap-open';
	var CLASS_BUTTON = 'wd-search-super-view-button';
	var CLASS_CLEAN = 'wd-search-super-view-clean';
	var CLASS_POP = 'wd-search-super-pop';
	var CLASS_INPUT = 'wd-search-super-input';
	var CLASS_LIST = 'wd-search-super-list';
	var CLASS_ITEM = 'wd-search-super-item';
	var CLASS_ITEM_CURRENT = 'wd-search-super-item-current';
	
	var CLASS_HISTORY = 'wd-search-super-history';
	var CLASS_HISTORY_NO_DATA = 'wd-search-super-history-no-data';
	var CLASS_HISTORY_CLEAN_ALL = 'wd-search-super-history-head-clean-all';
	var CLASS_HISTORY_ITEM_REMOVE = 'wd-search-super-history-item-remove';
	var CLASS_HISTORY_ITEM = 'wd-search-super-history-item';
	var CLASS_HISTORY_ITEM_CURRENT = 'wd-search-super-history-item-current';
	var CLASS_HISTORY_LIST = 'wd-search-super-history-list';
	
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
	function SearchSuper(options) {
		this.node = options.node;
		this.placeholder = options.placeholder ? options.placeholder : '请选择';
		this.width = options.width;
		this.height = options.height;
		this.onChange = options.onChange ? options.onChange : $.noop;
		this.onSearch = options.onSearch ? options.onSearch : $.noop;
		this.cleanShouldTriggerOnChange = options.cleanShouldTriggerOnChange === undefined ? false : options.cleanShouldTriggerOnChange;
		this.className = options.className === undefined ? undefined : options.className;
		this.storeKey = options.storeKey;
		
		this._init();
	}
	
	$.extend(SearchSuper.prototype, {
		_init: function () {
			this.value = undefined;
			this.text = undefined;
			this.index = undefined;
			this.isPopShow = false;
			this.type = undefined;
			this.listData = [];
			
			this.widgetKey = 'search' + key;
			key++;
			
			var $html = $(html);
			var $wrap = this.$wrap = $html.filter('.' + CLASS_WRAP);
			var $button = this.$button = $wrap.find('.' + CLASS_BUTTON);
			var $pop = this.$pop = $wrap.find('.' + CLASS_POP);
			this.$input = $wrap.find('.' + CLASS_INPUT);
			var $list = this.$list = $wrap.find('.' + CLASS_LIST);
			var $history = this.$history = $wrap.find('.' + CLASS_HISTORY);
			var $historyList = this.$historyList = $wrap.find('.' + CLASS_HISTORY_LIST);
			this.$historyNoData = $wrap.find('.' + CLASS_HISTORY_NO_DATA);
			var $historyCleanAll = this.$historyCleanAll = $wrap.find('.' + CLASS_HISTORY_CLEAN_ALL);
			var $clean = this.$clean = $wrap.find('.' + CLASS_CLEAN);
			
			if (this.className) {
				_.each(this.className.split(' '), function (classItem) {
					$wrap.addClass(classItem);
				})
			}
			
			this._refreshHistoryOptions();
			
			$list.hide();
			$history.show();
			
			//事件要用时注意，用这样的方式传递 this
			var that = this;
			$button.click(function (e) { that._onButtonClick(e); });
			$clean.click(function () {
				that._clean();
				
				if (that.cleanShouldTriggerOnChange) {
					that.onChange(undefined, undefined, undefined);
				}
			});
			$historyCleanAll.click(function () {
				store.set(that.storeKey, '[]');
				that._refreshHistoryOptions();
			});
			$pop.on('click', function (e) { that._onPopClick(e); });
			$historyList.on('click', '.' + CLASS_HISTORY_ITEM_REMOVE, function (event) {
				event.stopPropagation();
				that._removeHistoryItem($(this));
			});
			$historyList.on('click', '.' + CLASS_HISTORY_ITEM, function (event) {
				event.stopPropagation();
				that._onHistoryItemClick($(this));
			});
			
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
					that._changeOrSearch();
				})
			} else {
				$input.on('propertychange', function () {
					
					// ie8 每次打开弹窗 clearInput 时也会触发，所以要判断一下状态一下。
					console.log(that.isIe8ClearInput);
					if (that.isIe8ClearInput === 'after') {
						that._changeOrSearch();
					}
				})
			}
		},
		
		_changeOrSearch: function () {
			var val = this.$input.val();
			
			if (val === '') {
				this.$list.hide();
				this.setOptions([]);
				this.$history.show();
			} else {
				this.$history.hide();
				this.$list.show();
			}
			
			this.onSearch(val);
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
				that._handleCloseByNoChoose();
			});
			
			//打开均显示历史
			this.$list.hide();
			this.$history.show();
			
			this._renderHistoryItemClass();
			
			this.$wrap.addClass(CLASS_WRAP_OPEN);
			this.isPopShow = true;
		},
		
		_handleCloseByNoChoose: function () {
			var that = this;
			var val = that.$input.val();
			
			//有输入时才控制触发
			if (val !== '') {
				that.type = 'input';
				that.text = val;
				that.value = val;
				that._renderText();
				this.$clean.show();
				this.onChange(val, val, that.type);
			}
		},
		
		_handleOptionClick: function ($target) {
			var index = $target.attr('data-index');
			var oldValue = this.value;
			
			this.type = 'select';
			
			this._setValueAndTextAndIndex(index);
			var newValue = this.value;
			
			this._renderItemClass();
			this._renderText();
			this._closePop();
			this.$clean.show();
			
			if (oldValue !== newValue) {
				this.onChange(this.value, this.text, this.type);
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
			
			this.$wrap.find('.' + CLASS_ITEM_CURRENT).removeClass(CLASS_ITEM_CURRENT);
			
			var $items = this.$list.find('li');
			
			if (this.type !== 'select') {
				return;
			}
			
			var value = this.value;
			
			$items.each(function (i, item) {
				var $item = $(item);
				
				if ($item.attr('data-value') === value) {
					$item.addClass(CLASS_ITEM_CURRENT);
					return false;
				}
			});
		},
		
		_renderHistoryItemClass: function () {
			var value = this.value;
			var type = this.type;
			this.$wrap.find('.' + CLASS_HISTORY_ITEM_CURRENT).removeClass(CLASS_HISTORY_ITEM_CURRENT);
			
			var $items = this.$historyList.find('li');
			
			$items.each(function (i, item) {
				var $item = $(item);
				
				if ($item.attr('data-value') === value && $item.attr('data-type') === type) {
					$item.addClass(CLASS_HISTORY_ITEM_CURRENT);
					return false;
				}
			});
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
			
			this.$list.hide();
			this.$history.show();
			this.type = undefined;
			
			this._removeAllCurrentClass();
			
			this.$clean.hide();
		},
		
		_onHistoryItemClick: function ($item) {
			var oldValue = this.value;
			
			this.value = $item.attr('data-value');
			this.text = $item.find('span').text();
			this.type = $item.attr('data-type');
			
			this._removeAllCurrentClass();
			$item.addClass(CLASS_HISTORY_ITEM_CURRENT);
			
			this._renderText();
			this._closePop();
			this.$clean.show();
			
			var newValue = this.value;
			
			if (oldValue !== newValue) {
				this.onChange(this.value, this.text, this.type);
			}
		},
		
		_removeAllCurrentClass: function () {
			this.$wrap.find('.' + CLASS_ITEM_CURRENT).removeClass(CLASS_ITEM_CURRENT);
			this.$wrap.find('.' + CLASS_HISTORY_ITEM_CURRENT).removeClass(CLASS_HISTORY_ITEM_CURRENT);
			
		},
		
		_removeHistoryItem: function ($target) {
			var index = $target.attr('data-index') - 0;
			
			try {
				var historyData = JSON.parse(store.get(this.storeKey));
			} catch(e) {
				console.log(store.get(this.storeKey));
			}
			
			
			historyData.splice(index, 1);
			store.set(this.storeKey, JSON.stringify(historyData));
			this._refreshHistoryOptions();
		},
		
		_refreshHistoryOptions: function () {
			
			var storeValue = store.get(this.storeKey);
			var historyData;
			
			if (storeValue === undefined) {
				store.set(this.storeKey, '[]');
				historyData = [];
			} else {
				historyData = JSON.parse(storeValue);
			}
			
			if (historyData.length === 0) {
				this.$historyNoData.show();
				this.$historyList.hide();
			} else {
				this.$historyNoData.hide();
				this.$historyList.show();
			}
			
			var arr = _.map(historyData, function (item, index) {
				return '<li class="wd-search-super-history-item" data-value="' +
					item.value +
					'" data-index="' +
					index +
					'" data-type="' +
					item.type +
					'"><span class="wd-search-super-history-item-text">' +
					item.text +
					'</span><a class="wd-search-super-history-item-remove" data-index="' +
					index +
					'"></a>' +
					'</li>'
			});
			
			this.$historyList.html(arr);
			
			this._renderHistoryItemClass();
		},
		
		addHistory: function (item) {
			var historyData = JSON.parse(store.get(this.storeKey));
			var index = _.findIndex(historyData, function (el) {
				return el.value === item.value && el.type === item.type;
			});
			
			if (index !== -1) {
				return;
			}
			
			var newLength = historyData.unshift(item);
			console.log(historyData);
			
			if (newLength > 10) {
				historyData.splice(10, 1);
			}
			
			store.set(this.storeKey, JSON.stringify(historyData));
			
			this._refreshHistoryOptions();
			
		},
		
		setOptions: function (list) {
			this.listData = $.extend(true, [], list);
			
			var arr = _.map(list, function (item, index) {
				return '<li class="wd-search-super-item" data-value="' +
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
		
		getInfo: function () {
			return {
				value: this.value,
				text: this.text,
				type: this.type
			}
		},
		
		reset: function () {
			this._clean();
		}
		
		// setValue: function (value) {
		// 	if (value === undefined) {
		// 		this._clean();
		// 		return;
		// 	}
		//
		// 	var index = _.findIndex(this.listData, function (item) {
		// 		return item.value === value;
		// 	});
		//
		// 	this._setValueAndTextAndIndex(index);
		// 	this._renderItemClass();
		// 	this._renderText();
		// 	this.$clean.show();
		// },
		
		// getValue: function () {
		// 	return this.value;
		// }
	});
	
	return SearchSuper;
});