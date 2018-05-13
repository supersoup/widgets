/**
 * Created by supersoup on 18/5/12.
 */
define(['jquery'], function ($) {
    return function ($node) {
        var $window = $(window);
        var windowScrollTop = $window.scrollTop();
        var windowScrollLeft = $window.scrollLeft();

        var nodeOffset = $node.offset();
        var nodeTop = nodeOffset.top;
        var nodeLeft = nodeOffset.left;

        return {
            x: windowScrollTop - nodeTop,
            y: windowScrollLeft - nodeLeft
        }
    }
});