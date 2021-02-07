/**
 * @file checkboxAll
 * @author Tang Chao
 */

define([
    'jquery'
], function(
    $
) {
    function CheckboxAll(options) {
	    this.checkbox = options.checkbox;
	    this.findClassName = options.findClassName;
	    this.onChange = options.onChange ? options.onChange : $.noop;
	    
	    this._init();
	    
	    return this;
    }
    
    $.extend(CheckboxAll.prototype, {
    	_init: function () {
    		var that = this;
    		var $all = this.$all = $(this.checkbox);
		    
    		this._refresh$checkboxList();
    		
    		$all.click(function () {
    			var isAllChecked = $all.prop('checked');
			    
			    that.$checkboxList.each(function (i, item) {
				    var $item = $(item);
				    
				    $item.prop('checked', isAllChecked);
			    });
			
			    that._ExecOnchange();
		    });
    		
    		$(document).on('click', '.' + this.findClassName, function (event) {
			    event.stopPropagation();
			    that._resetAllChecked();
			    that._ExecOnchange();
		    })
	    },
	    
	    _refresh$checkboxList: function () {
		    this.$checkboxList = $('.' + this.findClassName);
	    },
	    
	    _resetAllChecked: function () {
		    var allShouldChecked = true;
		
		    this.$checkboxList.each(function (i, item) {
			    var $item = $(item);
			
			    if (!$item.prop('checked')) {
				    allShouldChecked = false;
			    }
		    });
		
		    this.$all.prop('checked', allShouldChecked);
	    },
	    
	    _ExecOnchange: function () {
		    this.onChange(this.getValue());
	    },
	    
	    reset: function () {
		    this._refresh$checkboxList();
		    this._resetAllChecked();
		    this._ExecOnchange();
	    },
	    
	    getValue: function () {
		    var list = [];
		    
		    this.$checkboxList.each(function (i, item) {
			    var $item = $(item);
			    
			    if ($item.prop('checked')) {
			    	list.push($item.val())
			    }
		    });
		    
		    return list;
	    }
    });
    
    return CheckboxAll;
});