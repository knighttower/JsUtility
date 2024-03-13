(()=>{"use strict";var e={d:(t,r)=>{for(var i in r)e.o(r,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:r[i]})}};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};e.r(t),e.d(t,{EventBus:()=>r,_eventBus:()=>i,default:()=>r});class r{constructor(){this.listeners={}}on(e,t){this.registerListener(e,t)}once(e,t){this.registerListener(e,t,1)}exactly(e,t,r){this.registerListener(e,t,r)}off(e){delete this.listeners[e]}detach(e,t){const r=(this.listeners[e]||[]).filter((function(e){return e.callback!==t}));return e in this.listeners&&(this.listeners[e]=r,!0)}emit(e,...t){let r=[],i=null;const n=this.extractContextFromArgs(t),s=n[0];if(t=n[1],this.hasListener(e))r=this.listeners[e];else if(e.includes("*"))i=this.patternSearch(e,Object.keys(this.listeners)),i&&i.forEach((e=>{r=r.concat(this.listeners[e])}));else for(const t in this.listeners)i=this.patternSearch(t,[e]),i&&(r=r.concat(this.listeners[t]));r.forEach(((i,n)=>{let o=i.callback;s&&(o=o.bind(s)),o(...t),void 0!==i.triggerCapacity&&(i.triggerCapacity--,r[n].triggerCapacity=i.triggerCapacity),this.checkToRemoveListener(i)&&this.listeners[e].splice(n,1)}))}patternSearch(e,t){let r=[];const i=new RegExp(this.setWildCardString(e));return r=t.filter((e=>i.test(e))),0===r.length?null:r}setWildCardString(e){let t=e.replace(/([.+?^${}()|\[\]\/\\])/g,"\\$&");return t=t.replace(/\*\*/g,"[_g_]").replace(/\*/g,"(.*?)").replace(/\[_g_\]/g,".*"),`^${t}$`}extractContextFromArgs(e){let t=null;for(let r=0;r<e.length;r++){const i=e[r];if(i&&"object"==typeof i&&i.hasOwnProperty("__context")){t=i.__context,e.splice(r,1);break}}return[t,e]}registerListener(e,t,r){this.hasListener(e)||(this.listeners[e]=[]),this.listeners[e].push({callback:t,triggerCapacity:r})}checkToRemoveListener(e){return void 0!==e.triggerCapacity&&e.triggerCapacity<=0}hasListener(e){return e in this.listeners}}function i(){return"undefined"!=typeof window?(window.eventBus||(window.eventBus=new r),window.eventBus):void 0!==e.g?(e.g.eventBus||(e.g.eventBus=new r),e.g.eventBus):new r}window.EventBus=t})();