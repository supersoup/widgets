define([
    'text!./transfer.ejs',
    'jquery',
	'../util/renderEjs',
    'css!./transfer.css'
], function (
    html,
    $,
    renderEjs
) {
    function Transfer(options) {
        this._init(options);
    }

    $.extend(Transfer.prototype, {
       _init: function (options) {
           var that = this;
           var $wrap = this.$wrap = $(options.wrap);
           var list = options.list || [];
           var valueList = options.valueList || [];
           var length;
           var item;

           list = $.extend(true, [], list);
           valueList = $.extend(true, [], valueList);
           length = list.length;

           for (var i = length; i > 0; i --) {
               item = list[i - 1];

               $.each(valueList, function (j, el) {
                   if (el.value === item.value) {
                       list.splice(i, 1);
                       return false;
                   }
               })
           }

           var str = ejs.render(html, {
               list: list,
               valueList: valueList
           });

           $wrap.addClass('transfer').html(str);

           var $transferList = this.$transferList = $wrap.find('.transfer-list');
           var $transferValue = this.$transferValue = $wrap.find('.transfer-value');
           var $add = this.$add = $wrap.find('.transfer-add');
           var $remove = this.$remove = $wrap.find('.transfer-remove');
           var $clear = this.$clear = $wrap.find('.transfer-clear');

           $add.click(function () {
               that._add();
           });

           $remove.click(function () {
               that._remove();
           });

           $clear.click(function () {
               that._clear()
           })
        },

        _add: function () {
            var that = this;
            var $options = this.$transferList.find('option');

            $options.each(function (i, item) {
                var $item = $(item);
                var isSelected = $item.prop('selected');

                if (isSelected) {
                    that.$transferValue.append($item);
                }
            })
        },

        _remove: function () {
            var that = this;
            var $options = this.$transferValue.find('option');

            $options.each(function (i, item) {
                var $item = $(item);
                var isSelected = $item.prop('selected');

                if (isSelected) {
                    that.$transferList.append($item);
                }
            })
        },

        _clear: function () {
            var that = this;
            var $options = this.$transferValue.find('option');

            $options.each(function (i, item) {
                var $item = $(item);
                that.$transferList.append($item);
            })
        },

        getValue: function () {
            var that = this;
            var $options = this.$transferValue.find('option');

            return $.map($options, function (item) {
                return $(item).val();
            });
        }
    });

    return Transfer;
});