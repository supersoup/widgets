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
        this.$targetInput = null;
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
                .on('click', 'search-input-item', function (event) {
                    var $target = event.$target;
                    var text = $target.text();

                    that._updateInput();
                })
        },

        close: function () {
            this.isShow = false;
            this.$items = null;
            this.$searchList.hide();
        },

        renderAndOpenSearchList: function (list, $target) {
            var length = list.length;
            this.list = list;
            this.$targetInput = $target;

            if (length > 0) {
                this._refresh();
                this._setPosition();
            } else {
                this.close();
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
            var $target = this.$targetInput;

            var targetWidth = $target.outerWidth();
            $searchList.css('width', targetWidth - 2 + 'px');

            manualFadeIn($searchList, 0, function () {
                var listHeight = $searchList.outerHeight();

                var targetOffset = $target.offset();
                var targetTop = targetOffset.top;
                var targetLeft = targetOffset.left;
                var targetHeight = $target.outerHeight();

                var windowScrollTop = $window.scrollTop();
                var windowScrollLeft = $window.scrollLeft();
                var screenWidth = $window.width();
                var screenHeight = $window.height();

                var isTooBottom = targetTop + targetHeight + listHeight - windowScrollTop > screenHeight;
                var top = isTooBottom ? (targetTop - listHeight) : (targetTop + targetHeight);

                that.isShow = true;
                $searchList.css({
                    top: top + 'px',
                    left: targetLeft + 'px'
                })
            })
        },

        _updateInput: function () {
            var list = this.list;
            var index = this.index;
            var val = list[index];

            this.$target.val(val);
            this.close();
        },

        _moveUpOrDown: function (isUp) {
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
        }
    });

    searchList = new SearchList();

    $doc.on('click', function (event) {
        var $target = $(event.target);
        searchList.close();
    });

    function init(options) {
        var selector = options.selector;
        var refreshCallback = options.refreshCallback;

        $doc.on('keydown', selector, function (event) {
            var keyCode = event.keyCode;
            var $target = $(event.target);
            var isEnter = keyCode === 13;
            var isUp = keyCode === 38;
            var isDown = keyCode === 40;

            if (isEnter) {
                event.preventDefault();
            } else if (isUp || isDown) {
                event.preventDefault();
                searchList._moveUpOrDown(isUp);
            } else {
                //解决中文输入法的问题
                setTimeout(function () {
                    var text = $target.val();
                    var cbVal = refreshCallback(text);

                    if ( cbVal && $.isFunction(cbVal.then) ) {
                        cbVal.then(function (list) {
                            renderList(list, $target);
                        })
                    } else if ( $.isArray(cbVal) ) {
                        renderList(cbVal, $target);
                    }
                });
            }

            function renderList(list, $target) {
                searchList.renderAndOpenSearchList(list, $target);
            }
        });
    }



    return {
        init: init
    }
});