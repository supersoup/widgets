define([
    'text!./tooltip.ejs',
    'jquery',
    'ejs',
    'css!./tooltip.css'
], function (
    html,
    $
) {


    var $tooltip = $('<div class="tooltip"></div>');
    $('body').append($tooltip);

    $tooltip.html(html);
    var $content = $tooltip.find('.tooltip-content');
    $content.html('hello word!');




});