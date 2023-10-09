/*! For license information please see Utility.js.LICENSE.txt */
(()=>{var e={222:(e,t,n)=>{var r,o,a;!function(i){if("object"==typeof e.exports){var s=i(n(747),t);void 0!==s&&(e.exports=s)}else o=[n,t],void 0===(a="function"==typeof(r=i)?r.apply(t,o):r)||(e.exports=a)}((function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DomObserver=t.cleanup=t.removeOnNodeChange=t.addOnNodeChange=t.executeOnNodeChanged=void 0;const n={};t.executeOnNodeChanged=n;const r=(e,t)=>{t&&(n[e]=t)};t.addOnNodeChange=r;const o=e=>{e&&delete n[e]};t.removeOnNodeChange=o;const a=()=>{Object.keys(n).forEach((e=>delete n[e]))};t.cleanup=a,new MutationObserver(((e,t)=>{for(const t of e)if("childList"===t.type)for(const e in n)n[e]()})).observe(document.body,{childList:!0,subtree:!0});const i={executeOnNodeChanged:n,addOnNodeChange:r,removeOnNodeChange:o,cleanup:a};t.DomObserver=i,t.default=i}))},747:e=>{function t(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=747,e.exports=t},979:(e,t,n)=>{var r,o,a;!function(i){if("object"==typeof e.exports){var s=i(n(526),t);void 0!==s&&(e.exports=s)}else o=[n,t],void 0===(a="function"==typeof(r=i)?r.apply(t,o):r)||(e.exports=a)}((function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){const t=new Set(e._private?["_private",...e._private]:["_private"]),n=new Set(e._protected?[...t,...e._protected]:[...t]),r=new Set(e._mutable||[]);return new Proxy(e,{get(e,n){if(n in e&&!t.has(String(n)))return e[n];console.error("Prop is private, not set or object is protected",n)},set(e,t,o){if(t in e){if(r.has(String(t)))return e[t]=o;"function"===typeof e[t]?n.add(String(t)):n.has(String(t))?console.error("The prop is a function and cannot be modified",t,o):e[t]=o}else console.error("Protected Object, cannot set props",t,o);return!0}})}}))},526:e=>{function t(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=526,e.exports=t}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};(()=>{"use strict";n.r(r),n.d(r,{Utility:()=>C,convertToBool:()=>c,currencyToDecimal:()=>l,dateFormat:()=>d,decimalToCurrency:()=>f,default:()=>C,emptyOrValue:()=>p,formatPhoneNumber:()=>m,getDynamicId:()=>h,getGoogleMapsAddress:()=>y,getRandomId:()=>g,includes:()=>b,instanceOf:()=>_,isEmpty:()=>v,isNumber:()=>O,logThis:()=>w,openGoogleMapsAddress:()=>N,proxyObject:()=>S,selectElement:()=>T,toCurrency:()=>M,toDollarString:()=>E,typeOf:()=>D,utility:()=>C,utils:()=>C,validateEmail:()=>j,validatePhone:()=>x});var e=n(979),t=n.n(e);const o=function(e,t){const n=window,r=document,o=n.$HOST||!1,a=n.$TEMPLATE||!1,i=n.location.protocol.replace(":",""),s=o||n.location.host,u=a||"",c=location.pathname,l=o||`${i}://${s}`,d=o?`${o}${c}`:`${i}://${s}${c}`;let f=null;const p=()=>{if(f)return f;const e=new URLSearchParams(n.location.search),t={};for(const[n,r]of e.entries())t[n]=r;return f={params:e,queryString:e.toString(),search:n.location.search,keys:Array.from(e.keys()),values:Array.from(e.values()),collection:t},f};e.getPage=()=>r.location.toString().toLowerCase().split("/").pop().split(".")[0]||"index",e.getParams=()=>p(),e.getQuery=()=>p().queryString,e.addToQuery=e=>{const t=p().collection;Object.assign(t,e);return{collection:t,queryString:Object.entries(t).map((([e,t])=>`${e}=${t}`)).join("&")}},e.getHash=()=>n.location.hash.substring(1),e.setHash=e=>{r.location.hash=e},e.deleteHash=()=>{history.pushState("",r.title,n.location.pathname)},e.goTo=e=>(n.location.href=e,!1),e.open=(e,t="_blank",r="")=>n.open(e,t,r),e.onChange=e=>{"function"==typeof e&&n.addEventListener("hashchange",e)},e.fullUrl=d,e.siteUrl=l,e.template=u,e.protocol=i,e.host=s,e.path=c,e.readUrl=r.URL};var a=n(222),i=n.n(a);class s{constructor(e,t=document){this.selector=e,"object"==typeof e?this.domElement=e:String(e).includes("//")?this.domElement=this.getElementByXpath(e):this.domElement=t.querySelector(e)}isInDom(){return Boolean(this.domElement?.outerHTML)}whenInDom(){let e=this,t=Date.now()+Math.floor(1e3*Math.random());return new Promise((function(n){e.isInDom()?n(e):i().addOnNodeChange(t,(()=>{let r=new s(e.selector);r.isInDom()&&(e=r,n(e),i().removeOnNodeChange(t))}))}))}getElementByXpath(e){return document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}getXpathTo(){let e=this.domElement;if(e.id)return"//*[@id='"+e.id+"']";if(e===document.body)return"//"+e.tagName;let t=0,n=e.parentNode.childNodes;for(let r=0;r<n.length;r++){let o=n[r];if(o===e)return new s(e.parentNode).getXpathTo()+"/"+e.tagName+"["+(t+1)+"]";1===o.nodeType&&o.tagName===e.tagName&&t++}}getAttribute(e){return this.domElement.getAttribute(e)||null}getHash(){let e=String(this.getXpathTo()),t=0;if(0===e.length)return t;for(let n=0;n<e.length;n++){t=(t<<5)-t+e.charCodeAt(n),t&=t}return t}}function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function c(e){switch(u(e)){case"boolean":return e;case"string":return"false"!==e&&"0"!==e;case"number":return 0!==e;default:return Boolean(e)}}function l(e){return Number(e.replace(/[^0-9.-]+/g,""))}function d(e,t){if(!e||isNaN(new Date(e).getTime()))return null;var n=new Date(e),r=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"UTC"}).format(n);if(t){var o=new Intl.DateTimeFormat("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"}).format(n);return"".concat(r," @ ").concat(o)}return r}function f(e){return new Intl.NumberFormat("en-GB",{minimumFractionDigits:2}).format(e)}function p(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return O(e)||"boolean"==typeof e?e:v(e)?t:e}function m(e,t){var n=e.replace(/\D/g,"");if(10!==n.length)throw new Error("Invalid phone number length");for(var r=[],o=0,a=0;a<t.length;a++)"0"===t[a]?(r.push(n[o]),o++):r.push(t[a]);return r.join("")}function h(){return"kn__"+(new Date).getTime()+"__"+Math.floor(899*Math.random())}var g=h;function y(e){if(!e)return!1;var t="";if(D(e,"string"))t=e;else{t=["address","address1","city","state","zip","zipcode"].reduce((function(t,n){var r=Object.keys(e).find((function(t){return t.includes(n)&&e[t]}));return r?"".concat(t," ").concat(e[r]):t}),"")}return t=t.trim().replace(/\s+|,/g,"+"),"https://maps.google.it/maps?q=".concat(t)}function b(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if(Array.isArray(e)||"string"==typeof e)return e.includes(t,n);if("object"===u(e))for(var r in e)if(e[r]===t)return!0;return!1}function v(e){return null==e||("string"==typeof e||Array.isArray(e)?0===e.length:e instanceof Map||e instanceof Set?0===e.size:ArrayBuffer.isView(e)?0===e.byteLength:"object"===u(e)&&0===Object.keys(e).length)}function O(e){return!(!Number.isInteger(e)&&Number.isNaN(Number(e)))&&+e}function w(e){console.log(e)}function N(e){if(!D(e,"string")||!D(e,"object"))throw new Error("The input must be a string or an object.");var t=y(e);if(!v(t)||!D(t,"string"))throw new Error("The address you are trying to open is invalid.");return o.open(t)}function S(e){return new(t())(e)}function T(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document;return new s(e,t)}function M(e){return f(e)}function E(e){return D(e,"string")&&(e=l(e)),Math.abs(e)>999&&Math.abs(e)<999999?Math.sign(e)*(Math.abs(e)/1e3).toFixed(1)+"K":Math.abs(e)>999999?Math.sign(e)*(Math.abs(e)/1e6).toFixed(1)+"M":Math.sign(e)*Math.abs(e)}function D(e,t){if(null===e)return t?null===t||"null"===t:"null";var n;switch(u(e)){case"number":case"string":case"boolean":case"undefined":case"bigint":case"symbol":case"function":n=u(e);break;case"object":n=Array.isArray(e)?"array":"object";break;default:n="unknown"}return t?t===n:n}function _(e,t){var n="unknown";if(null===e)return n;for(var r=[{type:"date",inst:Date},{type:"regexp",inst:RegExp},{type:"promise",inst:Promise},{type:"map",inst:Map},{type:"set",inst:Set},{type:"weakMap",inst:WeakMap},{type:"weakSet",inst:WeakSet}],o=r.length;o--;)if(e instanceof r[o].inst){n=r[o].type;break}return t?t===n:n}function j(e){return/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(e)}function x(e){return/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(e)}var C={convertToBool:c,currencyToDecimal:l,dateFormat:d,decimalToCurrency:f,emptyOrValue:p,formatPhoneNumber:m,getDynamicId:h,getGoogleMapsAddress:y,getRandomId:h,includes:b,isEmpty:v,isNumber:O,instanceOf:_,logThis:w,openGoogleMapsAddress:N,proxyObject:S,selectElement:T,toCurrency:M,toDollarString:E,typeOf:D,urlHelper:o,validateEmail:j,validatePhone:x}})(),window.PowerHelpers=r})();