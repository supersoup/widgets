define([
    'text!./numberInput.html',
    'jquery',
    'css!./numberInput.css'
], function (
    html,
    $
) {

    var $window = $(window);
    var $body = $('body');
    var $doc = $(document);

    /**
     * NumberInput
     * @param options.selector
     * @param options.max
     * @param options.min
     * @param options.step
     * @constructor
     */
    function NumberInput(options) {
        var step = options.step;

        if (isNaN(step - 0) && step !== undefined) {
            throw new Error('step 只能为数字或者字符串数字');
        }

        this.selector = options.selector;
        this.max = options.max;
        this.min = options.min;
        this.step = step || 1;

        this._init();
    }

    $.extend(NumberInput.prototype, {
        _init: function () {
            var that = this;
            var selector = this.selector;

            this.$numberInput = $('<div class="number-input"></div>');
            var $numberInput = this.$numberInput;
            $numberInput.html(html);
            $body.append($numberInput);
            this.$plus = $numberInput.find('.number-input-plus');
            this.$reduce = $numberInput.find('.number-input-reduce');

            $doc.on('mouseenter', selector, function (event) {
                that._handleMouseEnter(event);
            }).on('mouseleave', selector, function (event) {
                that._handleMouseLeave(event);
            });

            $numberInput.on('mouseleave', function () {
                $numberInput.hide();
            });

            this.$plus.click(function (event) {
                that._handlePlus(event);
            });

            this.$reduce.click(function (event) {
                that._handleReduce(event);
            });
        },

        _handleMouseEnter: function (event) {
            event.stopPropagation();

            this.$target = $(event.target);

            var $target = this.$target;
            var targetOffset = $target.offset();
            var w = $target.outerWidth();
            var h = $target.outerHeight();
            var x = targetOffset.left;
            var y = targetOffset.top;

            this.$numberInput
                .css({
                    top: y + 'px',
                    left: x + w - 50 + 'px',
                    height: h + 'px'
                })
                .show();
        },

        _handleMouseLeave: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var $relatedTarget = $(event.relatedTarget);
            console.log($relatedTarget);
            if (!$relatedTarget.hasClass('number-input') && !$relatedTarget.parents().hasClass('number-input')) {
                this.$numberInput.hide();
            }
        },

        _handlePlus: function () {
            var $target = this.$target;
            var value = this._transToNumberOrZeroIfNaN($target.val());
            value = value + this.step;

            if (this.max && value > this.max) {
                value = this.max;
            }

            $target.val(value);
        },

        _handleReduce: function () {
            var $target = this.$target;
            var value = this._transToNumberOrZeroIfNaN($target.val());
            value = value - this.step;

            if (this.min && value < this.min) {
                value = this.min;
            }

            $target.val(value);
        },

        _transToNumberOrZeroIfNaN: function (value) {
            var num = value - 0;

            if (isNaN(num)) {
                num = 0;
            }

            return num;
        }
    });

    return {
        init: function (options) {
            new NumberInput(options);
        }
    }




});