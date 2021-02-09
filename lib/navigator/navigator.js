/**
 * @file navigator
 * @author Tang Chao
 */


define([
    'jquery',
	'underscore',
	'ejs',
	'store',
	'../util/browser',
	'../util/renderEjs',
	'text!./navigator.ejs',
	'json3'
], function(
    $,
    _,
    ejs,
    renderEjs,
    store,
    browser,
    ejsNavigator
) {
	
	var CLASS_LIST = 'wd-navigator-list';
	var CLASS_ITEM = 'wd-navigator-item';
	var CLASS_CLOSE = 'wd-navigator-close';
	var CLASS_CURRENT = 'wd-navigator-item-current';
	var CLASS_WRAP = 'wd-navigator-list-wrap';
	var CLASS_LEFT = 'wd-navigator-left';
	var CLASS_RIGHT = 'wd-navigator-right';
	
    function Navigator(options) {
	    var defaultOptions = {
		    allList: [],
		    storeListKey: 'store-wd-navigator-list'
	    };
	
	    this.options = $.extend(true, {}, defaultOptions, options);
	    
	    this._init();
    }
    
    $.extend(Navigator.prototype, {
    	_init: function () {
    		var that = this;
    		this.allList = this.options.allList;
		    this.$node = $(this.options.node);
		    this.storeListKey = this.options.storeListKey;
		    var $root = this.$root = $(ejsNavigator);
		    this.$left = $root.find('.' + CLASS_LEFT);
		    this.$right = $root.find('.' + CLASS_RIGHT);
		    this.$listWrap = $root.find('.' + CLASS_WRAP);
		    this.$list = this.$listWrap.find('.' + CLASS_LIST);
		    this.$allItems = null;
		    
		    var str = store.get(this.storeListKey);
		    
		    this.animateTime = browser.isIE8 ? 400 : 300;
		    this.list = str !== undefined ? JSON.parse(str) : [];
		    this.isMoving = false;
		    
		    this.$list.on('click', '.' + CLASS_CLOSE, function (event) {
			    that._handleClose(event, $(this))
		    });
		
		    this.$left.click(function () {
			    that._scrollLeft();
		    });
		    
		    this.$right.click(function () {
			    that._scrollRight();
		    });
		    
		    
		    this._renderList();
		
		    this.$node.append($root);
	    },
	    
	    _handleClose: function (event, $thisClose) {
		    //阻止事件冒泡, 避免发生跳转
		    event.stopPropagation();
		    var length = this.list.length;
		
		    if (length === 1) {
			    return;
		    }
		    
		    var index = $thisClose.attr('data-index') - 0;
		    var $li = $thisClose.parent();
		    var isCurrent = $li.hasClass(CLASS_CURRENT);
		    var nextCurrentIndex;
		    var nextValue;
		
		    this.list.splice(index, 1);
		    store.set(this.storeListKey, JSON.stringify(this.list));
		    
		    //如果是自己被关闭，则不用操作 dom 了，直接跳转
		    if (!isCurrent) {
			    $li.remove();
			    this._refreshItems();
			    
			    this.$allItems.each(function (i, item) {
			    	var $close;
			    	var $item;
			    	var newIndex;
			    	
				    if (i >= index) {
					    $item = $(item);
					    newIndex = $item.attr('data-index') - 1;
					    $close = $item.find('.' + CLASS_CLOSE);
					    $item.attr('data-index', newIndex);
					    $close.attr('data-index', newIndex);
				    }
			    });
			    
			    return;
		    }
		
		    //最后一个则选择上一个，否则选择下一个，和谷歌浏览器标签逻辑一致
		    if (index === length - 1) {
			    nextCurrentIndex = index - 1;
		    } else {
			    //因为要删掉后要进一位，所以不用 + 1
			    nextCurrentIndex = index;
		    }
		    
		    nextValue = this.list[nextCurrentIndex].value;
		
		    //跳转
		    window.location.href = nextValue;
	    },
	
	    _scrollToItem: function ($current) {
    		var $listWrap = this.$listWrap;
    		var $list = this.$list;
		    var currentOffsetLeft = $current.offset().left;
		    var listWrapOffsetLeft = $listWrap.offset().left;
		    var listWrapWidth = $listWrap.width();
		    var listWidth = $list.width();
		    var itemWidth = $current.outerWidth();
		    
		    var wrapLeft2CurrentRight = currentOffsetLeft + itemWidth - listWrapOffsetLeft;
		    // var wrapLeft2CurrentLeft = listWrapOffsetLeft - currentOffsetLeft;
		    
		    //17是因为后面可能会出现滚动条
		    var move = listWrapWidth - wrapLeft2CurrentRight - 17;
		
		    if (listWidth <= listWrapWidth) {
			    return;
		    }
		    
		    if (move < 0) {
			    //元素在区域右边,scrollTo 时只用考虑这种情况
			    $list.css({
				    left: move + 'px'
			    });
		    }
		    
		    // else if (wrapLeft2CurrentLeft < 0) {
		    // 	//元素在区域左边
			 //    $list.animate({
				//     left: wrapLeft2CurrentLeft + 'px'
			 //    }, this.animateTime);
		    // }
	    },
	
	    _scrollLeft: function () {
    		if (this.isMoving) {
    			return;
		    }
    		
		    var $list = this.$list;
		    var positionLeft = $list.css('left');
		    var positionLeftNumber;
		    
		    if (positionLeft === undefined || positionLeft === '0') {
			    return;
		    }
		    
		    positionLeftNumber = parseInt(positionLeft);
		    
		    if (positionLeftNumber > -300) {
			    this._moveToLeft(0);
		    } else {
			    this._moveToLeft(positionLeftNumber + 300);
		    }
	    },
	    
	    _scrollRight: function () {
    		if (this.isMoving) {
    			return;
		    }
    		
    		var $listWrap = this.$listWrap;
		    var $list = this.$list;
		    var positionLeft = $list.css('left');
		    var listWrapWidth = $listWrap.width();
		    var listWidth = $list.width();
		    var positionLeftNumber;
		
		    if (listWidth <= listWrapWidth) {
		    	return;
		    }
		
		    positionLeftNumber = parseInt(positionLeft);
		
		    var widthDeffer = listWidth - listWrapWidth;
		    var rightOutWidth = widthDeffer + positionLeftNumber;
		    
		    if (rightOutWidth > 300) {
			    this._moveToLeft(positionLeftNumber - 300);
		    } else {
			    //担心移动后，又出现滚动条
		    	this._moveToLeft(- widthDeffer - 17);
		    }
	    },
	
	    _moveToLeft: function (left) {
    		var that = this;
		    this.isMoving = true;
		
		    this.$list.animate({
			    left: left + 'px'
		    }, this.animateTime, function () {
			    that.isMoving = false;
		    })
	    },
	
	    _refreshItems: function () {
		    var width = 0;
		    
		    this.$allItems = this.$list.find('.' + CLASS_ITEM);
		    this.$allItems.each(function (i, item) {
			    width += $(item).outerWidth();
			    width += 6;
			    
			    if (browser.isIE8) {
			    	width += 1;
			    }
		    });
		
		    this.$list.css('width', width + 'px');
	    },
	    
	    _createItemHtml: function (item, i) {
		    return '<li class="wd-navigator-item" data-index="' +
			    i +
			    '">' +
			    '<a class="wd-navigator-close" data-index="' +
			    i +
			    '"></a>' +
			    '<a class="wd-navigator-item-link" href="' +
		        item.value +
		        '">' +
			    item.text +
			    '</a>' +
			    '</li>';
	    },
	
	    _renderList: function () {
		    var itemsHtml = _.map(this.list, this._createItemHtml);
		    this.$list.html(itemsHtml);
	    },
	    
	    setCurrentStatus: function (value) {
		    var list = this.list;
		    var oldLength = list.length;
		    var index;
		    var newItemHtml;
		    var newItem;
		    var valueIndex = _.findIndex(list, function (item) {
			    return item.value === value;
		    });
		
		    if (valueIndex === -1) {
			    newItem = _.find(this.allList, function (allListItem) {
				    return allListItem.value === value;
			    });
			
			    index = oldLength;
			    
			    if (newItem === undefined) {
			    	return;
			    }
			    
			    newItemHtml = this._createItemHtml(newItem, index);
			    
			    this.list.push(newItem);
			    store.set(this.storeListKey, JSON.stringify(this.list));
			    this.$list.append(newItemHtml);
			    
		    } else {
			    index = valueIndex;
		    }
		
		    this._refreshItems();
		    
		    var $current = this.$allItems.filter('[data-index=' + index + ']');
		    
		    $current.addClass(CLASS_CURRENT);
		    this._scrollToItem($current);
	    }
    });
    
    return Navigator;
});