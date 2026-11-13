'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// // -----------------------------------------
// /**
//  * @knighttower
//  * @url knighttower.io
//  * @git https://github.com/knighttower/
//  */
// // -----------------------------------------


// -----------------------------------------
/**
 * Checks if the value is a plain object.
 *
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 */
const isPlainObject = (value) => {
    if (value === null || typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
};

/**
 * Merges two or more objects into a single new object. Arrays and other types are overwritten.
 * Neither the target nor the sources are modified. Values that are not merged are copied by reference.
 *
 * @param {object} target The target object.
 * @param {...object} sources The source objects.
 * @returns {object} A new merged object.
 */
const extend = (target, ...sources) => {
    return sources.reduce(
        (acc, source) => {
            if (isPlainObject(source)) {
                Object.entries(source).forEach(([key, value]) => {
                    // Assigning '__proto__' (e.g. from parsed JSON) would replace the prototype of the result
                    if (key === '__proto__') {
                        return;
                    }
                    acc[key] =
                        isPlainObject(value) && isPlainObject(acc[key])
                            ? extend(acc[key], value)
                            : value; // If it's not an object, directly assign it
                });
            } else if (typeof source !== 'string') {
                // Other objects (class instances, arrays) are merged directly.
                // Strings are skipped since they would be spread one character per key.
                Object.assign(acc, source);
            }
            return acc;
        },
        { ...target }
    );
};

// //   utility; {
//     convertToBool,
//     currencyToDecimal,
//     convertToNumber,
//     dateFormat,
//     decimalToCurrency,
//     emptyOrValue,
//    extend,
//     formatPhoneNumber,
//     getDynamicId,
//     getRandomId,
//     includes,
//     isEmpty, // from https://moderndash.io/
//     isNumber,
//     instanceOf,
//     toCurrency,
//     toDollarString,
//     typeOf,
//     validateEmail,
//     validatePhone,
//     makeArray,
//     uuid,
//     uniqueId,
// };

// Knighttower BlockUI v1.0.0
// =========================================
// --> config
// --------------------------
/**
// -----------------------------------------
// BlockUi defaults
$.blockui.defaults = {
    loader: false,
    tag: 'div',
    content: '<h4>Please wait...</h4>',
    css: {
        padding: 0,
        margin: 0,
        width: '100vw',
        height: '100vh',
        top: '0',
        left: '0',
        textAlign: 'center',
        color: '#000',
        border: '1px dashed #000',
        backgroundColor: 'transparent',
        cursor: 'wait',
        display: 'flex',
    },
    overlayCSS: {
        backgroundColor: '#000',
        opacity: 0.6,
        cursor: 'default',
    },
    cursorReset: 'default',
    iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
    forceIframe: false,
    zindex: 9000,

    bindEvents: true,
    constrainTabKey: true,
    fadeIn: 200,
    fadeOut: 400,
    timeout: 0,
    showOverlay: true,
    focusInput: true,
    focusableElements: ':input:enabled:visible',
    onBlock: null,
    onUnblock: null,
    onOverlayClick: null,
    blockMsgClass: 'x-block-ui__content',
    ignoreIfBlocked: false,
};
 */
// Example of extending the defaults
/**
    $.extend(true, $.blockui.defaults, {
    loader: '<div class="loader__top"><div class="loader"></div></div>',
    content: 'Processing, please wait...',
    tag: 'h5',
    css: {
        border: 'none',
        backgroundColor: 'none',
        color: '#888',
        // display: 'flex',
    },
    overlayCSS: {

        backgroundColor: '#000',
        opacity: 0.8,
    },
    zindex: 9999,
}); */

/**
 * Installs the blocking UI on the given element.
 * @usage
 * --> block the whole page
 * $.blockui.on('Please wait...');
 * $.blockui.on({ content: 'Please wait...' });
 * $.blockui.on({ content: 'Please wait...', loader: '<div class="loader"></div>' });
 * $.blockui.on({ content: '<h4>Please wait...</h4>' });
 * $.blockui.off();
 * --> block an element
 * $(element).block();
 * $(element).block({ content: 'Please wait...' });
 * $(element).unblock();
 */
const _blockUI = (function ($, undefined$1) {

    $.fn._fadeIn = $.fn.fadeIn;
    const noOp = $.noop || function () {};

    const loaderCss =
        '<style>.x-ldr,.x-ldr div{box-sizing:border-box}.x-ldr{display:inline-block;position:relative;width:80px;height:30px}.x-ldr div{position:absolute;top:25%;width:12px;height:12px;border-radius:50%;background:#a6a8b5;animation-timing-function:cubic-bezier(0,1,1,0)}.x-ldr div:nth-child(1),.x-ldr div:nth-child(2){left:8px}.x-ldr div:nth-child(3){left:32px}.x-ldr div:nth-child(4){left:56px}.x-ldr div:nth-child(1){animation:x-ldr1 0.6s infinite}.x-ldr div:nth-child(2),.x-ldr div:nth-child(3){animation:x-ldr2 0.6s infinite}.x-ldr div:nth-child(4){animation:x-ldr3 0.6s infinite}@keyframes x-ldr1{0%{transform:scale(0)}100%{transform:scale(1)}}@keyframes x-ldr3{0%{transform:scale(1)}100%{transform:scale(0)}}@keyframes x-ldr2{0%{transform:translate(0,0)}100%{transform:translate(24px,0)}}</style>';

    function getHighestZIndex() {
        const elements = document.querySelectorAll(
            'div, span, section, header, footer, aside, main, article'
        );
        let highestZIndex = 0;

        elements.forEach((el) => {
            const zIndex = window.getComputedStyle(el).zIndex;
            if (!isNaN(zIndex) && zIndex !== 'auto') {
                highestZIndex = Math.max(highestZIndex, Number(zIndex));
            }
        });
        return highestZIndex + 1;
    }

    $.blockUI = $.blockui = {
        on: function (content, options = {}) {
            if (isPlainObject(content)) {
                options = content;
                content = null;
            }
            install(window, { content, ...options });
        },
        off: function (options = {}) {
            remove(window, options);
        },
        defaults: {
            loader: '<div class=x-ldr><div></div><div></div><div></div><div></div></div>',
            showLoader: true,
            tag: 'div',
            content: '',
            css: {
                padding: 0,
                margin: 0,
                width: '100vw',
                height: '100vh',
                top: '0',
                left: '0',
                textAlign: 'center',
                color: '#000',
                border: '1px dashed #000',
                backgroundColor: 'transparent',
                cursor: 'wait',
                display: 'flex',
                position: 'fixed',
            },
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'default',
                position: 'fixed',
            },
            cursorReset: 'default',
            iframeSrc: /^https/i.test(window.location.href || '')
                ? 'javascript:false'
                : 'about:blank',
            forceIframe: false,
            zindex: 'auto',

            bindEvents: true,
            constrainTabKey: true,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
            showOverlay: true,
            focusInput: true,
            focusableElements: ':input:enabled:visible',
            onBlock: null,
            onUnblock: null,
            onOverlayClick: null,
            blockMsgClass: 'x-block-ui__content',
            ignoreIfBlocked: false,
        },
    };

    $.fn.block = function (opts) {
        if (this[0] === window) {
            $.blockui.on(opts);
            return this;
        }
        const fullOpts = extend($.blockui.defaults, opts || {});
        this.each(function () {
            const $el = $(this);
            if (fullOpts.ignoreIfBlocked && $el.data('x-block-ui.isBlocked')) return;
            $el.unblock({ fadeOut: 0 });
            if ($.css(this, 'position') === 'static') {
                this.style.position = 'relative';
                $el.data('x-block-ui.static', true);
            }
            install(this, fullOpts);
        });

        return this;
    };

    $.fn.unblock = function (opts) {
        if (this[0] === window) {
            $.blockui.off(opts);
            return this;
        }
        return this.each(function () {
            remove(this, opts);
        });
    };

    let pageBlock = null;
    let pageBlockEls = [];

    function install(el, opts) {
        $.blockui.isOn = true;
        opts = extend($.blockui.defaults, opts);
        const full = el === window;
        const $el = $(el);
        const $body = $('body');
        const content = [
            '<',
            opts.tag,
            ' class="block-ui-content-box" style="color: #FFF;">',
            opts.content ?? $.blockui.defaults.content,
            '<span style="display:block; width:100%; height:1px; clear:both;"></span>',
            opts.showLoader ? opts.loader : '',
            '</',
            opts.tag,
            '>',
        ].join('');

        if (opts.ignoreIfBlocked && $el.data('x-block-ui.isBlocked')) return;

        opts.overlayCSS = { ...$.blockui.defaults.overlayCSS, ...(opts.overlayCSS || {}) };
        if (!full) {
            opts.overlayCSS = {
                ...opts.overlayCSS,
                ...{ position: 'absolute', width: $el.width(), height: $el.height() },
            };
        }
        if (opts.onOverlayClick) opts.overlayCSS.cursor = 'pointer';

        $el.data('x-block-ui.onUnblock', opts.onUnblock);
        let z = typeof opts.zindex !== 'number' ? getHighestZIndex() : opts.zindex;

        let lyr1, lyr2, lyr3;
        if (opts.forceIframe) {
            // prettier-ignore
            lyr1 = $(
                `<iframe class="x-block-ui" style="z-index:${z++};display:none;border:none;margin:0;padding:0;position:absolute;width:100vw;height:100vh;top:0;left:0" src="${opts.iframeSrc}"></iframe>`
            );
        }
        // prettier-ignore
        lyr2 = $(
            `<div class="x-block-ui x-block-ui__overlay" style="z-index:${z++};display:none;border:none;margin:0;padding:0;width:100vw;height:100vh;top:0;left:0"></div>`
        );
        // prettier-ignore
        lyr3 = $(
            `<div class="x-block-ui ${opts.blockMsgClass} ${full ? 'block-ui__page' : 'block-ui__element'}" style="z-index:${z + 10};display:none;${full ? 'flex-direction: column;align-items: center;justify-content: center;' : ''}"></div>`
        );

        lyr2.css(opts.overlayCSS);

        if (opts.forceIframe) lyr1.css('opacity', 0.0);

        const layers = [lyr1, lyr2, lyr3];
        const $par = full ? $body : $el;
        layers.forEach((layer) => layer && layer.appendTo($par));

        if (content) {
            lyr3.css({ ...$.blockui.defaults.css, ...(opts.css || {}) });
            if (!full) {
                lyr3.css({
                    position: 'absolute',
                    width: $el.width(),
                    height: $el.height(),
                });
            }

            lyr3.append(content);

            if (content.jquery || content.nodeType) $(content).show();
        }

        if (opts.forceIframe && opts.showOverlay) lyr1.show();
        if (opts.fadeIn) {
            const cb = opts.onBlock || noOp;
            const cb1 = opts.showOverlay && !content ? cb : noOp;
            const cb2 = content ? cb : noOp;
            if (opts.showOverlay) lyr2._fadeIn(opts.fadeIn, cb1);
            if (content) lyr3._fadeIn(opts.fadeIn, cb2);
        } else {
            if (opts.showOverlay) lyr2.show();
            if (content) lyr3.show();
            if (opts.onBlock) opts.onBlock.bind(lyr3)();
        }

        bind(1, el, opts);

        if (full) {
            pageBlock = lyr3[0];
            pageBlockEls = $(opts.focusableElements, pageBlock);
            $body.css('overflow', 'hidden');
            if (opts.focusInput) setTimeout(() => focus(false), 20);
        }

        if (opts.timeout) {
            const to = setTimeout(() => {
                if (full) {
                    $.blockui.off(opts);
                } else {
                    $el.unblock(opts);
                }
            }, opts.timeout);
            $el.data('x-block-ui.timeout', to);
        }
    }

    function remove(el, opts) {
        $.blockui.isOn = false;
        const full = el === window;
        const $el = $(el);
        const $body = $('body');
        const data = $el.data('x-block-ui.history');
        const to = $el.data('x-block-ui.timeout');

        if (to) {
            clearTimeout(to);
            $el.removeData('x-block-ui.timeout');
        }

        opts = extend($.blockui.defaults, opts);
        bind(0, el, opts);

        // Prefer a single fade/hide pass
        const els = full ? $body.children('.x-block-ui') : $el.children('.x-block-ui');

        // Batch fade-out if required
        if (opts.fadeOut) {
            // Single pass fade-out
            els.stop().fadeOut(opts.fadeOut, () => {
                batchRemove(els, data, opts, el);
            });
        } else {
            // Single pass hide
            els.hide();
            batchRemove(els, data, opts, el);
        }
        if (full) {
            pageBlock = null;
            pageBlockEls = [];
            $body.css('overflow', '');
        }
    }

    function batchRemove(els, data, opts, el) {
        // Batch removal from DOM
        els.each(function () {
            if (this.parentNode) this.parentNode.removeChild(this);
        });

        // Restore any element references and run onUnblock callback
        const $el = $(el);
        if (data?.el) {
            const { el: node, display, position, parent } = data;
            node.style.display = display;
            node.style.position = position;
            if (parent) parent.appendChild(node);
            $el.removeData('x-block-ui.history');
        }

        if (typeof opts.onUnblock === 'function') {
            opts.onUnblock(el, opts);
        }
    }

    function bind(isBlocking, el, opts) {
        const isFullPage = el === window;
        const $el = $(el);

        if (
            !isBlocking &&
            ((isFullPage && !pageBlock) || (!isFullPage && !$el.data('x-block-ui.isBlocked')))
        ) {
            return;
        }

        $el.data('x-block-ui.isBlocked', isBlocking);

        if (!isFullPage || !opts.bindEvents || (isBlocking && !opts.showOverlay)) {
            return;
        }

        const events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
        $(document)[isBlocking ? 'on' : 'off'](events, opts, handler);
    }

    function handler(e) {
        if (e.type === 'keydown' && e.keyCode === 9) {
            if (pageBlock && e.data.constrainTabKey) {
                const els = pageBlockEls;
                const fwd = !e.shiftKey && e.target === els[els.length - 1];
                const back = e.shiftKey && e.target === els[0];
                if (fwd || back) {
                    setTimeout(() => focus(back), 10);
                    return false;
                }
            }
        }
        const opts = e.data;

        const target = $(e.target);
        if (target.hasClass('x-block-ui__overlay') && opts.onOverlayClick) {
            opts.onOverlayClick(e);
        }

        if (target.parents(`div.${opts.blockMsgClass}`).length > 0) return true;
        return target.parents().children().filter('div.x-block-ui').length === 0;
    }

    function focus(back) {
        if (!pageBlockEls) return;
        const e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
        if (e) e.focus();
    }

    $(document).ready(function () {
        $('head').append(loaderCss);
    });
})(window.$);

exports.blockui = _blockUI;
exports.default = _blockUI;
