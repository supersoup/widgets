define(['underscore'], function (_) {
	return function renderEjs(ejs, data) {
		//采用和 ejs 一样的标准，= 要进行转义，- 不进行转义
		var template =  _.template(ejs, {
			interpolate: /<%-([\s\S]+?)%>/g,
			escape: /<%=([\s\S]+?)%>/g
		});
		
		return template(data);
	}
});