!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("types",[],t):"object"==typeof exports?exports.types=t():e.types=t()}(self,(()=>(()=>{"use strict";var e={d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{typesMap:()=>i});const o={};(()=>{if("undefined"!=typeof window){const e={childList:!0,subtree:!0};new MutationObserver((e=>{for(const t of e)if("childList"===t.type)for(const e in o)o[e]()})).observe(document.body,e)}})();const n={};function r(e,t){if(null===e)return t?null===t||"null"===t:"null";let o;switch(typeof e){case"number":case"string":case"boolean":case"undefined":case"bigint":case"symbol":case"function":o=typeof e;break;case"object":o=Array.isArray(e)?"array":"object";break;default:o="unknown"}if(t){if(t.includes("|")){for(let e of t.split("|"))if(o===e)return e;return!1}return t===o}return o}(()=>{if("undefined"!=typeof window){const e={childList:!0,subtree:!0};new MutationObserver((e=>{for(const t of e)if("childList"===t.type)for(const e in n)n[e]()})).observe(document.body,e)}})();const i=new Map([["array",e=>r(e,"array")],["bigInt",e=>"bigint"==typeof e],["boolean",e=>"boolean"==typeof e],["date",e=>e instanceof Date],["float",e=>"number"==typeof e&&!Number.isInteger(e)],["function",e=>"function"==typeof e],["int",e=>Number.isInteger(e)],["map",e=>e instanceof Map],["null",e=>null===e],["number",e=>"number"==typeof e],["object",e=>r(e,"object")],["promise",e=>e instanceof Promise],["regExp",e=>e instanceof RegExp],["set",e=>e instanceof Set],["string",e=>"string"==typeof e],["symbol",e=>"symbol"==typeof e],["undefined",e=>void 0===e],["weakMap",e=>e instanceof WeakMap],["weakSet",e=>e instanceof WeakSet]]);return t})()));