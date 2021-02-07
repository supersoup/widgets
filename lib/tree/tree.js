/**
 * @file tree
 * @author Tang Chao
 */


define([
	'text!./tree.ejs',
	'jquery',
	'underscore',
	'util/browser'
], function (
	itemHtml,
	$,
	_,
	browser
) {
	
	
	var TOGGLE_CLASS = 'wd-tree-item-toggle';
	var OPEN_CLASS = 'wd-tree-item-toggle-open';
	var CLOSE_CLASS = 'wd-tree-item-toggle-close';
	var CHILDREN_CLASS = 'wd-tree-item-list';
	var CLASS_SELECT_CURRENT = 'wd-tree-select-item-current';
	var CLASS_SELECT = 'wd-tree-select-item';
	var CLASS_CHECKBOX = 'wd-tree-checkbox-item';
	
	/**
	 * Tree
	 * @param options.$root
	 * @param options.itemRender {Function}: item, level; return 一个字符串
	 * @param options.onSelect {Function}: item, value
	 * @param options.onCheck {Function}: item, value
	 * @param options.setSelectValue {Function}: value
	 * @param options.selectableList {Array}
	 * @param options.valueKey
	 * @param options.type
	 * @constructor
	 */
	function Tree(options) {
		var defaultOptions = {
			checked: false,
			defaultCheckedValue: [],
			// animateTime: browser.isIE8 ? 0 : 100,
			animateTime: 100,
			type: 'normal',
			valueKey: 'id',
			// checkableList: [],
			selectableList: [],
			onSelect: options.onSelect !== undefined ? options.onSelect : $.noop,
			onCheck: options.onCheck !== undefined ? options.onCheck : $.noop
		};

		var thisOptions = this.options = $.extend(true, {}, defaultOptions, options);
		this.$root = $(options.node);
		this.data = options.data;
		this.itemMap = {};
		this.mapNumber = 0;
		this.valueKey = thisOptions.valueKey;
		this.maxLevel = 0;
		this.$allOfCheckboxes = null;
		
		this.type = thisOptions.type;

		this._init();

		return this;
	}

	$.extend(Tree.prototype, {
		_init: function () {
			var that = this;
			var type = this.type;
			var $root = this.$root;
			
			if (type === 'normal') {
				this.itemRender = this._renderText;
			} else if (type === 'select') {
				this.itemRender = this._renderSelect;
			} else if (type === 'checkbox') {
				this.itemRender = this._renderCheckbox;
			} else if (type === 'custom') {
				this.itemRender = this.options.itemRender
			}

			this._createList(this.$root, this.data, 0);
			
			this.$allOfCheckboxes = this.$root.find('input.' + CLASS_CHECKBOX);
			
			$root.on('click', '.' + TOGGLE_CLASS, function (event) {
				var $target = $(event.target);
				that._toggle($target)
			});
			
			if (type === 'select') {
				$root.on('click', '.' + CLASS_SELECT, function (event) {
					that._onSelect($(event.target));
				})
			} else if (type === 'checkbox') {
				$root.on('click', '.' + CLASS_CHECKBOX, function (event) {
					that._onCheck($(event.target));
				})
			}
		},

		_toggle: function ($target) {
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

		_createItem: function (item, level) {
			var $item = $(itemHtml);
			var $itemSelf = $item.find('.wd-tree-item-self');
			var hasChildren = item.children && item.children.length !== 0;
			var $itemContent = $('<div class="wd-tree-item-content"></div>');
			var $itemList;
			
			this.itemMap[this.mapNumber] = item;
			item.wdTreeKey = this.mapNumber;
			this.mapNumber ++;
			
			
			var content = this.itemRender(item, level);

			$itemContent.html(content);
			$itemSelf.append($itemContent);

			if (hasChildren) {
				level ++;
				
				this._refreshMaxLevel(level);
				
				$itemList = $('<ul class="wd-tree-item-list"></ul>');

				if (item.open !== false) {
					$item.find('.wd-tree-item-toggle').addClass('wd-tree-item-toggle-open');
				} else {
					$item.find('.wd-tree-item-toggle').addClass('wd-tree-item-toggle-close');
					$itemList.hide();
				}

				$item.append($itemList);
				this._createList($itemList, item.children, level);
			}

			return $item;
		},
		
		_createList: function ($listNode, listData, level) {
			var that = this;
			
			$.each(listData, function (i, itemData) {
				that._createItem(itemData, level).appendTo($listNode);
			})
		},
		
		_refreshMaxLevel: function (level) {
			if (this.maxLevel < level) {
				this.maxLevel = level;
			}
		},
		
		_renderText: function (item) {
			return '<span class="wd-tree-item-text">' + item.title + '</span>';
		},
		
		_renderSelect: function (item, level) {
			var value = item[this.valueKey];
			
			if (!this._isItemSelectable(level)) {
				return this._renderText(item);
			}
			
			return '<a class="wd-tree-select-item" data-value="' +
				value +
				'" data-level="' +
				level +
				'" data-map-key="' +
				item.wdTreeKey +
				'">' +
				item.title +
				'</a>';
		},
		
		_renderCheckbox: function (item, level) {
			var value = item[this.valueKey];
			
			return '<label class="wd-tree-checkbox-item-label">' +
				'<input class="wd-tree-checkbox-item" type="checkbox" value="' +
				value +
				'" data-level="' +
				level +
				'" data-map-key="' +
				item.wdTreeKey +
				'"><span class="wd-tree-checkbox-item-text">' +
				item.title +
				
				'</span></label>';
		},
		
		_isItemSelectable: function (level) {
			var itemSelectable = this.options.selectableList[level];
			return itemSelectable === undefined || itemSelectable
		},
		
		_onSelect: function ($target) {
			
			var level = $target.attr('data-level') - 0;
			
			//不能点击的 level 不做任何处理
			if (!this._isItemSelectable(level)) {
				return;
			}
			
			this._changeSelectedClass($target);
			
			var mapItemKey = $target.attr('data-map-key') - 0;
			var mapItem = this.itemMap[mapItemKey];
			var value = mapItem[this.valueKey];
			
			this.options.onSelect(mapItem, value);
		},
		
		_changeSelectedClass: function ($target) {
			var $before = this.$root.find('.' + CLASS_SELECT_CURRENT);
			$before.removeClass(CLASS_SELECT_CURRENT);
			$target.addClass(CLASS_SELECT_CURRENT);
		},
		
		_onCheck: function ($target) {
			var level = $target.attr('data-level') - 0;
			
			if (level > 0) {
				this._resetCheckStatusUp($target);
			}
			
			if (level < this.maxLevel) {
				this._resetCheckStatusDown($target);
			}
			
			this.options.onCheck(this._getCheckValue());
		},
		
		
		_resetCheckStatusUp: function ($node) {
			
			var checked = $node.prop('checked');
			var $siblingsCheckboxes = this._getSiblingsCheckboxes($node);
			var $parentCheckbox = this._getParentCheckbox($node);
			var $parentLevel = $parentCheckbox.attr('data-level') - 0;
			var allSiblingsChecked = true;
			
			if (!checked) {
				$parentCheckbox.prop('checked', false);
			} else {
				$siblingsCheckboxes.each(function (i, item) {
					var $item = $(item);
					
					if (!$item.prop('checked')) {
						allSiblingsChecked = false;
						return false;
					}
				});
				
				$parentCheckbox.prop('checked', allSiblingsChecked);
			}
			
			if ($parentLevel > 0) {
				this._resetCheckStatusUp($parentCheckbox);
			}
		},
		
		_resetCheckStatusDown: function ($node) {
			var checked = $node.prop('checked');
			var $progenyCheckboxes = this._getProgenyCheckboxes($node);
			
			$progenyCheckboxes.each(function (i, item) {
				$(item).prop('checked', checked);
			})
		},
		
		_resetCheckStatusAll: function () {
			var that = this;
			var filterSelector;
			var $checkboxesThisLevel;
			
			//从倒数第二层级开始遍历，如果它的子选项都选中，则改变它的值
			for (var i = this.maxLevel - 1; i >= 0; i --) {
				filterSelector = this._createFilterSelector(i);
				$checkboxesThisLevel = this.$allOfCheckboxes.filter(filterSelector);
				
				$checkboxesThisLevel.each(function (index, item) {
					var $item = $(item);
					var $suns = that._getSunsCheckboxes($item);
					
					//如果子选项为 0，则不改变它本身的值
					if ($suns.size() === 0) {
						return;
					}
					
					var isChildrenAllChecked = that._isSunsAllChecked($suns);
					$item.prop('checked', isChildrenAllChecked);
				})
			}
		},
		
		_isSunsAllChecked: function ($suns) {
			var isAllChecked = true;
			
			$suns.each(function (i, item) {
				if (!$(item).prop('checked')) {
					isAllChecked = false;
					return false;
				}
			});
			
			return isAllChecked;
		},
		
		_getProgenyCheckboxes: function ($node) {
			return $node
				.parent()   //label
				.parent()   //.wd-tree-item-content
				.parent()   //.wd-tree-item-self
				.siblings('ul')   //ul
				.find('.' + CLASS_CHECKBOX);
		},
		
		_getSunsCheckboxes: function ($node) {
			var level = $node.attr('data-level') - 0;
			var sunLevel = level + 1;
			var filterSelector = this._createFilterSelector(sunLevel);
			var $progenyCheckboxes = this._getProgenyCheckboxes($node);
			
			return $progenyCheckboxes
				.filter(filterSelector);
		},
		
		_getSiblingsCheckboxes: function ($node) {
			var level = $node.attr('data-level') - 0;
			
			return $node
				.parent()   //label
				.parent()   //.wd-tree-item-content
				.parent()   //.wd-tree-item-self
				.parent()   //li.wd-tree-item
				.siblings('li')   //ul
				.find('.' + CLASS_CHECKBOX)
				.filter(this._createFilterSelector(level));
		},
		
		_getParentCheckbox: function ($node) {
			return $node
				.parent()   //label
				.parent()   //.wd-tree-item-content
				.parent()   //.wd-tree-item-self
				.parent()   //li.wd-tree-item
				.parent()   //ul
				.siblings()   //.tree-use-item-row
				.find('.' + CLASS_CHECKBOX);
		},
		
		_getCheckValue: function () {
			var list = [];
			var $allOfCheckboxes = this.$allOfCheckboxes;
			var filterSelector;
			var $thatLevelCheckboxes;
			var thatLevelValueList;
			
			for (var i = 0; i <= this.maxLevel; i ++) {
				filterSelector = this._createFilterSelector(i);
				$thatLevelCheckboxes = $allOfCheckboxes.filter(filterSelector);
				thatLevelValueList = [];
				
				$thatLevelCheckboxes.each(each);
				
				list.push(thatLevelValueList);
			}
			
			function each(index, item) {
				var $item = $(item);
				
				if ($item.prop('checked')) {
					thatLevelValueList.push($item.val());
				}
			}
			
			return list;
		},
		
		_createFilterSelector: function (level) {
			return '[data-level=' + level + ']';
		},
		
		setSelectValue: function (value) {
			var $target = this.$root.find('[data-value=' + value + ']');
			this._changeSelectedClass($target);
		},
		
		getSelectValue: function () {
			var $current = this.$root.find('.' + CLASS_SELECT_CURRENT);
			return $current.attr('data-value');
		},
		
		setCheckValue: function (valueList) {
			
			var $allOfCheckboxes = this.$allOfCheckboxes;
			
			$allOfCheckboxes.each(function (i, item) {
				var $item = $(item);
				var val = $item.val();
				
				if (valueList.indexOf(val) !== -1) {
					$item.prop('checked', true);
				} else {
					$item.prop('checked', false);
				}
			});
			
			this._resetCheckStatusAll();
		},
		
		getCheckValue: function () {
			return this._getCheckValue();
		}
	});

	return Tree;
});