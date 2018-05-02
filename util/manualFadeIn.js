define(function () {
	//不能直接 fadeIn，而要先 display:block，计算宽高，后再进行 opacity 动画。否则无法正确计算其宽高
	return function ($node, time, callback) {
		$node.css({
			opacity: 0,
			display: 'block'
		});

		var returnValue = callback();

		//如果是 promise | deferred 则要在 then 中执行
		if (returnValue && typeof returnValue.then === 'function') {
			returnValue.then(function () {
				$node.animate({
					opacity: 1
				}, time);
			})
		} else {
			$node.animate({
				opacity: 1
			}, time);
		}


	}
});