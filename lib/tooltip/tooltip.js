/**
 * @file tooltip
 * @author Tang Chao
 */


define([
    'text!./tooltip.ejs',
    'jquery',
	'util/browser'
], function (
    html,
    $,
    browser
) {
	
	var CLASS_TOOLTIP_CONTENT = 'wd-tooltip-content';
	var CLASS_TOOLTIP_ARROW = 'wd-tooltip-arrow';
	var CLASS_TOOLTIP_ARROW_TOP = 'wd-tooltip-arrow-top';
	var CLASS_TOOLTIP_ARROW_BOTTOM = 'wd-tooltip-arrow-bottom';
	
    var $tooltip = $('<div class="wd-tooltip"></div>');
    var $window = $(window);

    $('body').append($tooltip);
    $tooltip.html(html);
    var $content = $tooltip.find('.' + CLASS_TOOLTIP_CONTENT);
    var $arrow = $tooltip.find('.' + CLASS_TOOLTIP_ARROW);

    $tooltip.hide();

    function init(selector, time) {
        time = time || 0;

        $(document)
            .on('mouseenter', selector, function (event) {
                event.preventDefault();
                var $target = $(this);
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
                            .addClass(CLASS_TOOLTIP_ARROW_BOTTOM)
                            .removeClass(CLASS_TOOLTIP_ARROW_TOP)
                    } else {
                        $tooltip.css({
                            top: (targetOffsetTop + targetHeight) + 'px',
                            left: tooltipLeft
                        });
                        $arrow
                            .addClass(CLASS_TOOLTIP_ARROW_TOP)
                            .removeClass(CLASS_TOOLTIP_ARROW_BOTTOM)
                    }
                });
            })
            .on('mouseleave', selector, function () {
                $tooltip.fadeOut(time);
            });
    }
	
	function manualFadeIn($node, time, callback) {
    	if (browser.isIE8) {
    		time = 0;
	    }
    	
		$node.css({
			opacity: 0,
			display: 'block'
		});
		
		var cbVal = callback();
		
		if (cbVal && $.isFunction(cbVal.then)) {
			cbVal.then(animate)
		} else {
			animate();
		}
		
		function animate() {
			$node.animate({
				opacity: 1
			}, time);
		}
	}

    return {
        init: init
    }
});