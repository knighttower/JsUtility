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

/**
 * x-toast.js
 * A dead simple toast notification library for JavaScript.
 * @version 1.0.0
 * @license MIT
 * @methods info, success, warning, error, config, transition
 * @method info - show an info toast message.
 * @method success - show a success toast message.
 * @method warning - show a warning toast message.
 * @method error - show an error toast message.
 * @method config - set the default configuration options.
 * @method transition - set the default CSS transition name.
 * @configs classname, transition, insertBefore, duration, autoClose, progressBar, onShow, onHide, position
 * @config classname- String - additional class name for the toast container.
 * @config transition - String - name of the CSS transition that will be used to show and hide all toast by default.
 * @config insertBefore - Boolean - specifies the way in which the toasts will be inserted in the HTML code.
 * @config duration - Integer - duration that the toast will be displayed in milliseconds.
 * @config autoClose - Boolean - enable or disable auto hiding on toast messages.
 * @config progressBar - Boolean - enable or disable the progress.
 * @config onShow - Function - will be fired when a toast message appears.
 * @config onHide - Function - will be fired when a toast message disappears.
 * @config position - String - the position where the toast will be inserted.
 * @transitions fade, slide-left-right, slide-up-down, slide-right-left, slide-down-up
 * @positions top-right, top-left, bottom-right, bottom-left
 * @example
 * $toast.info('This is an info message.');
 * $toast.success('This is a success message.');
 * $toast.warning('This is a warning message.');
 * $toast.error('This is an error message.');
 * $toast.config({ duration: 5000 });
 * $toast.transition('fade').info('This is an info message.');
 * $toast.config({ position: 'top-left' }).info('This is an info message.');
 * @css
 * uses the convention of {transition name}--init, {transition name}--show, {transition name}--hide for CSS transitions. Example: slide-left-right--init, slide-left-right--show, slide-left-right--hide.
 *
 *
 */
