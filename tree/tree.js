define([
	'text!./treeItem.html',
	'jquery',
	'css!./tree.css'
], function (itemHtml, $) {
	var TOGGLE_CLASS = 'tree-item-toggle';
	var OPEN_CLASS = 'tree-item-toggle-open';
	var CLOSE_CLASS = 'tree-item-toggle-close';
	var CHILDREN_CLASS = 'tree-item-list';



	/**
	 * Tree
	 * @param options.$root
	 * @param options.contentCreator
	 * @constructor
	 */
	function Tree(options) {
		var defaultOptions = {
			checked: false,
			defaultCheckedValue: [],
			animateTime: 0
		};

		var thisOptions = this.options = $.extend(true, {}, defaultOptions, options);
		this.$root = $(options.$root);
		this.data = options.data;

		this._init();

		return this;
	}

	$.extend(Tree.prototype, {
		_init: function () {
			var that = this;

			this._createList(this.$root, this.data);
			this.$root.on('click', '.' + TOGGLE_CLASS, function (e) {
				that._toggle(e)
			})
		},

		_toggle: function (event) {
			var $target = $(event.target);
			var animateTime = this.options.animateTime;

			if ($target.hasClass(OPEN_CLASS)) {
				$target.removeClass(OPEN_CLASS)
					.addClass(CLOSE_CLASS)
					.parent()
					.siblings('.' + CHILDREN_CLASS)
					.slideUp(animateTime);
			} else if ($target.hasClass(CLOSE_CLASS)) {
				$target.removeClass(CLOSE_CLASS)
					.addClass(OPEN_CLASS)
					.parent()
					.siblings('.' + CHILDREN_CLASS)
					.slideDown(animateTime);
			}
		},

		_createItem: function (item) {
			var options = this.options;
			var $item = $(itemHtml);
			var $itemSelf = $item.find('.tree-item-self');
			var contentCreator = options.contentCreator;
			var content = item.title;
			var hasChildren = item.children && item.children && item.children.length !== 0;
			var $itemContent = $(' <div class="tree-item-content"></div>');
			var $itemList;
			var $itemCheckbox;

			if (options.checkbox) {
				$itemCheckbox = $('<a class="tree-item-checkbox"></a>');
				$itemSelf.append($itemCheckbox);
			}

			if ($.isFunction(contentCreator)){
				content = contentCreator(item)
			}

			$itemContent.html(content);
			$itemSelf.append($itemContent);

			if (hasChildren) {
				$itemList = $('<ul class="tree-item-list"></ul>');

				if (item.open !== false) {
					$item.find('.tree-item-toggle').addClass('tree-item-toggle-open');
				} else {
					$item.find('.tree-item-toggle').addClass('tree-item-toggle-close');
					$itemList.hide();
				}

				$item.append($itemList);

				this._createList($itemList, item.children);
			}

			return $item;
		},

		_createList: function ($listNode, listData) {
			var that = this;

			$.each(listData, function (i, itemData) {
				that._createItem(itemData).appendTo($listNode);
			})
		}
	});



	return Tree;
});