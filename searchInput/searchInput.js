define([
    'jquery',
    '../util/getScreenOffset',
    '../util/manualFadeIn',
    'css!./searchInput.css'
], function (
    $,
    getScreenOffset,
    manualFadeIn
) {
    var $window = $(window);
    var $doc = $(document);
    var $body = $('body');
    var searchList;

    function SearchList() {
        this.$searchList = $('<ul class="search-input-list"></ul>');
        this.$input = null;
        this.$items = null;
        this.index = 0;
        this.list = [];
        this.isShow = false;

        this._init();
    }

    $.extend(SearchList.prototype, {
        _init: function () {
            var that = this;
            var $searchList = this.$searchList;

            $body.append($searchList);

            $searchList
                .on('click', '.search-input-item', function (event) {
                    that._handleClickItem(event);
                })
        },

        _close: function () {
            this.isShow = false;
            this.list = [];
            this.$items = null;
            this.$searchList.hide();
        },

        _renderAndOpenSearchList: function (list, $target) {
        	var that = this;
            var length = list.length;
            this.list = list;
            this.$input = $target;
	
	        if (length > 0) {
		        this._refresh();
		        this._setPosition();
	        } else {
		        this._close();
	        }
        },

        _refresh: function () {
            var list = this.list;
            var arr;
            var html;

            arr = $.map(list, function (item, i) {
                var liClassName = 'search-input-item';

                if (i === 0) {
                    liClassName += ' search-input-item-current';
                }

                return '<li class="' + liClassName + '" ' + 'data-index="' + i + '">' + item + '</li>';
            });

            html = arr.join('');

            this.index = 0;
            this.$searchList.html(html);
        },

        _setPosition: function () {
            var that = this;
            var $searchList = this.$searchList;
            var $target = this.$input;

            var targetWidth = $target.outerWidth();
            $searchList.css('width', targetWidth - 2 + 'px');

            manualFadeIn($searchList, 0, function () {
                var listHeight = $searchList.outerHeight();

                var targetOffset = $target.offset();
                var targetTop = targetOffset.top;
                var targetLeft = targetOffset.left;
                var targetHeight = $target.outerHeight();

                var windowScrollTop = $window.scrollTop();
                var screenHeight = $window.height();

                var isTooBottom = targetTop + targetHeight + listHeight - windowScrollTop > screenHeight;
                var top = isTooBottom ? (targetTop - listHeight) : (targetTop + targetHeight);

                that.isShow = true;
                $searchList.css({
                    top: top + 'px',
                    left: targetLeft + 'px'
                });
            })
        },
	    
	    _handleKeyDown: function(event, refreshCallback) {
        	var that = this;
		    var keyCode = event.keyCode;
		    var $target = $(event.target);
		    var isEnter = keyCode === 13;
		    var isUp = keyCode === 38;
		    var isDown = keyCode === 40;
		    var isTab = keyCode === 9;
		    
		    if (isEnter) {
			    this._handleEnter(event);
		    } else if (isUp || isDown) {
			    event.preventDefault();
			    this._handleMoveUpOrDown(isUp);
		    } else if (isTab) {
		    	this._close();
		    } else {
			    //解决中文输入法的问题
			    setTimeout(function () {
				    var text = $target.val();
				    var cbVal = refreshCallback(text);
				
				    if ( cbVal && $.isFunction(cbVal.then) ) {
					    cbVal.then(function (list) {
						    that._renderAndOpenSearchList(list, $target);
					    })
				    } else if ( $.isArray(cbVal) ) {
					    that._renderAndOpenSearchList(cbVal, $target);
				    }
			    });
		    }
	    },
	
	    _handleMoveUpOrDown: function (isUp) {
		    var $searchList = this.$searchList;
		    var index = this.index;
		    var currentClass = 'search-input-item-current';
		    var $items;
		    var length;
		    var newIndex;
		    var $oldItem;
		    var $newItem;
		
		    if (!this.isShow) {
			    return;
		    }
		
		    if (this.$items === null) {
			    this.$items = $searchList.find('.search-input-item');
		    }
		
		    $items = this.$items;
		    length = $items.length;
		
		    if (isUp) {
			    if (index === 0) {
				    newIndex = length - 1;
			    } else {
				    newIndex = index - 1;
			    }
		    } else {
			    if (index === length - 1) {
				    newIndex = 0;
			    } else {
				    newIndex = index + 1;
			    }
		    }
		
		    $oldItem = $($items[index]);
		    $newItem = $($items[newIndex]);
		
		    this.index = newIndex;
		    $oldItem.removeClass(currentClass);
		    $newItem.addClass(currentClass);
	    },
	    
	    _handleEnter: function(event) {
        	var isShow = this.isShow;
        	
		    if (isShow) {
		    	//只有在模糊搜索框的情况下，才阻止默认事件，否则还是进行应有的事件，比如表单提交
			    event.preventDefault();
			    this._updateInput();
		    }
	    },
	
	    _handleClickItem: function (event) {
        	var $target = $(event.target);
        	var index = $target.data('index');
        	this.index = index - 0;
        	
		    this._updateInput();
	    },
	
	    _updateInput: function () {
		    var list = this.list;
		    var index = this.index;
		    var val = list[index];
		
		    this.$input.val(val);
		    this._close();
	    }
    });

    $doc.on('click', function (event) {
        var $target = $(event.target);
        var isNotSearchItem = !$target.hasClass('search-input-item');
        
        if (isNotSearchItem && searchList) {
	        searchList._close();
        }
    });

    function init(options) {
        var selector = options.selector;
        var refreshCallback = options.refreshCallback;
        
        if (!searchList) {
	        searchList = new SearchList();
        }

        $doc.on('keydown', selector, function (event) {
	        searchList._handleKeyDown(event, refreshCallback);
        });
    }
    
    return {
        init: init
    }
});