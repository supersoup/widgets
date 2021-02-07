/**
 * @file tabs
 * @author Tang Chao
 */


define([
    'jquery',
	'underscore',
	'ejs',
	'util/browser',
	'text!./tabs/tabs-dropdown.ejs'
], function(
    $,
    _,
    ejs,
    browser,
    ejsDropDown
) {
	var CLASS_DROPDOWN_OPACITY = 'wd-tabs-dropdown-opacity';
	var CLASS_DROPDOWN_BUTTON = 'wd-tabs-dropdown-button';
	var CLASS_DROPDOWN_BUTTON_CURRENT = 'wd-tabs-dropdown-button-current';
	
    function Tabs(options) {
    	this.list = options.list;
    	this.dropDownCol = options.dropDownCol !== undefined ? options.dropDownCol : 3;
    	this.currentShouldFirst = !!options.currentShouldFirst;
    	this.currentClassName = options.currentClassName;
    	
    	this._init()
    }
    
    $.extend(Tabs.prototype, {
    	_init: function () {
    		var that = this;
    		this.animateTime = browser.isIE8 ? 0 : 300;
    		this.hasJudgeTooMany = false;
    		this.isTooMany = false;
		    
		    this.tabList$ = _.map(this.list, function (item, i) {
		    	var $tab = $(item.tab);
			    
		    	$tab.attr('data-is-first', '1');
		    	$tab.attr('data-index', i);
		    	
		    	$tab.click(function (e) {
		    		var index = $(e.target).attr('data-index') - 0;
				    that.setCurrentIndex(index);
			    });
			    return $tab;
		    });
		
		    this.$tabsWrap = this.tabList$[0].parent().parent();
		    this.$tabsRoot = this.$tabsWrap.parent();
		    
		    this.paneList = _.map(this.list, function (item) {
		    	var $pane = $(item.pane);
		    	$pane.hide();
			    return $pane;
		    });
	    },
	    
	    _showAndHideByIndex: function () {
    		
    		var $shouldShowItem;
    		var index = this.currentIndex;
    		
		    _.each(this.paneList, function ($item, i) {
			    if (i === index) {
				    $shouldShowItem = $item;
			    } else {
			    	$item.hide();
			    }
		    });
		
		    $shouldShowItem.fadeIn(this.animateTime);
	    },
	    
	    _changeClassNameByIndex: function () {
    		var that = this;
    		var index = this.currentIndex;
    		
		    _.each(this.tabList$, function ($item, i) {
			    if (i === index) {
				    $item.addClass(that.currentClassName);
			    } else {
				    $item.removeClass(that.currentClassName);
			    }
		    });
	    },
	    
	    _createMoreDropDown: function () {
    		var that = this;
		    var $doc = $(document);
		    var $body = $('body');
		    var $tabsRoot = this.$tabsRoot;
    		
    		var textList = _.map(this.tabList$, function ($item) {
			    return $item.text();
		    });
		    
    		var html = ejs.render(ejsDropDown, {
			    textList: textList,
			    dropDownCol: this.dropDownCol,
			    currentIndex: this.currentIndex
		    });
		    var $dropdown = this.$dropdown = $('<div class="wd-tabs-dropdown"></div>');
		    var offset = $tabsRoot.offset();
		    $dropdown.addClass(CLASS_DROPDOWN_OPACITY);
		    $dropdown.css('top', offset.top + 48 + 'px');
		    $dropdown.css('left', offset.left + 'px');
		    $dropdown.css('width', $tabsRoot.outerWidth() + 'px');
		
		    $dropdown.html(html);
		    $body.append($dropdown);
		    this._dropdownHide();
		
		    this.$moreButton.click(function (event) {
			    event.stopPropagation();
			    that._dropdownShow();
		    });
		
		    $dropdown.on('click', '.' + CLASS_DROPDOWN_BUTTON, function (event) {
			    event.stopPropagation();
			    //此处 this 指的是点击的元素，不用 event.target 是因为还有更下一层的元素
			    var index = $(this).attr('data-index') - 0;
			    that.setCurrentIndex(index);
			    that._dropdownHide();
		    });
		    
		    $doc.on('click', function () {
			    that._dropdownHide();
		    })
	    },
	    
	    _dropdownShow: function () {
		    var $dropdown = this.$dropdown;
		    
		    $dropdown.removeClass(CLASS_DROPDOWN_OPACITY);
		    $dropdown.slideDown(this.animateTime);
	    },
	
	    _dropdownHide: function () {
    		var $dropdown = this.$dropdown;
    		
		    $dropdown.slideUp(this.animateTime, function () {
			    $dropdown.addClass(CLASS_DROPDOWN_OPACITY);
		    });
	    },
	    
	    _moveCurrentToFirst: function () {
    		var index = this.currentIndex;
		    var $lastInsert = this.tabList$[index].parent();
		    var $tabsWrap = this.$tabsWrap;
		    $tabsWrap.prepend($lastInsert);
		    
		    _.each(this.tabList$, function ($item, i) {
		    	if (index !== i) {
				    var $parent = $item.parent();
				    $lastInsert.after($parent);
				    $lastInsert = $parent;
			    }
		    })
	    },
	    
	    _setDropDownButtonCurrentClass: function () {
		    var $buttons = this.$dropdown.find('.' + CLASS_DROPDOWN_BUTTON);
		    $buttons.removeClass(CLASS_DROPDOWN_BUTTON_CURRENT);
		    $buttons.filter('[data-index=' + this.currentIndex + ']').addClass(CLASS_DROPDOWN_BUTTON_CURRENT)
	    },
	    
	    judgeIsTooMany: function () {
    		if (this.hasJudgeTooMany) {
    			console.log('已经进行过判断，请勿重复调用');
    			return;
		    }
		
		    this.hasJudgeTooMany = true;
    		
		    if (this.$tabsWrap.innerHeight() <= this.$tabsRoot.innerHeight()) {
			    return;
		    }
		
		    this.isTooMany = true;
		    this.$moreButton = $('<a class="wd-tabs-more-button">更多</a>');
		    this.$tabsWrap.append(this.$moreButton);
		    this._createMoreDropDown();
		    this._setDropDownButtonCurrentClass();
	    },
	    
	    setCurrentIndex: function (index) {
    		this.currentIndex = index;
    		
		    this._showAndHideByIndex();
		    this._changeClassNameByIndex();
		    
		    if (this.isTooMany) {
		        this._setDropDownButtonCurrentClass();
		    }
		    
		    if (this.currentShouldFirst) {
		    	this._moveCurrentToFirst();
		    }
		
		    var $tab = this.tabList$[index];
		    var isFirst = $tab.attr('data-is-first') === '1';
		    this.list[index].onEntry(isFirst);
		
		    $tab.attr('data-is-first', '0');
	    }
    });
    
    return Tabs;
});