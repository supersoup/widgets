/**
 * @file number
 * @author Tang Chao
 */


define([
    'text!./number.ejs',
    'jquery',
    'bignumber'
], function (
    html,
    $,
    BigNumber
) {
    var CLASS_INPUT = 'wd-number-input';
    var CLASS_INPUT_PLUS = 'wd-number-input-plus';
    var CLASS_INPUT_REDUCE = 'wd-number-input-reduce';
    
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
            var $body = $('body');
            var $doc = $(document);

            this.$numberInput = $('<div class="wd-number-input"></div>');
            var $numberInput = this.$numberInput;
            $numberInput.html(html);
            $body.append($numberInput);
            this.$plus = $numberInput.find('.' + CLASS_INPUT_PLUS);
            this.$reduce = $numberInput.find('.' + CLASS_INPUT_REDUCE);

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
                    left: x + w - 24 + 'px',
                    height: h + 'px'
                })
                .show();
        },

        _handleMouseLeave: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var $relatedTarget = $(event.relatedTarget);
            if (!$relatedTarget.hasClass(CLASS_INPUT) && !$relatedTarget.parents().hasClass(CLASS_INPUT)) {
                this.$numberInput.hide();
            }
        },

        _handlePlus: function () {
            var $target = this.$target;
	        var inputValue = this._transToNumberOrZeroIfNaN($target.val());
	        var value = new BigNumber(inputValue);
            value = value.plus(this.step);

            if (this.max !== undefined && value.gt(this.max)) {
                value = new BigNumber(this.max);
            }

            $target.val(value.valueOf());
        },

        _handleReduce: function () {
            var $target = this.$target;
            var inputValue = this._transToNumberOrZeroIfNaN($target.val());
            var value = new BigNumber(inputValue);
            value = value.minus(this.step);

            if (this.min !== undefined && value.lt(this.min)) {
                value = new BigNumber(this.min);
            }

            $target.val(value.valueOf());
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