define([
    'text!./modal.ejs',
    'jquery',
    'ejs',
    'css!./modal.css'
], function (
    html,
    $
) {
    var $window = $(window);
    var $body = $('body');

    /**
     * Modal
     * @param options.animateTime
     * @param options.handleList: 每一项有 text, callback, isPrimary, 如果是简单关闭弹窗，则不需要 callback
     * @param options.canClose
     * @param options.size
     * @param options.content
     * @param options.openBefore: 如果返回一个 promise | deferred 对象，则等待 resolve 后才执行载入动画，this 指向 modal 实例
     * @param options.openAfter: this 指向 modal 实例
     * @constructor
     */
    function Modal(options) {
        var defaultOptions = {
            animateTime: 300,
            canClose: true,
            size: 'normal',
            title: '模态框',
            content: '',
            handleList: [],
            openBefore: $.noop,
            openAfter: $.noop
        };
        $.extend(this, defaultOptions, options);

        this._init();

        return this;
    }

    $.extend(Modal.prototype, {
        _init: function () {
            var that = this;
            var renderData = {
                title: this.title,
                canClose: this.canClose,
                size: this.size,
                content: this.content,
                handleList: this.handleList
            };
            var str = ejs.render(html, renderData);

            var $modal = $('<div class="modal"></div>');
            $modal.html(str);
            $modal.addClass('modal-' + this.size);
            $body.append($modal);

            var size = this.size;
            if (size === 'small') {
                $modal.addClass('modal-small');
            } else if (size === 'large') {
                $modal.addClass('modal-large');
            }

            this.$modal = $modal;
            this.$modalBody = $modal.find('.modal-body');

            $modal.on('click', '.modal-header-close', function () {
                that._close();
            });

            $modal.on('click', '.modal-button', function (event) {
                that._handleFooterButtonClick(event);
            });

            var modalBg = $modal.find('.modal-background');
            modalBg.on('click', function () {
                that._close();
            });

        },

        _handleFooterButtonClick: function (event) {
            var $target = $(event.target);
            var index = $target.data('index');
            index = $.trim(index) - 0;
            var callback = this.handleList[index].callback;

            if (callback) {
                callback.apply(this);
            } else {
                this._close();
            }
        },

        _open: function (time) {
            time = time || this.animateTime;
            var that = this;
            var executeOpenAfter = this._executeOpenAfter.bind(this);
            var returnBeforeValue = this._executeOpenBefore();

            //根据返回值是否有 then 方法，判断其是否是 promise | deferred
            if (returnBeforeValue && typeof returnBeforeValue.then === 'function') {
                returnBeforeValue.then(function () {
                    that._executeOpen(time, executeOpenAfter);
                })
            } else {
                that._executeOpen(time, executeOpenAfter);
            }
        },

        _executeOpenBefore: function () {
            if (this.openBefore !== $.noop) {
                return this.openBefore();
            }
        },

        _executeOpen: function (time, callback) {
            var eachAnimateTime = time / 2;
            var $modalBody = this.$modalBody;
            var $modal = this.$modal;

            $modal.css({
                opacity: 0,
                display: 'block'
            });

            var h = $modalBody.height();
            var windowHeight = $window.height();
            var topAfter = Math.max(20, (windowHeight - h) / 2) + 'px';
            var topBefore = -h + 'px';
            var marginBottom = topAfter;

            $body.addClass('body-modal-open');
            $modalBody.css({
                top: topBefore,
                marginBottom: marginBottom
            });

            $modal.animate({opacity: 1}, eachAnimateTime, function () {
                $modalBody.animate({
                    top: topAfter
                }, eachAnimateTime, callback);
            });
        },

        _executeOpenAfter: function () {
            if (this.openBefore !== $.noop) {
                return this.openAfter();
            }
        },

        _close: function (time) {
            time = time || this.animateTime;
            this.$modal.fadeOut(time);
            $body.removeClass('body-modal-open');
        },

        close: function (time) {
            this._close(time);
        },

        open: function (time) {
            this._open(time);
        }
    });



    return Modal;
});