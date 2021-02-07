/**
 * @file items
 * @author Tang Chao
 */

define([
    'jquery',
	'underscore'
], function(
    $,
    _
) {
	/**
	 *
	 * @param options:
	 * @param options.node 行内元素
	 * @param options.shouldUnique 元素需要唯一
	 * @param options.onRemove {Function} 返回 value, text, index
	 * @constructor
	 */
    function Items(options) {
    	this.node = options.node;
    	this.shouldUnique = !!options.shouldUnique;
    	this.onRemove = options.onRemove ? options.onRemove : $.noop;
		
		this._init();
    }
    
    $.extend(Items.prototype, {
    	_init: function () {
    		var that = this;
    		this.list = [];
		    this.$wrap = $('<ul class="wd-items-list"></ul>');
		    $(this.node).after(this.$wrap);
		    
		    this.$wrap.on('click', '.wd-items-item-close', function (event) {
			    that._handleRemove(event);
		    })
	    },
	    
	    _createItem: function (value, text, index) {
		    var $item = $('<li class="wd-items-item"></li>');
		    var $close = $('<a class="wd-items-item-close"></a>');
		    var $text = $('<span class="wd-items-item-text"></span>');
		    
		    $close.attr('data-index', index);
		    $text.text(text);
		    
		    $item.append($close);
		    $item.append($text);
		    
		    return $item;
	    },
	    
	    _handleRemove: function (event) {
		    var $target = $(event.target);
		    
		    var index = $target.attr('data-index');
		    
		    $target.parent().remove();
		    
		    //所有后面元素标签上的 data-index 要减1
		    this.$wrap.find('.wd-items-item-close').each(function (i, item) {
		    	var $item;
			    
			    if (i >= index) {
				    $item = $(item);
				    $item.attr('data-index', $item.attr('data-index') - 1)
			    }
		    });
		    
		    var el = this.list.splice(index, 1)[0];
    		this.onRemove(el.value, el.text, index);
	    },
	    
	    removeAll: function () {
		    this.$wrap.empty();
		    this.list = [];
	    },
	    
	    addItem: function (item) {
		    var itemIndex = _.find(this.list, function (el) {
			    return el.value === item.value;
		    });
		    
		    if (itemIndex !== undefined && this.shouldUnique) {
		    	return false;
		    }
    		
		    var newIndex = this.list.length;
		    
		    var $item = this._createItem(item.value, item.text, newIndex);
		    
		    this.$wrap.append($item);
		    this.list.push(item);
		    return true;
	    },
	    
	    setValue: function (list) {
    		var that = this;
    		var cloneList = $.extend(true, [], list);
    		
    		this.$wrap.empty();
    		_.each(cloneList, function (item, i) {
    			var $item = that._createItem(item.value, item.text, i);
			    that.$wrap.append($item);
		    });
		    
		    this.list = cloneList;
	    },
	    
	    getValue: function () {
		    return _.map(this.list, function (item) {
			    return item.value;
		    })
	    }
    })
	
	return Items;
});