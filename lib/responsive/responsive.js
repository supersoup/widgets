/**
 * @file responsive
 * @author Tang Chao
 */


define([
    'jquery',
	'underscore'
], function(
    $,
    _
) {
 
	var $body = $('body');
	var $window = $(window);
	
	function init(list) {
		makeScreenResponsive(list);
		
		$window.resize(function () {
			makeScreenResponsive(list);
		});
	}
	
	function makeScreenResponsive(list) {
		var width = $body.innerWidth();
		_.each(list, function (item) {
			if (width < item.size) {
				$body.addClass(item.className);
			} else {
				$body.removeClass(item.className);
			}
		})
	}
	
	return {
		init: init
	}
	
});