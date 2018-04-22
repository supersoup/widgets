/**
 * Created by supersoup on 18/4/6.
 */

require([
    'text!./datePicker.ejs',
    'jquery',
    'ejs'
], function (html, $) {
    var $wrap = $('<div class="date-wrap date-wrap-' + $.expando + '"></div>');
    var thisDay = new Date();
    var thisYear = thisDay.getFullYear();
    var thisMonth = thisDay.getMonth();
    var thisDate = thisDay.getDate();

    _init();

    function _init() {
        $wrap.appendTo($('body'))
            .hide();

        $wrap.on('click', '.date-header-previous', function (event) {

        });

        $wrap.on('click', '.date-header-previous', function (event) {

        });

        $wrap.on('change', '.date-header-years', function () {

        });

        $wrap.on('change', '.date-header-months', function () {

        });

        _render(thisYear, thisMonth);

        $(document)
            .on('focus', '.date-picker', function (event) {
                var $target = $(event.target);
                var height = $target.outerHeight();
                var offset = $target.offset();
                var offsetTop = offset.top;
                var offsetLeft = offset.left;

                $wrap
                    .css({
                        top: offsetTop + height + 'px',
                        left: offsetLeft + 'px'
                    })
                    .show()
            })
            .on('click', function (event) {
                var $target = $(event.target);

                if (!$target.hasClass('date-picker') && !$target.parents('.date-wrap-' + $.expando).is($wrap)) {
                    $wrap.hide();
                }
            });
    }


    function _render(year, month) {
        var firstDate = new Date(year, month - 1, 1);
        var lastDate = new Date(year, month, 0);
        var lastMonthLastDate = new Date(year, month - 1, 0);

        var list = [];
        var item = {};
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
                    year: month === 0 ? year - 1 : year
                });
            }
        }

        //本月
        for (i = 0; i < lastDateDate; i ++) {
            list.push({
                day: i % 7,
                date: i,
                month: month,
                year: year
            })
        }

        //下月
        if (lastDateWeek !== 6) {
            for (i = lastDateWeek + 1; i <= 6; i ++ ) {
                list.push({
                    day: i,
                    date: i - lastDateWeek,
                    month: month === 11 ? 0 : month + 1,
                    year: month === 11 ? year + 1 : year
                })
            }
        }


        var options = {
            renderList: list,
            renderYear: year,
            renderMonth: month,
            thisYear: thisYear,
            thisMonth: thisMonth,
            thisDate: thisDate
        };

        var tableStr = ejs.render(html, options);

        $wrap.html(tableStr);
    }


});