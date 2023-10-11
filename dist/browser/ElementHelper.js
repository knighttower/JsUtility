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

/***/ "./src/DomObserver.js":
/*!****************************!*\
  !*** ./src/DomObserver.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// Author Knighttower\n// MIT License\n// [2022] [Knighttower] https://github.com/knighttower\n/**\n * @module DomObserver\n * Detect DOM changes\n * @name DomObserver\n * @param {window} selector\n * @param {Function}\n * @return DomObserver\n * @example DomObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })\n * @example DomObserver.removeOnNodeChange('elementIdentifier')\n */\n/**\n * Holds memory of registered functions\n * @private\n */\nconst executeOnNodeChanged = {};\n/**\n * When node change\n * @param {String} id\n * @param {Function} callback Callback when any node changes/ add/deleted/modified\n * @return {Void}\n */\nconst addOnNodeChange = (id, callback) => {\n    if (callback) {\n        executeOnNodeChanged[id] = callback;\n    }\n};\n/**\n * Remove from node change\n * @param {String} id\n * @return {Void}\n */\nconst removeOnNodeChange = (id) => {\n    if (id) {\n        delete executeOnNodeChanged[id];\n    }\n};\n/**\n * Deep cleanup\n * @return {Void}\n */\nconst cleanup = () => {\n    Object.keys(executeOnNodeChanged).forEach((key) => delete executeOnNodeChanged[key]);\n};\n/**\n * Observer\n * @private\n * @return {MutationObserver}\n */\n(() => {\n    if (typeof window !== 'undefined') {\n        const callback = (mutationList, observer) => {\n            for (const mutation of mutationList) {\n                if (mutation.type === 'childList') {\n                    for (const id in executeOnNodeChanged) {\n                        executeOnNodeChanged[id]();\n                    }\n                }\n            }\n        };\n        const config = {\n            childList: true,\n            subtree: true,\n        };\n        const observer = new MutationObserver(callback);\n        observer.observe(document.body, config);\n    }\n})();\nconst DomObserver = {\n    executeOnNodeChanged,\n    addOnNodeChange,\n    removeOnNodeChange,\n    cleanup,\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomObserver);\n\n\n//# sourceURL=webpack://ElementHelper/./src/DomObserver.js?");

/***/ }),

/***/ "./src/ElementHelper.js":
/*!******************************!*\
  !*** ./src/ElementHelper.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _DomObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DomObserver */ \"./src/DomObserver.js\");\n// Author Knighttower\n// MIT License\n// Copyright (c) [2022] [Knighttower] https://github.com/knighttower\n\n\n\n/**\n * @class Adds some extra functionality to interact with a DOM element\n * @param {String|Object} selector Class or ID or DOM element\n * @param {String} scope The scope to search in, window, document, dom element. Defaults to document\n * @return {Object}\n * @example new ElementHelper('elementSelector')\n * @example new ElementHelper('elementSelector', domElement|window|document)\n *\n */\nclass ElementHelper {\n    /**\n     * Constructor\n     * @param {String|Object} selector\n     * @return {Object}\n     */\n    constructor(selector, scope = document) {\n        this.selector = selector;\n        if (typeof selector === 'object') {\n            this.domElement = selector;\n        } else if (String(selector).includes('//')) {\n            this.domElement = this.getElementByXpath(selector);\n        } else {\n            this.domElement = scope.querySelector(selector);\n        }\n    }\n\n    // =========================================\n    // --> Public\n    // --------------------------\n\n    /**\n     * Check if the element exists or is visible. It will keep querying\n     * @return {Boolean}\n     */\n    isInDom() {\n        return Boolean(this.domElement?.outerHTML);\n    }\n\n    /**\n     * Wait for element exists or is visible. It will keep querying\n     * @function whenInDom\n     * @return {Promise}\n     */\n    whenInDom() {\n        let $this = this;\n        let callbackId = Date.now() + Math.floor(Math.random() * 1000);\n\n        return new Promise(function (resolveThis) {\n            if (!$this.isInDom()) {\n                _DomObserver__WEBPACK_IMPORTED_MODULE_0__[\"default\"].addOnNodeChange(callbackId, () => {\n                    let element = new ElementHelper($this.selector);\n                    if (element.isInDom()) {\n                        $this = element;\n                        resolveThis($this);\n                        _DomObserver__WEBPACK_IMPORTED_MODULE_0__[\"default\"].removeOnNodeChange(callbackId);\n                    }\n                });\n            } else {\n                resolveThis($this);\n            }\n        });\n    }\n\n    /**\n     * Find element by Xpath string\n     * @param {String} xpath\n     * @example getElementByXpath(\"//html[1]/body[1]/div[1]\")\n     * @return {Object} DOM element\n     */\n    getElementByXpath(xpath) {\n        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;\n    }\n\n    /**\n     * Get the element xpath string\n     * @author Based on https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reload-to-the-same-place-even-if/2631931#2631931\n     * @return {String}\n     */\n    getXpathTo() {\n        let element = this.domElement;\n\n        if (element.id) {\n            return \"//*[@id='\" + element.id + \"']\";\n        }\n        if (element === document.body) {\n            return '//' + element.tagName;\n        }\n\n        let ix = 0;\n        let siblings = element.parentNode.childNodes;\n        for (let i = 0; i < siblings.length; i++) {\n            let sibling = siblings[i];\n            if (sibling === element) {\n                return (\n                    new ElementHelper(element.parentNode).getXpathTo() + '/' + element.tagName + '[' + (ix + 1) + ']'\n                );\n            }\n            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {\n                ix++;\n            }\n        }\n    }\n\n    /**\n     * Get the element attribute, but parse it if it is an object or array\n     * @param {String} attr Atrribute name\n     * @return {String|Array|Object|Null}\n     */\n    getAttribute(attr) {\n        return this.domElement.getAttribute(attr) || null;\n    }\n\n    /**\n     * Create a unique has for the element derived from its xpath\n     * @author Based on https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/\n     * @return {String}\n     */\n    getHash() {\n        let string = String(this.getXpathTo());\n        let hash = 0;\n\n        if (string.length === 0) {\n            return hash;\n        }\n\n        for (let i = 0; i < string.length; i++) {\n            let char = string.charCodeAt(i);\n            hash = (hash << 5) - hash + char;\n            hash = hash & hash;\n        }\n\n        return hash;\n    }\n}\n\n/**\n * Future\n * @private\n * @todo enhance to extend the prototype like https://stackoverflow.com/questions/779880/in-javascript-can-you-extend-the-dom\n */\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ElementHelper);\n\n\n//# sourceURL=webpack://ElementHelper/./src/ElementHelper.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/ElementHelper.js");
/******/ 	window.ElementHelper = __webpack_exports__;
/******/ 	
/******/ })()
;