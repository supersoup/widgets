define(['jquery'], function ($) {
	//不能直接 fadeIn，而要先 display:block，计算宽高，后再进行 opacity 动画。否则无法正确计算其宽高
	return function ($node, time, callback) {
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
});