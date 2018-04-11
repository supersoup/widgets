/**
 * Created by supersoup on 18/4/6.
 */

require([
    'text!./datePicker.html',
    'jquery',
    'ejs'
], function (html, $) {
    var wrap = $('.date-wrap');
    wrap.on('click', '.date-header-previous', function () {

    });

    wrap.on('click', '.date-header-previous', function () {

    });

    wrap.on('change', '.date-header-years', function () {

    });

    wrap.on('change', '.date-header-months', function () {

    });

    function init() {

    }

    function render(year, month) {
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

        var thisDay = new Date();
        var options = {
            renderList: list,
            renderYear: year,
            renderMonth: month,
            thisYear: thisDay.getFullYear(),
            thisMonth: thisDay.getMonth(),
            thisDate: thisDay.getDate()
        };

        var tableStr = ejs(html, options);
    }

    render(2018, 0)
});