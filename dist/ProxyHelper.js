(()=>{"use strict";var r={d:(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o:(r,e)=>Object.prototype.hasOwnProperty.call(r,e),r:r=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})}},e={};function t(r){return function(r){if(Array.isArray(r))return n(r)}(r)||function(r){if("undefined"!=typeof Symbol&&null!=r[Symbol.iterator]||null!=r["@@iterator"])return Array.from(r)}(r)||function(r,e){if(!r)return;if("string"==typeof r)return n(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);"Object"===t&&r.constructor&&(t=r.constructor.name);if("Map"===t||"Set"===t)return Array.from(r);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return n(r,e)}(r)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(r,e){(null==e||e>r.length)&&(e=r.length);for(var t=0,n=new Array(e);t<e;t++)n[t]=r[t];return n}function o(r){var e=new Map((r._private||["_private"]).map((function(r){return[r,!0]}))),n=new Map([].concat(t(e),t((r._protected||[]).map((function(r){return[r,!0]}))))),o=new Map((r._mutable||[]).map((function(r){return[r,!0]})));return new Proxy(r,{get:function(r,t){return t in r&&!e.has(String(t))?r[t]:void console.error("Prop is private, not set, or object is protected",t)},set:function(r,t,a){return(t=String(t))in r?o.has(t)?(r[t]=a,!0):n.has(t)||e.has(t)?(console.error("The prop is protected or private and cannot be modified",t,a),!1):(r[t]=a,!0):(console.error("Protected Object, cannot set new props",t,a),!1)}})}r.r(e),r.d(e,{default:()=>o}),window.PowerHelpers=e})();