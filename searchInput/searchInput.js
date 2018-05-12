define([
    'jquery',
    'css!./searchInput.css'
], function (
    $
) {
    var $doc = $(document);

    function SearchList() {

    }

    function init(selector, refreshCallback) {
        $doc.on('keypress', 'selector', function (event) {
            var $target = $(event.target);
            var targetOffset = $target.offset();
            var docScroll
        })
    }

    return {
        init: init
    }
});