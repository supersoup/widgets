/**
 * @file loading
 * @author Tang Chao
 */


define([
    'jquery'
], function(
    $
) {
	/**
	 * Loading
	 * @param node 覆盖某一个元素
	 * @constructor
	 */
	function Loading(node) {
		this.node = node;
		this.animate = 200;
		
		this._init()
	}
	
	$.extend(Loading.prototype, {
		_init: function () {
			this.$node = $(this.node);
			this.$cover = $('<div class="wd-loading"><img class="wd-loading-img" src="/widgets/lib//commonImages/loading/loading1.gif"></div>');
			
			this.$node.append(this.$cover);
		},
		
		show: function () {
			var $node = this.$node;
			
			this.beforePosition = $node.css('position');
			
			if (this.beforePosition === 'static') {
				$node.css('position', 'relative');
			}
			
			this.$cover.fadeIn(this.animate);
		},
		
		hide: function () {
			var $node = this.$node;
			var beforePosition = this.beforePosition;
			this.$cover.fadeOut(this.animate, function () {
				$node.css('position', beforePosition);
			});
			
		}
	});
	
	return Loading;
});