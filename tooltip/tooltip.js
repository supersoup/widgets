define([
    'text!./tooltip.html',
    'jquery',
    '../util/manualFadeIn',
    'css!./tooltip.css'
], function (
    html,
    $,
    manualFadeIn
) {

    var $tooltip = $('<div class="tooltip"></div>');
    var $window = $(window);

    $('body').append($tooltip);
    $tooltip.html(html);
    var $content = $tooltip.find('.tooltip-content');
    var $arrow = $tooltip.find('.tooltip-arrow');

    $tooltip.hide();

    function init(selector, time) {
        time = time || 0;

        $(document)
            .on('mouseenter', selector, function (event) {
                event.preventDefault();
                var $target = $(event.target);
                var label = $target.attr('label');
                $content.html(label);

                var windowScrollTop = $window.scrollTop();
                var windowHeight = $window.height();
                var windowWidth = $window.width();

                var targetHeight = $target.outerHeight();
                var targetWidth = $target.outerWidth();
                var targetOffset = $target.offset();
                var targetOffsetTop = targetOffset.top;
                var targetOffsetLeft = targetOffset.left;

                //如果还在消失的动画过程中，则清楚消失动画
                $tooltip.stop(true);

                manualFadeIn($tooltip, time, function () {
                    var maxLeftHalfWidth = targetOffsetLeft + (targetWidth / 2);
                    var maxRightHalfWidth = windowWidth - targetOffsetLeft - (targetWidth / 2);
                    var tooltipMaxWidth = 2 * Math.min(maxLeftHalfWidth, maxRightHalfWidth);
                    $tooltip.css('maxWidth', tooltipMaxWidth + 'px');

                    var tooltipHeight = $tooltip.innerHeight();
                    var tooltipWidth = Math.min($tooltip.innerWidth(), tooltipMaxWidth);

                    //是否太靠下
                    var isTooBottom = windowHeight + windowScrollTop - targetOffsetTop < tooltipHeight + targetHeight;

                    //让 tooltip 的中心和 target 的中心对齐
                    var tooltipLeft = targetOffsetLeft + (targetWidth / 2) - (tooltipWidth / 2) + 'px';

                    if (isTooBottom) {
                        $tooltip.css({
                            top: (targetOffsetTop - tooltipHeight) + 'px',
                            left: tooltipLeft
                        });
                        $arrow
                            .addClass('tooltip-arrow-bottom')
                            .removeClass('tooltip-arrow-top')
                    } else {
                        $tooltip.css({
                            top: (targetOffsetTop + targetHeight) + 'px',
                            left: tooltipLeft
                        });
                        $arrow
                            .addClass('tooltip-arrow-top')
                            .removeClass('tooltip-arrow-bottom')
                    }
                });
            })
            .on('mouseleave', selector, function () {
                $tooltip.fadeOut(time);
            });
    }

    return {
        init: init
    }
});