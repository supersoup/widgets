define([
    'jquery',
    'css!./select.css'
], function ($) {

    function Select(options) {
        var $select = this.$select = $(options.node);
        var $wrap = this.$wrap = $('<div class="select"></div>');
        var $button = this.$button = $('<a class="select-button"><span class="select-text"></span><span class="select-icon"></span></a>');
        var $list = this.$list = $('<ul class="select-option-list"></ul>');
        var that = this;

        $select.hide();

        $wrap.append($button)
            .append($list)
            .insertAfter($select)
            .append($select);

        this.$text = $button.find('.select-text');

        this._init();

        $wrap.on('click', '.select-option-item', function (event) {
            that._handleSelectOption(event);
        });
        $button.on('click', function () {
            that._toggleOption();
        });

        return this;
    }

    $.extend(Select.prototype, {
        _init: function () {
            var $select = this.$select;
            var selectedIndex = $select.get(0).selectedIndex;
            var data = this._getListFromDom();
            var current = data[selectedIndex];

            this.value = current.value;
            this._setText(current.text);
            this._close();
        },

        _getListFromDom: function () {
            var $select = this.$select;
            var $nativeOptionList = $select.find('option');
            var optionObjectList = [];
            $nativeOptionList.each(function (i, item) {
                var $item = $(item);

                optionObjectList.push({
                    value: $item.attr('value'),
                    text: $.trim($item.text())
                })
            });
            this.data = optionObjectList;

            this._renderList();

            return optionObjectList;
        },

        fetchList: function (list) {

            this._renderList();
        },

        _renderList: function () {
            var data = this.data;
            var html = [];
            var str;

            $.each(data, function (i, el) {
                html.push('<li class="select-option-item" data-index="' + i + '">' + el.text + '</li>');
            });

            str = html.join('');
            this.$list.html(str);
        },

        _handleSelectOption: function (event) {
            var $target = $(event.target);
            var index = $target.data('index');

            this._change(index);
        },

        setValue: function (value) {
            var data = this.data;
            var index;

            $.each(data, function (i, item) {
                if (item.value === value) {
                    index = i;
                    return false;
                }
            });

            this._change(index);
        },

        _change: function (index) {
            var data = this.data;
            var current = data[index];

            this.$select.get(0).selectedIndex = index;
            this.value = current.value;
            this._setText(current.text);
            this._close();
        },

        _setText: function (text) {
            this.text = text;
            this.$text.text(this.text);
        },

        _toggleOption: function () {
            var $wrap = this.$wrap;
            var className = 'select-open';
            var hasClass = $wrap.hasClass(className);

            if (hasClass) {
                $wrap.removeClass(className);
            } else {
                $wrap.addClass(className);
            }
        },

        _close: function () {
            this.$wrap.removeClass('select-open');
        },

        getSelected: function () {
            return {
                value: this.value,
                text: this.text,
                index: this.$select.get(0).selectedIndex
            }
        }
    });

    return Select;
});