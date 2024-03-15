// Author Knighttower
// MIT License
// Copyright (c) [2022] [knighttower] https://github.com/knighttower

// Inspired by http://wicky.nillia.ms/enquire.js

// Import the Element DOM helper

// -----------------------------------------

import {
    getDynamicId,
    selectElement,
    proxyObject,
    DomObserver,
    getDirectivesFromString as GetSettings,
} from '@knighttower/utility';
import AdaptiveElement from './classes/AdaptiveElement.js';
import { Teleport, TeleportGlobal } from './Teleport.js';
import QueryHandler from './QueryHandler.js';
import TeleportTo from './vue-components/TeleportTo.js';
import componentTeleportTo from './web-components/TeleportTo.js';

// =========================================
// --> ADAPTIVE JS
// --------------------------

/**
 * @module Adaptive
 * Add/remove classes/styles or teleport an element
 * @return {Object}
 * @example Adaptive(window, Adaptive)
 * @example Adaptive(this, Adaptive)
 * @example Adaptive.registerElement(element)
 * @see "example" folder for more
 */
const _adaptive = (function () {
    'use strict';

    const $window = typeof window !== 'undefined' ? window : {};

    // -----------------------------------------
    // This will make it reuse the same instance if already imported without overwrites
    if ($window.$adaptive) {
        return $window.$adaptive;
    }
    // -----------------------------------------

    /**
     * Register this library into the $window
     * @private
     * @return {Object}
     */
    const $this = { _mutable: ['registerElement', 'addQueryMinMax', 'addQueryExpression'] };

    const Adaptive = proxyObject($this);

    /**
     * All the elements that will be part of the grid
     * @private
     */
    const domElements = {};

    /**
     * Flag for isMounted
     * @private
     */
    var isMounted = false;

    /**
     * Flag for using Vue
     * @private
     */
    var useVue = false;

    /**
     * Flag for using React
     * @private
     */
    var useReact = false;

    /**
     * Flag for using React
     * @private
     */
    var useWeb = false;

    /**
     * Flag for using Hybrid
     * @private
     */
    var isHybrid = false;

    /**
     * queries possible sizes
     * @private
     */
    const screens = {
        320: [1, 379],
        480: [380, 519],
        520: [520, 599] /* up to : mobiles */,
        600: [600, 699] /* up to : mid-size-tables */,
        700: [700, 799] /* up to : tablets / ipad */,
        800: [800, 919] /* transition in between tablets and desktop */,
        920: [920, 999] /* from here on for desktops */,
        1000: [1000, 1199],
        1200: [1200, 1439],
        1440: [1440, 1599],
        1600: [1600, 1700],
    };

    /**
     * break the 3 major device types
     * @private
     */
    const devices = {
        mobile: [1, 599] /* Actual phones */,
        tablet: [600, 799] /* tablets in portrait or below */,
        odd: [800, 1023] /* small Laptops and Ipads in landscape */,
        desktop: [1024, 1920] /* Most common resolutions below 1920 */,
    };

    /**
     * break the 3 major device types
     * @private
     */
    const broadMediaQueries = {
        'non-desktop': [100, 1023],
        nondesktop: [100, 1023],
        fullscreen: [1920, 6000] /* Large monitos and fullscreen in 1920 res */,
    };

    /**
     * To register additional custom queries add the key:[min, max]
     * @private
     */
    const customMinMaxQueries = {};

    /**
     * To register additional custom queries add the key:'Query Expression'
     * @private
     */
    const customExpressionQueries = {};

    // =========================================
    // --> Utility
    // --------------------------

    /**
     * Get all the available queries
     * @private
     * @return {Object}
     */
    $this.getAllQueries = () => {
        return Object.assign({}, screens, devices, broadMediaQueries, customMinMaxQueries, customExpressionQueries);
    };

    /**
     * @memberof Adaptive
     * @inner
     * Get all the available min max queries
     * @return {Object}
     */
    $this.getMinMaxQueries = () => {
        return Object.assign({}, screens, devices, broadMediaQueries, customMinMaxQueries);
    };

    /**
     * @memberof Adaptive
     * @inner
     * Get all the available "expression" queries
     * @return {Object}
     */
    $this.getExpQueries = () => {
        return Object.assign({}, customExpressionQueries);
    };

    /**
     * @memberof Adaptive
     * @inner
     * Register an element
     * @param {String|Object} elementOrSelector
     * @param {Object} data Optional used directly to add the directives, but is mostly for VUe
     * @return {Void}
     */
    $this.registerElement = (elementOrSelector, data) => {
        let helper = selectElement(elementOrSelector);

        if (helper.isInDom()) {
            return registerThis(helper, data);
        } else {
            helper.whenInDom().then(function (element) {
                return registerThis(element, data);
            });
        }
    };

    /**
     * Register an element
     * @private
     * @param {String|Object} elementOrSelector
     * @param {Object} data Optional used directly to add the directives, but is mostly for VUe
     * @return {Void}
     */
    function registerThis(element, data) {
        // Register only unique non indexed elements
        if (!element.getAttribute('data-adaptive-id')) {
            let uniqueId = element.getHash();

            let settings = GetSettings(data || element.getAttribute('data-adaptive')).directive;

            //set the unique id to the element for later use
            element.domElement.setAttribute('data-adaptive-id', uniqueId);

            domElements[uniqueId] = new AdaptiveElement(
                {
                    adaptiveId: uniqueId,
                    helper: element,
                    domElement: element.domElement,
                    xpath: element.getXpathTo(),
                    settings: settings,
                    useVue: useVue,
                    useReact: useReact,
                },
                $this
            );

            return uniqueId;
        }
    }

    /**
     * @memberof Adaptive
     * @inner
     * Register A custom Query Min, Max
     * @param {String} id Identifier
     * @param {Number} min Number only, no units attached as it only handles pixels here
     * @param {Number} max Number only, no units attached as it only handles pixels here
     * @return {Void}
     */
    $this.addQueryMinMax = function (id, min, max) {
        if (!customMinMaxQueries[id]) {
            if (!min || !max) {
                throw new Error('Min or Max must be passed (id, min, max)', 1);
            }
            customMinMaxQueries[id] = [min, max];
        }
    };

    /**
     * @memberof Adaptive
     * @inner
     * Register A custom Query Expression
     * @param {String} id Identifier
     * @param {String} query Media query, example "screen and (max-width: 500em) and (orientation: landscape)"
     * @param {Number} max Number only, no units attached as it only handles pixels here
     * @return {Void}
     */
    $this.addQueryExpression = function (id, query) {
        if (!customExpressionQueries[id]) {
            customExpressionQueries[id] = query;
        }
    };

    /**
     * @memberof Adaptive
     * @inner
     * Register A custom Query Expression
     * @param {String} breakdownId Identifier like "tablet" or "mobile", etc
     * @param {Fucntion|Array} callback Function/Method or Array with object and property to set
     * @example Adaptive.if('mobile', [object, propertyId]) || Adaptive.if('mobile', () => {})
     * @return {Object} Proxy
     */
    $this.if = function (breakdownId, callback = null) {
        let isFunction = callback && typeof callback === 'function';
        let isArray = callback && Array.isArray(callback);
        let observer = {};

        observer[breakdownId] = {
            _private: ['breakdownId', 'match', 'ifElse', 'do', 'removeAfterExec'],
            _mutable: ['ifElse', 'match', 'removeAfterExec'],
            uid: getDynamicId(),
            breakdownId: breakdownId,
            match: false,
            executed: false,
            removeAfterExec: false,
            ifElse: null,
            else(ifElse) {
                if (ifElse && typeof ifElse === 'function') {
                    this.ifElse = ifElse;
                }
            },
            onlyOnce() {
                this.removeAfterExec = true;
                if (this.executed) {
                    QueryHandler.remove(this.uid, 'uid');
                }
            },
            do() {
                if (this.match) {
                    if (isFunction) {
                        callback();
                    }
                    if (isArray) {
                        callback[0][callback[1]] = true;
                    }

                    if (this.removeAfterExec) {
                        QueryHandler.remove(this.uid, 'uid');
                    }
                    this.executed = true;
                    return true;
                }

                if (isArray) {
                    callback[0][callback[1]] = false;
                }

                if (this.ifElse) {
                    this.ifElse();
                }

                return false;
            },
        };

        QueryHandler.add(
            observer,
            (o) => {
                o.match = true;
                o.do();
            },
            (o) => {
                o.match = false;
                o.do();
            },
            $this
        );

        return proxyObject(observer[breakdownId]);
    };

    /**
     * Full reset, handle with care
     * @private
     * @return {Void}
     */
    $this.reset = () => {
        Object.keys(domElements).forEach((key) => delete domElements[key]);
        DomObserver.cleanup();
        QueryHandler.reset();
        isMounted = false;
    };

    // =========================================
    // --> DomReady and INIT
    // --------------------------

    /**
     * Real init for the app
     * @private
     */
    function _init() {
        isMounted = true;
        document.querySelectorAll('[data-adaptive]:not([data-adaptive-id])').forEach(function (element) {
            $this.registerElement(element);
        });

        QueryHandler.init();
        if (useVue || useReact) {
            // hybrid mode
            // support for static and dynamic elements
            if (isHybrid) {
                TeleportGlobal();
            }
        } else {
            // vanilla js
            TeleportGlobal();
        }
    }

    /**
     * @memberof Adaptive
     * @inner
     * Initialization, cam be called externally to reinitialized after dom loaded
     * @return {Void}
     */
    $this.init = () => {
        if (isMounted) {
            return false;
        }

        if (
            document.readyState === 'complete' ||
            (document.readyState !== 'loading' && !document.documentElement.doScroll)
        ) {
            return domIsReady();
        } else {
            // Use the handy event callback
            document.addEventListener('DOMContentLoaded', domIsReady);
            // A fallback to $window.onload, that will always work
            $window.addEventListener('load', domIsReady);
        }

        return;
    };

    /**
     * When ready trigger the initialization
     * @private
     */
    function domIsReady() {
        document.removeEventListener('DOMContentLoaded', domIsReady);
        $window.removeEventListener('load', domIsReady);
        _init();

        return;
    }

    /**
     * @memberof Adaptive
     * @inner
     * For use with Vue
     * @param {Vue} Vue Vue instance
     * @param {Boolean} hybrid Allow support when using static and dynamic
     * @return {Vue}
     */
    $this.useVue = (Vue, hybrid = false) => {
        if (hybrid) {
            isHybrid = true;
        }
        if (typeof Vue === 'object' && typeof Vue.mixin === 'function') {
            useVue = true;
            let installer = {
                install: (app) => {
                    // For Options API
                    app.config.globalProperties.Adaptive = Adaptive;
                    // For composition API
                    app.provide('Adaptive', Adaptive);
                },
            };

            /**
             * Adaptive used as vue.$Adaptive
             * @private
             */
            Vue.use(installer);
            /**
             * Adaptive used as v-adaptive
             * @private
             */
            Vue.directive('adaptive', {
                mounted: (element, binding) => {
                    Adaptive.registerElement(element, binding.value);
                },
            });

            /**
             * Adaptive used as v-teleport-to
             * @private
             */
            Vue.directive('teleport-to', {
                mounted: (element, binding) => {
                    return new Teleport(element).beam(binding.value);
                },
            });

            Vue.component('TeleportTo', TeleportTo);

            /**
             * Adaptive used for non Vue elements register with data-adaptive attr
             * Hybrid mode
             * @private
             */
            Vue.mixin({
                mounted: () => {
                    return Adaptive.init();
                },
            });
        }

        return Vue;
    };

    //docs
    /**
     * For use with Web Components
     * @private
     * @return {Void}
     */
    $this.useWebComponent = () => {
        if (!useWeb && !useVue) {
            componentTeleportTo();
            useWeb = true;
        }
    };

    /**
     * @memberof Adaptive
     * @inner
     * For use with React
     * @param {React} React React instance
     * @param {Boolean} hybrid Allow support when using static and dynamic
     * @return {Void}
     */
    $this.useReact = (React, hybrid = false) => {
        if (hybrid) {
            isHybrid = true;
        }
        if (typeof React === 'object') {
            $this.useWebComponent();
            useReact = true;
        }
    };

    $window.$adaptive = Adaptive;

    return $window.$adaptive;
})();

export { _adaptive as Adaptive, _adaptive as default, _adaptive as adaptive };
