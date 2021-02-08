/**
 * @file treeChoose
 * @author Tang Chao
 */


define([
    'jquery',
	'tree',
	'underscore',
	'../util/browser',
	'text!./treeChoose.ejs'
], function(
    $,
    Tree,
    _,
    browser,
    htmlTreeChoose
) {
	var key = 0;
	
	var CLASS_WRAP = 'wd-tree-choose-wrap';
	var CLASS_WRAP_OPEN = 'wd-tree-choose-wrap-open';
	var CLASS_BUTTON = 'wd-tree-choose-view-button';
	var CLASS_POP = 'wd-tree-choose-pop';
	var CLASS_INPUT = 'wd-tree-choose-input';
	var CLASS_LIST = 'wd-tree-choose-list';
	var CLASS_FOOTER = 'wd-tree-choose-footer';
	var CLASS_SUBMIT = 'wd-tree-choose-submit';
	var CLASS_CANCEL = 'wd-tree-choose-cancel';
	
	var CLASS_SEARCH_TARGET = 'wd-tree-choose-search-target';
	var CLASS_CHECKBOX_TEXT = 'wd-tree-checkbox-item-text';
	var CLASS_SELECT = 'wd-tree-select-item';
	var CLASS_NORMAL_TEXT = 'wd-tree-item-text';
	
	var CLASS_ITEM_OPEN = 'wd-tree-item-toggle-open';
	var CLASS_ITEM_CLOSE = 'wd-tree-item-toggle-close';
	
	var CLASS_TREE_LIST = 'wd-tree-item-list';
	
    function TreeChoose(options) {
	    var defaultOptions = {
	    	type: 'select',
		    className: '',
		    placeholder: '请选择',
		    onChange: $.noop,
		    selectableList: [],
		    valueKey: 'id'
	    };
	
	    this.options = $.extend(true, {}, defaultOptions, options);
	    
	    this._init();
    }
    
    $.extend(TreeChoose.prototype, {
	    _init: function () {
	    	var thisOptions = this.options;
		    this.$node = $(thisOptions.node);
		    this.type = thisOptions.type;
		    
		    this.value = undefined;
		    this.text = undefined;
		    this.widgetKey = 'tree-choose' + key;
		    this.tree = null;
		    this.cacheValue = null;
		    this.treeData = $.extend(true, [], thisOptions.treeData);
		    this.isIe8ClearInput = 'before';
		
		    key++;
		
		    var $html = $(htmlTreeChoose);
		    var $wrap = this.$wrap = $html.filter('.' + CLASS_WRAP);
		    var $button = this.$button = $wrap.find('.' + CLASS_BUTTON);
		    this.$pop = $wrap.find('.' + CLASS_POP);
		    this.$input = $wrap.find('.' + CLASS_INPUT);
		    this.$list = $wrap.find('.' + CLASS_LIST);
		    var $submit = this.$submit = $wrap.find('.' + CLASS_SUBMIT);
		    var $cancel = this.$cancel = $wrap.find('.' + CLASS_CANCEL);
		    var that = this;
		
		    $button.click(function (e) { that._onButtonClick(e); });
		    $submit.click(function (e) { that._handleSubmit(e); });
		    $cancel.click(function (e) { that._handleCancel(e); });
		
		    this._renderText();
		    this._bindInputInput();
		
		    this.$node.after($html);
	    },
	    
	    _renderSelect: function () {
	    	var that = this;
		    this.tree = new Tree({
			    node: this.$list.get(0),
			    type: 'select',
			    data: this.treeData,
			    selectableList: this.options.selectableList,
			    valueKey: this.options.valueKey,
			    onSelect: function (item, value) {
				    that.text = item.title;
				    that.cacheValue = value;
				    
				    //延迟 50 毫秒关闭，能感受到选中的效果
				    setTimeout(function () {
					    that._renderText();
					    that._closePop();
					    that.options.onChange(value);
				    }, 50);
			    }
		    });
		
		    this.$wrap.find('.' + CLASS_FOOTER).hide();
		    this.cacheValue = this.tree.getSelectValue();
	    },
	    
	    _renderCheckbox: function () {
		    this.tree = new Tree({
			    node: this.$list.get(0),
			    type: 'checkbox',
			    data: this.treeData,
			    valueKey: this.options.valueKey
		    });
		    
		    this.cacheValue = this.tree.getCheckValue();
	    },
	
	    _renderText: function () {
		    var $button = this.$button;
		
		    if (this.text === undefined) {
			    $button.text(this.options.placeholder);
		    } else {
			    $button.text(this.text);
		    }
	    },
	
	    _bindInputInput: function () {
		    var that = this;
		    var $input = this.$input;
		
		    //判断是否是 ie8
		    if ('oninput' in $input.get(0)) {
			    $input.on('input', function () {
				    that._scrollToSearch(that.$input.val());
			    })
		    } else {
			    $input.on('propertychange', function () {
				
				    // ie8 每次打开弹窗 clearInput 时也会触发，所以要判断一下状态一下。
				    console.log(that.isIe8ClearInput);
				    if (that.isIe8ClearInput === 'after') {
					    that._scrollToSearch(that.$input.val());
				    }
			    })
		    }
	    },
	    
	    _scrollToSearch: function (text) {
	    	if (this.$itemTexts === undefined) {
	    		return;
		    }
	    	
		    var index;
		
	    	
	    	_.each(this.searchTextList, function (item, i) {
			    var hasText = item.search(text) !== -1;
			
			    if (hasText && text !== '') {
				    index = i;
				    return false;
			    }
		    });
		    
		    if (index === undefined) {
		    	return;
		    }
		    
		    var $textCurrentItem = $(this.$itemTexts.get(index));
		    
		    this._setSearchStatus($textCurrentItem);
		    
		    var listTop = this.$list.offset().top;
		    var itemTop = $textCurrentItem.offset().top;
		    var scrollTop = this.$list.scrollTop();
		    
		    var scrollTo = itemTop - listTop + scrollTop;
		    
		    this.$list.scrollTop(scrollTo);
	    },
	    
	    _clearOldSearchTarget: function () {
		    this.$list.find('.' + CLASS_SEARCH_TARGET).removeClass(CLASS_SEARCH_TARGET);
	    },
	    
	    _setSearchStatus: function ($textCurrentItem) {
		    this._clearOldSearchTarget();
		    var $parentsLists = $textCurrentItem.parents('.' + CLASS_TREE_LIST);
		    $parentsLists
			    .siblings()
			    .children('a')
			    .addClass(CLASS_ITEM_OPEN)
			    .removeClass(CLASS_ITEM_CLOSE);
		    $textCurrentItem.addClass(CLASS_SEARCH_TARGET);
		    $parentsLists.show();
	    },
	
	    _onButtonClick: function (e) {
		    this._openPop();
		    this.$input.focus();
		    this._clearOldSearchTarget();
		    e.stopPropagation();
	    },
	
	    _clearInputText: function () {
	    	//IE8 上如果重置操作会导致下一次输入有问题，所以不清空
	    	if (!browser.isIE8) {
			    this.$input.val('');
		    }
	    },
	    
	    _handleCancel: function () {
	    	var flagValue = _.flatten(this.cacheValue);
		    this.tree.setCheckValue(flagValue);
		    this._closePop();
	    },
	    
	    _handleSubmit: function () {
		    var tree = this.tree;
		
		    this.cacheValue = tree.getCheckValue();
		    this._setTextWhenTypeCheckbox();
		    this._renderText();
		    this.options.onChange(this.cacheValue);
		    this._closePop();
	    },
	
	    setOptions: function (list) {
		    if (this.tree) {
			    throw new Error('暂时没有做多次 setOption 的功能')
		    }
	    	
	    	var type = this.options.type;
		    
		    this.treeData = list;
		
		    if (type === 'select') {
			    this._renderSelect();
			    this.$itemTexts = this.$wrap.find('.' + CLASS_SELECT + ', .' + CLASS_NORMAL_TEXT);
		    } else if (type === 'checkbox') {
			    this._renderCheckbox();
			    this.$itemTexts = this.$wrap.find('.' + CLASS_CHECKBOX_TEXT);
		    }
		    
		    this.searchTextList = this.$itemTexts.map(function (i, item) {
			    return $(item).text();
		    });
	    },
	
	    _openPop: function () {
		    var that = this;
		    this.isIe8ClearInput = 'before';
		    this._clearInputText();
		    this.isIe8ClearInput = 'after';
		    this.$pop.show();
		
		    $(document).on('click.' + this.widgetKey, function(event) {
		    	var $wrap = $(event.target).parents('.' + CLASS_WRAP_OPEN);
		    	
		    	if ($wrap.size() === 0) {
				    that._closePop();
			    }
			    
			    event.stopPropagation();
		    });
		
		    this.$wrap.addClass(CLASS_WRAP_OPEN);
		    this.isPopShow = true;
	    },
	
	    _closePop: function () {
		    this.$pop.hide();
		    
		    //销毁事件
		    $(document).off('click.' + this.widgetKey);
		
		    this.$wrap.removeClass(CLASS_WRAP_OPEN);
		
		    this.isPopShow = false;
	    },
	    
	    _setTextWhenTypeCheckbox: function () {
		    var list = this.cacheValue;
		    var count = 0;
		    
		    _.each(list, function (sunList) {
			    count += sunList.length;
		    });
		    
		    this.text = '已选择 ' + count + ' 项';
	    },
	
	    _setTextWhenTypeSelect: function () {
		    var filterSelector = '[data-value=' + this.cacheValue + ']';
		    this.text = this.$itemTexts.filter(filterSelector).text();
	    },
	    
	    setValue: function (value) {
		    var type = this.type;
		    var tree = this.tree;
		    
		    if (type === 'select') {
			    tree.setSelectValue(value);
			    this.cacheValue = tree.getSelectValue();
			    this._setTextWhenTypeSelect();
		    } else {
		    	//如果传入的是多层的数组，把它压扁
			    tree.setCheckValue(_.flatten(value));
			    this.cacheValue = tree.getCheckValue();
			    this._setTextWhenTypeCheckbox();
		    }
		    
		    this._renderText()
	    },
	    
	    getValue: function () {
		    return this.cacheValue;
	    }
    });
	
	return TreeChoose;
});