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

/***/ "./src/ProxyHelper.js":
/*!****************************!*\
  !*** ./src/ProxyHelper.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ProxyHelper)\n/* harmony export */ });\n/* Author Knighttower\n    MIT License\n    [2023] [Knighttower] https://github.com/knighttower\n*/\n/**\n * @module ProxyHelper\n * Convert to proxy to protect objects\n * Allows to declare _private, _protected and _mutable - all arrays with prop names\n * @example ProxyHelper({objectProps..., _protected: array(...)})\n * @param {Object} object\n * @return {Proxy}\n * @usage const proxy = ProxyHelper({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})\n * @usage _protected: array(...) -> Cannot be modified\n * @usage _private: array(...) -> Cannot be accessed\n * @usage _mutable: array(...) -> Can be modified\n */\nfunction ProxyHelper(object) {\n    'use strict';\n    const _private = new Map((object._private || ['_private']).map((prop) => [prop, true]));\n    const _protected = new Map([..._private, ...(object._protected || []).map((prop) => [prop, true])]);\n    const _mutable = new Map((object._mutable || []).map((prop) => [prop, true]));\n\n    return new Proxy(object, {\n        get(target, prop) {\n            if (prop in target && !_private.has(String(prop))) {\n                return target[prop];\n            } else {\n                console.error('Prop is private, not set, or object is protected', prop);\n                return undefined;\n            }\n        },\n        set(target, prop, value) {\n            prop = String(prop);\n            if (prop in target) {\n                if (_mutable.has(prop)) {\n                    target[prop] = value;\n                    return true;\n                }\n                if (!_protected.has(prop) && !_private.has(prop)) {\n                    target[prop] = value;\n                    return true;\n                } else {\n                    console.error('The prop is protected or private and cannot be modified', prop, value);\n                    return false;\n                }\n            } else {\n                console.error('Protected Object, cannot set new props', prop, value);\n                return false;\n            }\n        },\n    });\n}\n\n\n//# sourceURL=webpack://ProxyHelper/./src/ProxyHelper.js?");

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
/******/ 	__webpack_modules__["./src/ProxyHelper.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	window.ProxyHelper = __webpack_exports__;
/******/ 	
/******/ })()
;