/**
 * @file treeTable
 * @author Tang Chao
 */


define([
    'jquery',
	'underscore',
	'../util/trans',
	'../util/renderEjs',
	'text!./treeTable/head.ejs',
	'text!./treeTable/body.ejs',
	'text!./treeTable/col.ejs'
], function(
    $,
    _,
    trans,
    renderEjs,
    ejsHead,
	ejsBody,
	ejsColGroup
) {
	var SORT_ASC = 'asc';
	var SORT_DESC = 'desc';
	// var SORT_NULL = '';
	// var HTML_WRAP_HEAD = '<div class="wd-tree-table-head-wrap"></div>';
	var HTML_WRAP_BODY = '<div class="wd-tree-table-body-wrap"></div>';
	var HTML_TABLE = '<table class="wd-tree-table"></table>';
	var HTML_TBODY = '<tbody class="wd-tree-table-tbody"></tbody>';
	var CLASS_WRAP_HEAD_FIX_VERTICAL = 'wd-tree-table-head-wrap-fix-vertical';
	var CLASS_WRAP_BODY_FIX_VERTICAL = 'wd-tree-table-body-wrap-fix-vertical';
	var CLASS_SORT_ASC = 'wd-tree-table-head-sorter-asc';
	var CLASS_SORT_DESC = 'wd-tree-table-head-sorter-desc';
	var CLASS_CLOSE_BUTTON = 'wd-tree-table-first-button-clickable';
	var CLASS_COL_CHILDREN_CLOSED = 'wd-tree-table-first-col-children-closed';
	var CLASS_PREFIX_CLOSED = 'wd-tree-table-tr-close-by-';
	var num = 0;
	
	
	
    function TreeTable(options) {
	    this.node = options.node;
	    this.levelCount = options.levelCount;
	    this.columns = options.columns;
	    this.keyName = options.keyName;
	    this.onSort = options.onSort ? options.onSort : $.noop;
	    this.sortTypeList = options.sortTypeList !== undefined ? options.sortTypeList : [SORT_DESC, SORT_ASC];
	    this.hasColBorder = options.hasColBorder ? options.hasColBorder : false;
	    this.fixHeight = options.fixHeight;
	    
	    this._init();
    }
    
    $.extend(TreeTable.prototype, {
	    _init: function () {
		    var that = this;
		    this.dataSource = [];
		    this.num = num;
		
		    this.sortColIndex = undefined;
		    this.sortTypeIndex = 0;
		    this.closedLevel = undefined;
		
		    num ++;
		
		
		    this._dealColumns();
		    this._createHeaderHtml();
		    this._createColHtml();
		    this._renderTable();
		

		    this.$thead.on('click', '.wd-tree-table-head-sorter', function (event) {
			    event.stopPropagation();
			    that._onSort($(this));
		    });
		    
		    this.$tbody.on('click', '.' + CLASS_CLOSE_BUTTON, function (event) {
			    var $target = $(event.target);
			    that._onOpenOrClose($target)
		    })
	    },
	
	    _dealColumns: function () {
		    this.colList = this.columns.concat([]);
	    },
	
	    _dealDataSource: function () {
		    //深复制一份，避免在 render 函数中 dataSource 被改动
		    
		    var columns = this.colList;
		
		    return  _.map(this.dataList, function (dataSourceRow, rowIndex) {
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
	
	    _createHeaderHtml: function () {
		    this.headHtml = renderEjs(ejsHead, {
			    colList: this.colList
		    });
	    },
	    
	    _createColHtml: function () {
		    this.colgroupHtml = renderEjs(ejsColGroup, {
			    colList: this.colList
		    });
	    },
	
	    _createBodyHtml: function () {
		    this.bodyHtml = renderEjs(ejsBody, {
			    dataList: this.dataList,
			    colList: this.colList,
			    data: this.data,
			    closedLevel: this.closedLevel,
			    levelCount: this.levelCount
		    });
	    },
	    
	    _renderTable: function () {
		    var $node = this.$node = $(this.node);
		    var $wrapHead = $(HTML_WRAP_BODY);
		    var $wrapBody = $(HTML_WRAP_BODY);
		    var $tableHead = $(HTML_TABLE);
		    var $tableBody = $(HTML_TABLE);
		    var $thead = this.$thead = $(this.headHtml);
		    var $tbody = this.$tbody = $(HTML_TBODY);
		
		    if (this.hasColBorder) {
			    $tableHead.addClass('wd-tree-table-has-col-border');
			    $tableBody.addClass('wd-tree-table-has-col-border');
		    }
		
		    $wrapHead.append($tableHead);
		    $wrapBody.append($tableBody);
		    $tableHead.append(this.colgroupHtml);
		    $tableHead.append($thead);
		    $tableBody.append(this.colgroupHtml);
		    $tableBody.append($tbody);
		    
		    if (this.fixHeight !== undefined) {
			    $wrapHead.addClass(CLASS_WRAP_HEAD_FIX_VERTICAL);
			    $wrapBody.addClass(CLASS_WRAP_BODY_FIX_VERTICAL);
			    $wrapBody.css('height', this.fixHeight);
			
		    }
		    
		    $node.append($wrapHead);
		    $node.append($wrapBody);
	    },
	    
	    _onSort: function ($th) {
		    var colIndex = $th.attr('data-index') - 0;
		    var sortTypeLength = this.sortTypeList.length;
		    var $currentSortTh = this.$thead.find('[data-index=' + colIndex + ']');
		    var sortTypeIndex = this.sortTypeIndex;
		    var sortDataIndex = this.colList[colIndex].dataIndex;
		
		    //重置之前的
		    this.$thead.find('.' + CLASS_SORT_ASC).removeClass(CLASS_SORT_ASC);
		    this.$thead.find('.' + CLASS_SORT_DESC).removeClass(CLASS_SORT_DESC);
		
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
	    
	    _onOpenOrClose: function ($target) {
	    	var $tr = $target.parent().parent();
	    	var hasClosed = $tr.hasClass(CLASS_COL_CHILDREN_CLOSED);
	    	var index = $target.attr('data-index') - 0;
		    var thatLevel = this.dataList[index].level;
	    	
	    	var nextIndex = this._findNextSiblingIndex(index, thatLevel);
	    	
	    	if (hasClosed) {
			    $tr.removeClass(CLASS_COL_CHILDREN_CLOSED);
		    } else {
			    $tr.addClass(CLASS_COL_CHILDREN_CLOSED);
		    }
		
		    this.$trList.each(function (i, item) {
		    	
		    	if (i === nextIndex) {
		    		return false;
			    }
		    	
		    	if (i > index) {
				    var $item = $(item);
				    if (hasClosed) {
					    $item.removeClass(CLASS_PREFIX_CLOSED + thatLevel);
				    } else {
					    $item.addClass(CLASS_PREFIX_CLOSED + thatLevel);
				    }
			    }
		    })
	    },
	    
	    _findNextSiblingIndex: function (index, thatLevel) {
	    	var dataList = this.dataList;
	    	var length = dataList.length;
	    	
	    	for (var i = index + 1; i < length; i ++) {
	    		if (dataList[i].level <= thatLevel) {
				    return i;
			    }
		    }
		    
		    return length;
	    },
	    
	    //设置折叠状态的层级，默认不刷新
	    setClosed: function (closedLevel, shouldRefresh) {
		    shouldRefresh = !!shouldRefresh;
	    	
		    if (closedLevel >= this.levelCount - 1) {
			    throw new Error('不能设置超过 level 层级的参数，如果总共有3层，您所设置的值最大为 1，即只能折叠 0, 1 两级');
		    }
		    
		    this.closedLevel = closedLevel;
		    
		    if (shouldRefresh) {
		    	this.setDataSource(this.dataSource);
		    }
	    },
	
	    setDataSource: function (dataSource) {
		    this.dataSource = $.extend(true, [], dataSource);
		    this.dataList = trans.treeToTreeTable(this.dataSource, this.keyName);
		    this.data = this._dealDataSource();
		    this._createBodyHtml();
		    this.$tbody.html(this.bodyHtml);
		    this.$trList = this.$tbody.find('tr');
	    }
    });
    
    return TreeTable;
});