var toast = (function ($win, $doc) {

    const baseClass = 'x-toast';

    /**
     * Default configuration for plug-in:
     *
     * @var object
     */
    const _defaults = {
        // STRING: additional class name for the toast container:
        classname: 'x',
        // STRING: name of the CSS transition that will be used to show and hide all toast by default:
        transition: 'slide-left-right',
        // BOOLEAN: specifies the way in which the toasts will be inserted in the HTML code:
        // .... Set to BOOLEAN TRUE and the toast messages will be inserted before those already generated toasts.
        // .... Set to BOOLEAN FALSE otherwise.
        insertBefore: true,
        // INTEGER: duration that the toast will be displayed in milliseconds:
        // .... Default value is set to 4000 (4 seconds).
        // .... If it set to 0, the duration for each toast is calculated by text-message length.
        duration: 3000,

        // BOOLEAN: enable or disable auto hiding on toast messages:
        // .... Set to BOOLEAN TRUE  - to enable auto hiding.
        // .... Set to BOOLEAN FALSE - disable auto hiding. Instead the user must click on toast message to close it.
        autoClose: true,
        // BOOLEAN: enable or disable the progress:
        // .... Set to BOOLEAN TRUE  - enable the progress only if the autoClose option value is set to BOOLEAN TRUE.
        // .... Set to BOOLEAN FALSE - disable the progress.
        progressBar: true,

        // callback:
        // onShow function will be fired when a toast message appears.
        onShow: function (type) {},

        // callback:
        // onHide function will be fired when a toast message disappears.
        onHide: function (type) {},

        // the position where the toast will be inserted:
        position: 'top-right',
    };

    /**
     * Map to create each necessary CSS classess:
     *
     * @var object
     */
    const _mappings = {
        container: '{:class-name}__container',
        mainwrap: '{:class-name}__wrapper',
        toasts: {
            info: '{:class-name}--info',
            success: '{:class-name}--success',
            warning: '{:class-name}--warning',
            error: '{:class-name}--error',
        },
        animate: {
            init: '{:transition}--init',
            show: '{:transition}--show',
            hide: '{:transition}--hide',
        },
        progress: '{:class-name}__progress',
        position: '--{:position}',
    };

    /**
     * Simple creation of an Element Node with the specified 'name'.
     *
     * @return HTML Element
     */
    function node(name) {
        return $doc.createElement(name);
    }

    /**
     * Returns the parent Element or Node from any other HTML Element.
     *
     * @return HTML Element
     */
    function parentElement(el) {
        return el.parentElement || el.parentNode;
    }

    function containsClass(el, className) {
        return el.classList.contains(className); // Modern browsers support this
    }

    function addClass(el, ...classNames) {
        classNames.forEach((name) => {
            if (!containsClass(el, name)) {
                el.classList.add(name);
            }
        });
        return el;
    }

    function addEvent(el, evt, fn, bubble = false) {
        el.addEventListener(evt, fn, bubble);
        return el;
    }

    function removeEvent(el, evt, fn, bubble = false) {
        el.removeEventListener(evt, fn, bubble);
        return el;
    }

    let cachedTransitionEvent = null;
    /**
     * Detect the property name of supported transition event.
     *
     * Function from David Walsh:
     * http://davidwalsh.name/css-animation-callback
     *
     * @return string|undefined (if transitions not supported by client)
     */
    function whichTransitionEvent() {
        if (cachedTransitionEvent) {
            return cachedTransitionEvent;
        }

        const el = document.createElement('div');
        const transitions = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend',
        };

        for (let t in transitions) {
            if (t in el.style) {
                cachedTransitionEvent = transitions[t];
                break;
            }
        }

        return cachedTransitionEvent;
    }

    /**
     * Replace each object values with a map of key => values:
     *
     * @return object
     */
    function walker(obj, map) {
        for (const o in obj)
            if (obj.hasOwnProperty(o) === true) {
                // ini loop:
                switch (typeof obj[o]) {
                    case 'object':
                        walker(obj[o], map);
                        break;
                    case 'string':
                        for (const m in map)
                            if (map.hasOwnProperty(m) === true) {
                                obj[o] = obj[o].replace(m, map[m]);
                            }
                        break;
                }
                // end loop.
            }

        return obj;
    }

    /**
     * Show the toast message with an CSS3 transition
     * if transition event is supported:
     *
     * @return void
     */
    const showToast = function (type, el, container, animate, duration, insertBefore, callback) {
        const onShowToast = (e) => {
            removeEvent(e.target, e.type, onShowToast, false);
            if (typeof callback == 'function') callback(type);
        };

        const show = () => {
            const transitionEvent = whichTransitionEvent();
            if (transitionEvent !== undefined) {
                // initialize the CSS transition event:
                addEvent(el, transitionEvent, onShowToast, false);
            } else {
                // navigator does not support transition events:
                if (typeof callback == 'function') callback(type);
            }
            addClass(el, animate.show);
        };

        // insert in the DOM and show toast:
        let beforeNode = container.childNodes;
        beforeNode = beforeNode[insertBefore === true ? 0 : beforeNode.length];
        container.insertBefore(el, beforeNode);
        setTimeout(show, 100);
    };

    /**
     * Hide the toast message with an CSS3 transition
     * if transition event is supported:
     *
     * @return void
     */
    const hideToast = function (type, el, duration, animate, callback) {
        const remove = () => {
            const container = parentElement(el); // the wrapper.
            el.remove();
            const num = container.childNodes.length;
            if (num < 1) {
                parentElement(container).remove();
            }
        };

        const onHideToast = (e) => {
            removeEvent(e.target, e.type, onHideToast, false);
            remove();
            if (typeof callback == 'function') callback(type);
        };

        const hide = () => {
            const transitionEvent = whichTransitionEvent();
            if (transitionEvent !== undefined) {
                // initialize the CSS transition event:
                addEvent(el, transitionEvent, onHideToast, false);
            } else {
                // navigator does not support transition events:
                remove();
                if (typeof callback == 'function') callback(type);
            }
            addClass(el, animate.hide);
        };
        setTimeout(hide, duration);
    };

    /**
     * Hide the toast message with an CSS3 transition when
     * the user clicks on the message:
     *
     * @return void
     */
    const hideToastOnClick = function (type, el, animate, callback, class2close) {
        const hideOnClick = function (e) {
            e.stopPropagation();
            // removeClass(el, class2close);
            hideToast(type, el, 0, animate, callback);
        };
        addClass(el, class2close);
        addEvent(el, 'click', hideOnClick);
    };

    /**
     * The progress:
     *
     * @return void
     */
    const showProgressBar = function (type, el, duration, transition) {
        const progress = () => {
            const progressBar = addClass(
                node('div'),
                transition.progress,
                transition.progress + '--' + type
            );
            el.appendChild(progressBar);

            let iterat = 0,
                offset = 0;
            const interval = setInterval(() => {
                iterat++;
                offset = Math.round((1500 * iterat) / duration);

                if (offset > 100) {
                    clearInterval(interval);
                } else {
                    progressBar.style.width = offset + '%';
                }
            }, 10);
        };
        setTimeout(progress, 100);
    };

    /**
     * Register a new transition only:
     *
     * @return string
     */
    const registerTransition = function (self, name) {
        if (typeof name === 'string') {
            self.classmap[name] = walker(
                { ..._mappings },
                {
                    '{:class-name}': baseClass,
                    '{:transition}': name,
                    '{:position}': self.settings.position,
                }
            );
        }
        return name;
    };

    /*!
     * The exposed public object:
     */

    class Toast {
        constructor(options) {
            this.settings = {};
            this.classmap = {};
            this.config(options || _defaults);
            this.transition(this.settings.transition);
        }

        config(options) {
            this.settings = extend(_defaults, this.settings, options || {});
            return this;
        }

        transition(name) {
            this.settings.transition = registerTransition(this, name);
            return this;
        }

        toast(type, message, durationOroptions) {
            const classes = this.classmap;
            let options = this.settings;

            if (typeof durationOroptions === 'number') {
                options.duration = durationOroptions;
            } else {
                options = extend(this.settings, durationOroptions || {});
            }

            // check if the transition name provided in options
            // exists in classes, if not register it:
            if (classes.hasOwnProperty(options.transition) === false) {
                registerTransition(this, options.transition);
            }
            // use the transition name provided in options:
            const transition = classes[options.transition];

            // check if the toast container exists:
            let container = $doc.querySelector('.' + transition.container);

            const containerExists = !!container;
            if (containerExists) {
                // create the toast container if not exists:
                container = container.querySelector('.' + transition.mainwrap); // use the wrapper instead of main container.
            } else {
                container = addClass(
                    node('div'),
                    transition.container,
                    transition.container,
                    transition.position
                );
                // create a alert wrapper instance:
                const wrapp = addClass(node('div'), transition.mainwrap);
                // append the alert wrapper and now, this is the main container:
                container.appendChild((container = wrapp));
            }

            // create a new toast instance
            const newToast = addClass(
                node('div'),
                baseClass,
                options.classname,
                transition.toasts[type],
                transition.animate.init
            );
            newToast.textContent = message;

            // insert the toast container into the HTML:
            if (!containerExists) {
                $doc.body.append(parentElement(container));
            }

            // STEP 1:
            // INI: showing the toas message
            // --------------------------------------------------------------------
            showToast(
                type,
                newToast,
                container,
                transition.animate,
                options.duration,
                options.insertBefore,
                options.onShow
            );
            // --------------------------------------------------------------------
            // END: showing the toas message

            // STEP 2:
            // INI: prepare the toast to hide it.
            // --------------------------------------------------------------------
            if (options.autoClose) {
                // hide the toast message automatically:
                hideToast(type, newToast, options.duration, transition.animate, options.onHide);
            } else {
                // hide the toast message on click it with an CSS3 transition:
                hideToastOnClick(
                    type,
                    newToast,
                    transition.animate,
                    options.onHide,
                    'close-on-click'
                );
            }
            // --------------------------------------------------------------------
            // END: prepare the toast to hide it.

            // OPTIONAL STEP (must be last):
            // INI: Enable or disable the progress.
            // --------------------------------------------------------------------
            if (options.progressBar && options.autoClose) {
                showProgressBar(type, newToast, options.duration, transition);
            }
            // --------------------------------------------------------------------
            // END: Enable or disable the progress.

            return this;
        }

        info(message, opts) {
            this.toast('info', message, opts);
        }

        success(message, opts) {
            this.toast('success', message, opts);
        }

        warning(message, opts) {
            this.toast('warning', message, opts);
        }

        error(message, opts) {
            this.toast('error', message, opts);
        }
    }

    $win.$toast = $win.$toast || new Toast();
})(window, document);

exports.default = toast;
