/**
 * @file trans
 * @author Tang Chao
 */


define([
    'jquery',
	'underscore'
], function(
    $,
    _
) {
	function treeToTreeTable(tree, keyName) {
		var list = [];
		var parents = [];
		var level = 0;
		
		trans(tree);
		
		return list;
		
		function trans(currentTree) {
			_.each(currentTree, function (item) {
				parents[level] = item[keyName];
				list.push(_createObject(item, level, parents));
				
				if (item.children !== undefined) {
					level++;
					trans(item.children);
					level--;
					parents.pop();
				}
			})
		}
	}
	
	function _createObject(obj, level, parents) {
		var o = {};
		
		for (var k in obj) {
			if (k !== 'children') {
				o[k] = obj[k];
			}
		}
		
		o.level = level;
		o.parents = JSON.stringify(parents);
		
		return o;
	}
	
	
	return {
		treeToTreeTable: treeToTreeTable
	}
});