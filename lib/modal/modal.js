/**
 * @file modal
 * @author Tang Chao
 */

define([
    'text!./modal.ejs',
    'util/browser',
    'jquery',
    'underscore',
    'ejs'
], function (
    html,
    browser,
    $,
    _
) {
    var CLASS_MODAL_HTML_OPEN = 'wd-html-modal-open';
    var CLASS_MODAL_SMALL = 'wd-modal-small';
    var CLASS_MODAL_LARGE = 'wd-modal-large';
    var CLASS_MODAL_FULL = 'wd-modal-full';
    var CLASS_MODAL_BODY = 'wd-modal-body';
    var CLASS_MODAL_HEADER_CLOSE = 'wd-modal-header-close';
    var CLASS_BUTTON = 'wd-modal-button';

    
    var $window = $(window);
    var $html = $('html');
    var $body = $('body');
    
    //弹框计数，避免套娃让 <html> 出现时机不对
    var modalCount = 0;
    
    /**
     * Modal
     * @param options.animateTime
     * @param options.handleList: 每一项有 text, callback, isPrimary, 如果是简单关闭弹窗，则不需要 callback
     * @param options.headerClosable
     * @param options.size 取值有：small、normal、large、full
     * @param options.content
     * @param options.openBefore: 如果返回一个 promise | deferred 对象，则等待 resolve 后才执行载入动画，this 指向 modal 实例
     * @param options.openAfter: this 指向 modal 实例
     * @constructor
     */
    function Modal(options) {
        var defaultOptions = {
            animateTime: 300,
	        headerClosable: true,
	        maskClosable: true,
            size: 'normal',
            title: '模态框',
            content: '',
            handleList: [],
            openBefore: $.noop,
            openAfter: $.noop
        };
        $.extend(this, defaultOptions, options);
        
        if (browser.isIE8) {
            this.animateTime = 0;
        }

        this._init();

        return this;
    }

    $.extend(Modal.prototype, {
        _init: function () {
            var that = this;
            var renderData = {
                title: this.title,
	            headerClosable: this.headerClosable,
                size: this.size,
                content: this.content,
                handleList: this.handleList
            };
            var str = ejs.render(html, renderData);

            var $modal = this.$modal = $('<div class="wd-modal"></div>');
            $modal.html(str);
            $body.append($modal);

            var size = this.size;
            if (size === 'small') {
                $modal.addClass(CLASS_MODAL_SMALL);
            } else if (size === 'large') {
                $modal.addClass(CLASS_MODAL_LARGE);
            } else if (size === 'full') {
	            $modal.addClass(CLASS_MODAL_FULL);
            }
            
            this.$modalBody = $modal.find('.' + CLASS_MODAL_BODY);

            $modal.on('click', '.' + CLASS_MODAL_HEADER_CLOSE, function () {
                that._close();
            });

            $modal.on('click', '.' + CLASS_BUTTON, function (event) {
                that._handleFooterButtonClick(event);
            });

	        $modal.on('click', function (event) {
	            if ($modal.get(0) === event.target && that.maskClosable) {
		            that._close();
                }
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
            if (returnBeforeValue && _.isFunction(returnBeforeValue.then)) {
                returnBeforeValue.then(function () {
                    that._executeOpen(time, executeOpenAfter);
                })
            } else {
                that._executeOpen(time, executeOpenAfter);
            }
        },

        _executeOpenBefore: function () {
	        return this.openBefore();
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

            if (modalCount === 0) {
	            $html.addClass(CLASS_MODAL_HTML_OPEN);
	
	            if ($body.innerHeight() > $html.height()) {
		            $html.css('padding-right', '17px')
	            }
            }

	        modalCount ++;
            
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
	        return this.openAfter();
        },

        _close: function (time) {
            time = time || this.animateTime;
            
            var that = this;
            that.$modal.fadeOut(time, function () {
                if (modalCount === 1) {
	                $html.removeClass(CLASS_MODAL_HTML_OPEN);
	                $html.css('padding-right', '0')
                }
                
                modalCount --;
	            
	            that.$modal.remove();
	            
            });
            
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