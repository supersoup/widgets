/**
 * @file table
 * @author Tang Chao
 */


define([
	//这两个莫名其妙寻址错误，先把里面的内容拷出来
	'text!./table/table-head.ejs',
	'text!./table/table-body.ejs',
	'text!./table/table-colgroup.ejs',
	'text!./table/table-checkbox.ejs',
    'jquery',
	'underscore',
	'ejs'
], function(
	ejsHead,
	ejsBody,
    ejsColGroup,
    ejsCheckbox,
    $,
    _,
    ejs
) {
	//todo: fixHeight 后 no-data
	var num = 0;
	var HTML_WRAP = '<div class="wd-table-wrap"></div>';
	var HTML_LEFT = '<div class="wd-table-left-wrap"><div class="wd-table-head-wrap"></div><div class="wd-table-body-wrap"></div></div>';
	var HTML_MIDDLE = '<div class="wd-table-middle-wrap"><div class="wd-table-head-wrap"></div><div class="wd-table-body-wrap"></div></div>';
	var HTML_RIGHT = '<div class="wd-table-right-wrap"><div class="wd-table-head-wrap"></div><div class="wd-table-body-wrap"></div></div>';
	var HTML_TABLE = '<table class="wd-table"></table>';
	var HTML_TBODY = '<tbody class="wd-table-tbody"></tbody>';
	var HTML_NO_DATA = '<div class="wd-table-no-data">暂无数据</div>';
	
	var CLASS_HEAD_WRAP = 'wd-table-head-wrap';
	var CLASS_BODY_WRAP = 'wd-table-body-wrap';
	var CLASS_HEAD_WRAP_FIX_VERTICAL = 'wd-table-head-wrap-fix-vertical';
	var CLASS_BODY_WRAP_FIX_VERTICAL = 'wd-table-body-wrap-fix-vertical';
	var CLASS_WRAP_NO_DATA = 'wd-table-wrap-no-data';
	
	var CLASS_SORT_ASC = 'wd-table-head-sorter-asc';
	var CLASS_SORT_DESC = 'wd-table-head-sorter-desc';
	var CLASS_FIXABLE = 'wd-table-wrap-fixable';
	var CLASS_TR_HOVER = 'wd-table-tr-hover';
	var CLASS_HOVER_BY_CSS = 'wd-table-hover-by-css';
	var SORT_ASC = 'asc';
	var SORT_DESC = 'desc';
	var SORT_NULL = '';
	
	/**
	 * Table
	 * @param options:
	 * @param options.node {Element} 元素
	 * @param options.hasCheckbox {boolean} 是否有 checkbox
	 * @param options.columns {Array} 列定义
	 * @param options.columns[].title 列标题
	 * @param options.columns[].dataIndex dataSource 上对应的键
	 * @param options.columns[].width {number} 宽度，数字
	 * @param options.columns[].fixed：'left', 'right', undefined 是否固定左，右，不填表示不固定，固定的需要排在最左或最右
	 * @param options.columns[].sorter：{boolean} 是否排序
	 * @param options.columns[].render：{Function} 渲染函数，请返回安全的 html
	 * @constructor
	 */
	function Table(options) {
	    this.node = options.node;
	    this.columns = options.columns;
	    this.checkboxDataIndex = options.checkboxDataIndex;
	    this.onCheck = options.onCheck ? options.onCheck : $.noop;
	    this.onSort = options.onSort ? options.onSort : $.noop;
	    this.sortTypeList = options.sortTypeList !== undefined ? options.sortTypeList : [SORT_DESC, SORT_ASC];
	    this.shouldCheckDisable = options.shouldCheckDisable ? options.shouldCheckDisable : function() {return false};
	    this.hasColBorder = options.hasColBorder ? options.hasColBorder : false;
		this.fixTableColDefaultWidth = options.fixTableColDefaultWidth !== undefined ? options.fixTableColDefaultWidth : 200;
		this.fixHeight = options.fixHeight;
	    
	    this._init();
    }
    
    $.extend(Table.prototype, {
    	_init: function () {
    		
		    this.dataSource = [];
		    this.num = num;
		    
		    this.sortColIndex = undefined;
		    this.sortTypeIndex = 0;
		
		    this.leftFixable = false;
		    this.rightFixable = false;
		    this.checkable = false;
		    this.checkedList = [];
		    
		    num ++;
		    
		    this.checkboxClassName = 'wd-table-checkbox' + num;
		
		    this.$node = $(this.node);
		    var $wrap = this.$wrap = $(HTML_WRAP);
		    var $middle = this.$middle = $(HTML_MIDDLE);
		    this.$node.append($wrap);
		    
		    
		    this._dealColumns();
		    this._createHeaderHtml();
		    this._createColHtml();
		
		    
		    this._renderEachTable($middle);
		    $wrap.append($middle);
		
		    this._initFixable();
		    this._initCheckable();
		    this._initSortable();
		    this._initHover();
		    
		    $wrap.append(HTML_NO_DATA);
		
	        if (this.hasColBorder) {
	            $wrap.addClass('wd-table-has-col-border')
	        }
	    },
	    
	    _initFixable: function () {
    		var $wrap = this.$wrap;
    		var leftWidth = 0;
    		var rightWidth = 0;
    		var rightMarginLeft = 0;
    		var $left;
    		var $right;
    		
    		if (this.leftFixable) {
			    $left = this.$left = $(HTML_LEFT);
			    this._renderEachTable($left);
			    $wrap.append($left);
			
			    _.each(this.colList, function (item) {
				    if (item.fixed === 'left') {
					    leftWidth += item.width;
				    }
			    });
			    
			    $left.css('width', leftWidth + 'px');
		    }
		    
		    if (this.rightFixable) {
			    $right = this.$right = $(HTML_RIGHT);
			    this._renderEachTable($right);
			    $wrap.append($right);
			
			    _.each(this.colList, function (item) {
				    if (item.fixed === 'right') {
					    rightWidth += item.width;
				    } else {
					    rightMarginLeft -= item.width;
				    }
			    });
			
			    //多左移动一像素，避免出现两个边框
			    rightMarginLeft --;
			
			    $right.css('width', rightWidth + 'px');
			    $right.find('table').css('marginLeft', rightMarginLeft + 'px');
		    }
		    
		    if (this.leftFixable || this.rightFixable) {
    			this.$middle.css('overflowX', 'scroll');
			    this.$wrap.addClass(CLASS_FIXABLE);
		    } else if (this.fixHeight !== undefined) {
			    //目前只支持水平 fix 和 垂直 fix 一种，所以只有当水平方向没有 fix 的情况下，才进行垂直 fix
			    this.$middleHead = this.$middle.find('.' + CLASS_HEAD_WRAP).addClass(CLASS_HEAD_WRAP_FIX_VERTICAL);
			    this.$middleBody = this.$middle.find('.' + CLASS_BODY_WRAP).addClass(CLASS_BODY_WRAP_FIX_VERTICAL);
			
			    this.$middleBody.css('height', this.fixHeight);
		    }
	    },
	    
	    _initCheckable: function () {
    		if (this.checkboxDataIndex === undefined) {
			    return;
		    }
		    
		    var that = this;
		
		    var $checkSide = this.$middle;
		    
		    if (this.leftFixable) {
			    $checkSide = this.$left;
		    }
		    
		    this.$checkboxAll = $checkSide.find('thead').find('.wd-table-checkbox-all');
		
		    this.$checkboxAll.click(function () {
			    that._onCheckAll();
		    });
		
		    $checkSide.on('click', '.' + this.checkboxClassName, function () {
			    that._onCheck();
		    });
		    
		    this.$checkSide = $checkSide;
		    this.checkable = true;
	    },
	    
	    _initSortable: function () {
		    var that = this;
		
		    this.$wrap.on('click', '.wd-table-head-sorter', function (event) {
			    event.stopPropagation();
			    that._onSort($(this));
		    });
	    },
	    
	    _initHover: function () {
    		var $wrap = this.$wrap;
    		
    		if (!this.leftFixable && !this.rightFixable) {
    			//如果没有 fixable, 则利用 css 的 hover
    			$wrap.addClass(CLASS_HOVER_BY_CSS);
    			return;
		    }
    		
		    $wrap.on('mouseenter', 'tr', function () {
			    var $tr = $(this);
			    var index = $tr.attr('data-index');
			    $wrap.find('tr[data-index=' + index + ']').addClass(CLASS_TR_HOVER);
		    });
		
		    $wrap.on('mouseleave', 'tr', function () {
			    $wrap.find('.' + CLASS_TR_HOVER).removeClass(CLASS_TR_HOVER);
		    })
	    },
	    
	    _dealColumns: function () {
    		var that = this;
		    
    		//深复制，除了 render 方法仍然保持引用
		    var colList = _.map(this.columns, function (item) {
		    	var obj = {};
			    for (var key in item) {
			    	obj[key] = item[key];
			    }
			    
			    return obj;
		    });
		    
		    if (colList[0].fixed === 'left') {
		    	this.leftFixable = true;
		    }
		    
		    if (colList[colList.length - 1].fixed === 'right') {
		    	this.rightFixable = true;
		    }
		    
		    if (this.leftFixable || this.rightFixable) {
		    	var allWidth = 0;
		    	var wrapWidth = this.$wrap.width();
		    	
		    	_.each(colList, function (item) {
				    item.width = item.width !== undefined ? item.width : that.fixTableColDefaultWidth;
				    allWidth += item.width;
			    });
			    
		    	//如果总共的宽度不到 $wrap 的宽度，则取消水平 fix；如果表格是被隐藏的，那没有办法进行该优化
			    if (wrapWidth >= allWidth) {
				    this.leftFixable = false;
				    this.rightFixable = false;
			    }
		    }
		    
		    if (this.checkboxDataIndex !== undefined) {
		    	colList.unshift({
				    title: '<label class="wd-table-checkbox-label"><input class="wd-table-checkbox-all" type="checkbox"></label>',
				    dataIndex: that.checkboxDataIndex,
				    width: 40,
				    render: function (colItem, itemVal, index) {
				    	var shouldDisable = that.shouldCheckDisable(colItem, itemVal, index);
				    	
				    	return ejs.render(ejsCheckbox, {
				    		className: that.checkboxClassName,
						    dataIndex: index,
						    dataValue: colItem[that.checkboxDataIndex],
						    shouldDisable: shouldDisable
					    })
				    },
				    fixed: this.leftFixable ? 'left' : undefined
			    });
		    }
		    
		    this.colList = colList;
	    },
	
	    _dealDataSource: function () {
    		//深复制一份，避免在 render 函数中 dataSource 被改动
    		var dataSource = $.extend(true, [], this.dataSource);
		    var columns = this.colList;
			   
		    return  _.map(dataSource, function (dataSourceRow, rowIndex) {
		    	return _.map(columns, function (colDefineItem) {
				
				    var dataIndex = colDefineItem.dataIndex;
				    var itemVal = dataSourceRow[dataIndex];
				    var render = colDefineItem.render;
				
				    if ($.isFunction(render)) {
					    return render(dataSourceRow, itemVal, rowIndex);
				    } else {
					    return itemVal;
				    }
			    });
		    });
	    },
	    
	    _onSort: function ($th) {
		    var colIndex = $th.attr('data-index') - 0;
		    var sortTypeLength = this.sortTypeList.length;
		    var $currentSortTh = this.$wrap.find('[data-index=' + colIndex + ']');
		    var sortTypeIndex = this.sortTypeIndex;
		    var sortDataIndex = this.colList[colIndex].dataIndex;
		    
		    //重置之前的
		    this.$wrap.find('.' + CLASS_SORT_ASC).removeClass(CLASS_SORT_ASC);
		    this.$wrap.find('.' + CLASS_SORT_DESC).removeClass(CLASS_SORT_DESC);
		    
		    //如果之前是本列，则顺着 sortTypeList 去排序
		    if (this.sortColIndex === colIndex && sortTypeIndex < sortTypeLength - 1) {
			    sortTypeIndex ++;
		    } else {
			    sortTypeIndex = 0;
		    }
		    
		    var sortType = this.sortTypeList[sortTypeIndex];
		    
		    if (sortType === SORT_ASC) {
			    $currentSortTh.addClass(CLASS_SORT_ASC);
		    } else if (sortType === SORT_DESC) {
			    $currentSortTh.addClass(CLASS_SORT_DESC);
		    } else {
			    colIndex = undefined;
			    sortDataIndex = undefined;
		    }
		    
		    this.sortTypeIndex = sortTypeIndex;
		    this.sortColIndex = colIndex;
		    
		    this.onSort(sortDataIndex, sortType);
	    },
	    
	    _onCheck: function () {
		    var valueList = [];
		    
		    this.$checkboxList.each(function (i, item) {
		    	var $item = $(item);
		    	
			    if ($item.prop('checked')) {
			    	valueList.push($item.attr('data-value'));
			    }
		    });
		    
		    this._setCheckAllState(valueList);
		    this.checkedList = valueList;
		    this.onCheck(valueList);
	    },
	    
	    _setCheckAllState: function (list) {
		    if (list.length === this.$checkboxList.size()) {
			    this.$checkboxAll.prop('checked', true);
		    } else {
			    this.$checkboxAll.prop('checked', false);
		    }
	    },
	
	    _onCheckAll: function () {
		    var value = this.$checkboxAll.prop('checked');
		    var valueList = [];
		    
		    this.$checkboxList.each(function (i, item) {
			    var $item = $(item);
			    
			    $item.prop('checked', value);
			    
			    if (value) {
			    	valueList.push($item.attr('data-value'));
			    }
		    });
		    
		    this.checkedList = valueList;
		    this.onCheck(valueList);
	    },
	    
	    _resetCheckboxes: function () {
		    this.checkedList = [];
		    this.$checkboxList = this.$checkSide.find('.' + this.checkboxClassName);
		    this.$checkboxAll.prop('checked', false);
		    
		    var shouldAllDisable = this.$checkboxList.filter('[disabled=disabled]').size() > 0;
		    this.$checkboxAll.prop('disabled', shouldAllDisable);
	    },
	
	    _createHeaderHtml: function () {
		    this.headHtml = ejs.render(ejsHead, {
		    	colList: this.colList
		    });
	    },
	
	    _createBodyHtml: function () {
		    this.bodyHtml = ejs.render(ejsBody, {
			    colList: this.colList,
			    data: this.data
		    });
	    },
	    
	    _createColHtml: function () {
		    this.colgroupHtml = ejs.render(ejsColGroup, {
			    colList: this.colList
		    });
	    },
	    
	    _renderEachTable: function ($side) {
    		
		    var $tableHead = $(HTML_TABLE);
		    var $tableBody = $(HTML_TABLE);
		    $tableHead.append(this.colgroupHtml);
		    $tableBody.append(this.colgroupHtml);
		    $tableHead.append(this.headHtml);
		    $tableBody.append(HTML_TBODY);
		
		    $side.find('.' + CLASS_HEAD_WRAP).append($tableHead);
		    $side.find('.' + CLASS_BODY_WRAP).append($tableBody);
	    },
	    
	    setDataSource: function (dataSource) {
		    this.dataSource = dataSource;
		    this.data = this._dealDataSource();
		    this._createBodyHtml();
		    
		    this.$middle.find('tbody').html(this.bodyHtml);
		    
		    if (this.leftFixable) {
			    this.$left.find('tbody').html(this.bodyHtml);
		    }
		
		    if (this.rightFixable) {
			    this.$right.find('tbody').html(this.bodyHtml);
		    }
		    
		    if (this.checkable) {
			    this._resetCheckboxes();
		    }
		    
		    if (dataSource.length === 0 && this.fixHeight === undefined) {
		    	this.$wrap.addClass(CLASS_WRAP_NO_DATA);
		    } else {
			    this.$wrap.removeClass(CLASS_WRAP_NO_DATA);
		    }
	    },
	    
	    resetSort: function () {
		    this.$wrap.find('.' + CLASS_SORT_ASC).removeClass(CLASS_SORT_ASC);
		    this.$wrap.find('.' + CLASS_SORT_DESC).removeClass(CLASS_SORT_DESC);
		    this.sortColIndex = undefined;
	    },
	    
	    getChecked: function () {
		    return this.checkedList;
	    },
	    
	    setChecked: function (checkedList) {
		    if (!this.checkable) {
			    return;
		    }
		    
    		
    		
		    
		    this.$checkboxList.each(function (i, item) {
			    var $item = $(item);
			    var checked = _.indexOf(checkedList, $item.attr('data-value') + '') >= 0;
			    $item.prop('checked', checked);
		    });
		    
		    this._setCheckAllState(checkedList);
		    this.checkedList = checkedList;
	    },
	    
	    clear: function () {
		    this.setDataSource([]);
	    }
    });
	
	return Table;
});