(()=>{"use strict";var e={d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{default:()=>i});const o={};(()=>{if("undefined"!=typeof window){const e={childList:!0,subtree:!0};new MutationObserver(((e,t)=>{for(const t of e)if("childList"===t.type)for(const e in o)o[e]()})).observe(document.body,e)}})();const n=(e,t)=>{t&&(o[e]=t)},r=e=>{e&&delete o[e]};class l{constructor(e,t=document){this.selector=e,"object"==typeof e?this.domElement=e:String(e).includes("//")?this.domElement=this.getElementByXpath(e):this.domElement=t.querySelector(e)}isInDom(){return Boolean(this.domElement?.outerHTML)}whenInDom(){let e=this,t=Date.now()+Math.floor(1e3*Math.random());return new Promise((function(o){e.isInDom()?o(e):n(t,(()=>{let n=new l(e.selector);n.isInDom()&&(e=n,o(e),r(t))}))}))}getElementByXpath(e){return document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}getXpathTo(){let e=this.domElement;if(e.id)return"//*[@id='"+e.id+"']";if(e===document.body)return"//"+e.tagName;let t=0,o=e.parentNode.childNodes;for(let n=0;n<o.length;n++){let r=o[n];if(r===e)return new l(e.parentNode).getXpathTo()+"/"+e.tagName+"["+(t+1)+"]";1===r.nodeType&&r.tagName===e.tagName&&t++}}getAttribute(e){return this.domElement.getAttribute(e)||null}getHash(){let e=String(this.getXpathTo()),t=0;if(0===e.length)return t;for(let o=0;o<e.length;o++)t=(t<<5)-t+e.charCodeAt(o),t&=t;return t}}const i=l;window.ElementHelper=t})();