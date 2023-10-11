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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// Author Knighttower\n// MIT License\n// [2022] [Knighttower] https://github.com/knighttower\n/**\n * @module DomObserver\n * Detect DOM changes\n * @name DomObserver\n * @param {window} selector\n * @param {Function}\n * @return DomObserver\n * @example DomObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })\n * @example DomObserver.removeOnNodeChange('elementIdentifier')\n */\n/**\n * Holds memory of registered functions\n * @private\n */\nconst executeOnNodeChanged = {};\n/**\n * When node change\n * @param {String} id\n * @param {Function} callback Callback when any node changes/ add/deleted/modified\n * @return {Void}\n */\nconst addOnNodeChange = (id, callback) => {\n    if (callback) {\n        executeOnNodeChanged[id] = callback;\n    }\n};\n/**\n * Remove from node change\n * @param {String} id\n * @return {Void}\n */\nconst removeOnNodeChange = (id) => {\n    if (id) {\n        delete executeOnNodeChanged[id];\n    }\n};\n/**\n * Deep cleanup\n * @return {Void}\n */\nconst cleanup = () => {\n    Object.keys(executeOnNodeChanged).forEach((key) => delete executeOnNodeChanged[key]);\n};\n/**\n * Observer\n * @private\n * @return {MutationObserver}\n */\n(() => {\n    if (typeof window !== 'undefined') {\n        const callback = (mutationList, observer) => {\n            for (const mutation of mutationList) {\n                if (mutation.type === 'childList') {\n                    for (const id in executeOnNodeChanged) {\n                        executeOnNodeChanged[id]();\n                    }\n                }\n            }\n        };\n        const config = {\n            childList: true,\n            subtree: true,\n        };\n        const observer = new MutationObserver(callback);\n        observer.observe(document.body, config);\n    }\n})();\nconst DomObserver = {\n    executeOnNodeChanged,\n    addOnNodeChange,\n    removeOnNodeChange,\n    cleanup,\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomObserver);\n\n\n//# sourceURL=webpack://DomObserver/./src/DomObserver.js?");

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
/******/ 	__webpack_modules__["./src/DomObserver.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	window.DomObserver = __webpack_exports__;
/******/ 	
/******/ })()
;