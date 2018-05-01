/**
 * Created by supersoup on 18/4/6.
 */

require([
    'text!./datePicker.ejs',
    'jquery',
    'css!./datePicker.css',
    'ejs'
], function (html, $) {

    function DatePicker(selector) {
        var thisDay = new Date();

        this.$wrap = $('<div class="date-wrap date-wrap-' + $.expando + '"></div>');
        this.thisYear = thisDay.getFullYear();
        this.thisMonth = thisDay.getMonth();
        this.thisDate = thisDay.getDate();
        this.selector = selector;

        this._init();
    }

    $.extend(DatePicker.prototype, {

        _init: function() {
            var that = this;

            this.$wrap.appendTo($('body'))
                .hide();

            this.$wrap.on('click', '.date-header-previous', function (event) {
                event.preventDefault();
                that._handlePrev();
            });

            this.$wrap.on('click', '.date-header-next', function (event) {
                event.preventDefault();
                that._handleNext();
            });

            this.$wrap.on('change', '.date-header-years', function (event) {
                event.preventDefault();
                that._handleChangeYear(event.target);
            });

            this.$wrap.on('change', '.date-header-months', function (event) {
                event.preventDefault();
                that._handleChangeMonth(event.target);
            });

            this.$wrap.on('click', 'td', function (event) {
                event.preventDefault();
                that._setValue(event.target);
            });

            $(document)
                .on('focus', this.selector, function (event) {
                    var $target = $(event.target);
                    var height = $target.outerHeight();
                    var offset = $target.offset();
                    var offsetTop = offset.top;
                    var offsetLeft = offset.left;
                    var val = $target.val();
                    var dateArr;

                    that.$input = $target;
                    that.inputYear = undefined;
                    that.inputMonth = undefined;
                    that.inputDate = undefined;

                    if (val === '' || !/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                        that._render(that.thisYear, that.thisMonth);
                    } else {
                        dateArr = val.split('-');
                        that.inputYear = dateArr[0];
                        that.inputMonth = dateArr[1] - 1;
                        that.inputDate = dateArr[2];
                        that._render(dateArr[0], dateArr[1] - 1);
                    }

                    that.$wrap
                        .css({
                            top: offsetTop + height + 'px',
                            left: offsetLeft + 'px'
                        })
                })
                .on('click', function (event) {
                    var $target = $(event.target);

                    if ( !$target.hasClass('date-picker') && !($target.parents('.date-wrap-' + $.expando).length > 0) ) {
                        that.$wrap.hide();
                    }
                });

        },

        _handlePrev: function () {
            var renderYear;
            var renderMonth;
            if (this.renderMonth === 0) {
                renderYear = this.renderYear - 1;
                renderMonth = 11;
            } else {
                renderYear = this.renderYear;
                renderMonth = this.renderMonth - 1;
            }

            this._render(renderYear, renderMonth);
        },

        _handleNext: function () {
            var renderYear;
            var renderMonth;
            if (this.renderMonth === 11) {
                renderYear = this.renderYear + 1;
                renderMonth = 0;
            } else {
                renderYear = this.renderYear;
                renderMonth = this.renderMonth + 1;
            }

            this._render(renderYear, renderMonth);
        },

        _handleChangeYear: function (target) {
            var $target = $(target);
            var val = $target.val();

            this._render(val, this.renderMonth);
        },

        _handleChangeMonth: function () {
            var $target = $(event.target);
            var val = $target.val();

            this._render(this.renderYear, val - 1);
        },

        _render: function (year, month) {
            var that = this;
            year = parseInt(year);
            month = parseInt(month);

            this.renderYear = year;
            this.renderMonth = month;

            this.options = {
                renderList: this._calculate(year, month),
                renderYear: this.renderYear,
                renderMonth: this.renderMonth,
                inputYear: this.inputYear,
                inputMonth: this.inputMonth,
                inputDate: this.inputDate,
                thisYear: this.thisYear,
                thisMonth: this.thisMonth,
                thisDate: this.thisDate
            };

            var tableStr = ejs.render(html, this.options);

            setTimeout(function () {
                that.$wrap
                    .html(tableStr)
                    .show()
            });

        },

        _calculate: function (year, month) {
            var firstDate = new Date(year, month, 1);
            var lastDate = new Date(year, month + 1, 0);
            var lastMonthLastDate = new Date(year, month, 0);

            var list = [];
            var firstDateWeek = firstDate.getDay();
            var lastDateWeek = lastDate.getDay();
            var lastDateDate = lastDate.getDate();
            var lastMonthLastDateDate = lastMonthLastDate.getDate();
            var i;

            //头月
            if (firstDateWeek !== 0) {
                for (i = 0; i < firstDateWeek; i ++) {
                    list.push({
                        day: i,
                        date: lastMonthLastDateDate + 1 - firstDateWeek + i,
                        month: month === 0 ? 11 : month - 1,
                        year: month === 0 ? year - 1 : year,
                        monthIs: 'prev'
                    });
                }
            }

            //本月
            for (i = 1; i <= lastDateDate; i ++) {
                list.push({
                    day: (i - 1) % 7,
                    date: i,
                    month: month,
                    year: year,
                    monthIs: 'current'
                })
            }

            //下月
            if (lastDateWeek !== 6) {
                for (i = lastDateWeek + 1; i <= 6; i ++ ) {
                    list.push({
                        day: i,
                        date: i - lastDateWeek,
                        month: month === 11 ? 0 : month + 1,
                        year: month === 11 ? year + 1 : year,
                        monthIs: 'next'
                    })
                }
            }

            return list;
        },

        _setValue: function (target) {
            var $target = $(target);
            var text = $.trim($target.text());
            var viewDate;
            var viewMonth;
            var viewYear;

            viewDate = text < 10 ? '0' + text : text;

            if ($target.hasClass('date-month-prev')) {
                if (this.renderMonth === 0) {
                    viewMonth = 12;
                    viewYear = this.renderYear - 1;
                } else {
                    viewMonth = this.renderMonth;
                    viewMonth = viewMonth < 10 ? '0' + viewMonth : viewMonth;
                    viewYear = this.renderYear;
                }

            } else if ($target.hasClass('date-month-next')) {
                if (this.renderMonth === 11) {
                    viewMonth = 0;
                    viewYear = this.renderYear + 1;
                } else {
                    viewMonth = this.renderMonth + 2;
                    viewMonth = viewMonth < 10 ? '0' + viewMonth : viewMonth;
                    viewYear = this.renderYear;
                }
            } else {
                viewMonth = this.renderMonth + 1;
                viewMonth = viewMonth < 10 ? '0' + viewMonth : viewMonth;
                viewYear = this.renderYear;
            }

            var value = viewYear + '-' + viewMonth + '-' + viewDate;

            this.$input.val(value);
            this.$wrap.hide();
        }
    });

    return {
        init: function (selector) {
            new DatePicker(selector);
        }
    };
});