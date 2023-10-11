/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/UrlHelper.js":
/*!**************************!*\
  !*** ./src/UrlHelper.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ UrlHelper)\n/* harmony export */ });\n/**\n * URL Object Class with public methods for URL functions and manipulation.\n *\n * @module urlHelper\n */\nfunction UrlHelper(__u, undefined) {\n    'use strict';\n\n    /**\n     * Reference to the global window object.\n     * @type {Window}\n     */\n    const win = window;\n\n    /**\n     * Reference to the global document object.\n     * @type {Document}\n     */\n    const doc = document;\n\n    /**\n     * Get the host value, check if template head has defined this variable.\n     * @type {string|boolean}\n     */\n    const $H = win.$HOST || false;\n\n    /**\n     * Get the template value, check if template head has defined this variable.\n     * @type {string|boolean}\n     */\n    const $TMP = win.$TEMPLATE || false;\n\n    /**\n     * Server Protocol.\n     * @type {string}\n     */\n    const PROTOCOL = win.location.protocol.replace(':', '');\n\n    /**\n     * Hostname.\n     * @type {string}\n     */\n    const HOST = $H || win.location.host;\n\n    /**\n     * Template URL.\n     * @type {string}\n     */\n    const TEMPLATE = $TMP || '';\n\n    /**\n     * Current Pathname.\n     * @type {string}\n     */\n    const PATH = location.pathname;\n\n    /**\n     * Site URL.\n     * @type {string}\n     */\n    const SITE_URL = $H ? $H : `${PROTOCOL}://${HOST}`;\n\n    /**\n     * Full URL.\n     * @type {string}\n     */\n    const FULL_URL = $H ? `${$H}${PATH}` : `${PROTOCOL}://${HOST}${PATH}`;\n\n    /**\n     * Cached URL parameters.\n     * @type {Object|null}\n     */\n    let cachedURLParams = null;\n\n    /**\n     * Parse and return URL parameters.\n     *\n     * @return {Object} with params, queryString, search, keys, values, and collection.\n     * @private\n     */\n    const parseURLParams = () => {\n        if (cachedURLParams) return cachedURLParams;\n\n        const params = new URLSearchParams(win.location.search);\n        const vars = {};\n\n        for (const [key, value] of params.entries()) {\n            vars[key] = value;\n        }\n\n        cachedURLParams = {\n            params,\n            queryString: params.toString(),\n            search: win.location.search,\n            keys: Array.from(params.keys()),\n            values: Array.from(params.values()),\n            collection: vars,\n        };\n\n        return cachedURLParams;\n    };\n\n    /**\n     * Get the current page name (Last part of the URL).\n     *\n     * @return {string} Current page name.\n     */\n    __u.getPage = () => {\n        const cURL = doc.location.toString().toLowerCase();\n        const page = cURL.split('/').pop().split('.')[0];\n        return page || 'index'; // assuming 'index' as the default page name\n    };\n\n    /**\n     * Get the query object info from the current URL.\n     *\n     * @return {Object} with params, queryString, search, keys, values, and collection.\n     */\n    __u.getParams = () => {\n        return parseURLParams();\n    };\n\n    /**\n     * Get the query string from the current URL.\n     *\n     * @return {string} Query string.\n     */\n    __u.getQuery = () => {\n        return parseURLParams().queryString;\n    };\n\n    /**\n     * Add params to the current query string from the current URL.\n     *\n     * @param {Object} query - The query object to add.\n     * @return {Object} with collection and queryString.\n     */\n    __u.addToQuery = (query) => {\n        const currentQuery = parseURLParams().collection;\n        Object.assign(currentQuery, query);\n        const qString = Object.entries(currentQuery)\n            .map(([key, value]) => `${key}=${value}`)\n            .join('&');\n\n        return {\n            collection: currentQuery,\n            queryString: qString,\n        };\n    };\n\n    /**\n     * Get only the URL hash.\n     *\n     * @return {string} Current hash.\n     */\n    __u.getHash = () => win.location.hash.substring(1);\n\n    /**\n     * Set the URL hash.\n     *\n     * @param {string} h - The hash to set.\n     */\n    __u.setHash = (h) => {\n        doc.location.hash = h;\n    };\n\n    /**\n     * Remove the URL hash.\n     */\n    __u.deleteHash = () => {\n        history.pushState('', doc.title, win.location.pathname);\n    };\n\n    /**\n     * Go to a specific URL on the same page.\n     *\n     * @param {string} url - The URL to go to.\n     * @return {boolean} Always returns false to prevent browser default behavior.\n     */\n    __u.goTo = (url) => {\n        win.location.href = url;\n        return false;\n    };\n\n    /**\n     * Open a URL in the browser.\n     *\n     * @param {string} url - The URL to open.\n     * @param {string} [name='_blank'] - The name attribute for the new window.\n     * @param {string} [params=''] - The window parameters.\n     * @return {Window} The window object of the opened URL.\n     */\n    __u.open = (url, name = '_blank', params = '') => {\n        return win.open(url, name, params);\n    };\n\n    /**\n     * Execute a function if the current URL changes.\n     *\n     * @param {function} callback - The callback function to execute.\n     */\n    __u.onChange = (callback) => {\n        if (typeof callback === 'function') {\n            win.addEventListener('hashchange', callback);\n        }\n    };\n\n    // Expose constants\n    __u.fullUrl = FULL_URL;\n    __u.siteUrl = SITE_URL;\n    __u.template = TEMPLATE;\n    __u.protocol = PROTOCOL;\n    __u.host = HOST;\n    __u.path = PATH;\n    __u.readUrl = doc.URL;\n}\n\n\n//# sourceURL=webpack://UrlHelper/./src/UrlHelper.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/UrlHelper.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	window.UrlHelper = __webpack_exports__;
/******/ 	
/******/ })()
;