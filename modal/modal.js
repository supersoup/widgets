define([
    'text!./modal.ejs',
    'jquery',
    'ejs',
    'css!./modal.css'
], function (
    html,
    $
) {
    var $body = $('body');

    /**
     * Modal
     * @param options.animateTime
     * @param options.handleList: 每一项有 text, callback, isPrimary
     * @param options.canClose
     * @constructor
     */
    function Modal(options) {
        var defaultOptions = {
            animateTime: 300,
            canClose: true

        };
        $.extend(true, this, defaultOptions, options);

        this._init();

        return this;
    }

    $.extend(Modal.prototype, {
        _init: function () {
            var $modal = $('<div class="modal"></div>');
            var str = ejs.render(html);
            $modal.html(str);
            $body.append($modal);

            this.$modal = $modal;
            this.$body = $modal.find('.modal-body');
            this.$content = $modal.find('.modal-content');
        },

        setContent: function (html) {
            this.$content.html(html);
        },

        open: function (time) {
            time = time || this.animateTime;
            $body.addClass('body-modal-open');
            var h =
            this.$modal.fadeIn(time, function () {

            });
        },

        close: function (time) {
            time = time || this.animateTime;
            this.$modal.fadeOut(time);
            $body.removeClass('body-modal-open');
        }
    });

    return Modal;
});