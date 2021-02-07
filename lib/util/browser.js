/**
 * @file browser
 * @author Tang Chao
 */


define(function() {
	
	function judgeIE8() {
		var ua = navigator.userAgent.toLowerCase();
		
		return ua.indexOf("msie")>-1 && ua.match(/msie ([\d.]+)/)[1] === '8.0';
	}
	
	
    return {
	    isIE8: judgeIE8()
    }
});