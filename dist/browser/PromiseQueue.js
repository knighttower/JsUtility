(()=>{"use strict";var e={d:(t,s)=>{for(var r in s)e.o(s,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:s[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{PromisePool:()=>i,PromiseQueue:()=>n,doPoll:()=>o,promisePool:()=>i,promiseQueue:()=>n});class s{constructor(){this.listeners={}}on(e,t){this.registerListener(e,t)}once(e,t){this.registerListener(e,t,1)}exactly(e,t,s){this.registerListener(e,t,s)}off(e){delete this.listeners[e]}detach(e,t){const s=(this.listeners[e]||[]).filter((function(e){return e.callback!==t}));return e in this.listeners&&(this.listeners[e]=s,!0)}emit(e,...t){let s=[],r=null;const i=this.extractContextFromArgs(t),n=i[0];if(t=i[1],this.hasListener(e))s=this.listeners[e];else if(e.includes("*"))r=this.patternSearch(e,Object.keys(this.listeners)),r&&r.forEach((e=>{s=s.concat(this.listeners[e])}));else for(const t in this.listeners)r=this.patternSearch(t,[e]),r&&(s=s.concat(this.listeners[t]));s.forEach(((r,i)=>{let o=r.callback;n&&(o=o.bind(n)),o(...t),void 0!==r.triggerCapacity&&(r.triggerCapacity--,s[i].triggerCapacity=r.triggerCapacity),this.checkToRemoveListener(r)&&this.listeners[e].splice(i,1)}))}patternSearch(e,t){let s=[];const r=new RegExp(this.setWildCardString(e));return s=t.filter((e=>r.test(e))),0===s.length?null:s}setWildCardString(e){let t=e.replace(/([.+?^${}()|\[\]\/\\])/g,"\\$&");return t=t.replace(/\*\*/g,"[_g_]").replace(/\*/g,"(.*?)").replace(/\[_g_\]/g,".*"),`^${t}$`}extractContextFromArgs(e){let t=null;for(let s=0;s<e.length;s++){const r=e[s];if(r&&"object"==typeof r&&r.hasOwnProperty("__context")){t=r.__context,e.splice(s,1);break}}return[t,e]}registerListener(e,t,s){this.hasListener(e)||(this.listeners[e]=[]),this.listeners[e].push({callback:t,triggerCapacity:s})}checkToRemoveListener(e){return void 0!==e.triggerCapacity&&e.triggerCapacity<=0}hasListener(e){return e in this.listeners}}const r=e=>Array.isArray(e)?e:[e];const i=()=>{let e="in-progress",t={},i=[];return new class extends s{constructor(){super()}add(e){if(e instanceof Promise==1&&Array.isArray(e)&&e.every((e=>e instanceof Promise)))throw new Error("promisePool: The first argument must be a promise or an array of promises.");const s=this;r(e).forEach((e=>{const r=Promise.all([e]),i="kn__"+(new Date).getTime()+"__"+Math.floor(899*Math.random());t[i]={promiseBag:r,status:"in-progress"},r.then((()=>{t[i].status="completed",s._updateStatus()})).catch((()=>{t[i].status="rejected",s._updateStatus()}))}))}status(){return e}isDone(){return"done"===e}_updateStatus(){if("done"===e)return;const s=Object.values(t);s.forEach((e=>{"rejected"===e.status&&i.push(e)}));const r=s.every((e=>"completed"===e.status||"rejected"===e.status));e=r?"done":"in-progress",this.emit("stats",{completed:s.filter((e=>"completed"===e.status)).length,rejected:i.length,pending:s.filter((e=>"in-progress"===e.status)).length,total:s.length}),"done"===e&&(this.emit("completed"),this.emit("rejected",i),this.clear())}clear(){t={},i=[]}}},n=class extends s{constructor(){super(),this.queue=[],this.inProgress=!1,this._timer=null}add(e){r(e).forEach((e=>{this.queue.push({promiseFunction:e,status:"pending"})})),this.inProgress||this._next(),this._setTimer()}clear(){this.queue=[]}_setTimer(){this._timer&&clearInterval(this._timer),this._timer=setInterval((()=>{"done"===this.status()&&(this.emit("completed"),clearInterval(this._timer),this._timer=null)}),10)}_next(){if(0===this.queue.length)return void(this.inProgress=!1);this.inProgress=!0;const{promiseFunction:e}=this.queue[0];e().then((()=>{this.queue[0].status="fulfilled"})).catch((()=>{this.queue[0].status="rejected"})).finally((()=>{this.queue.shift(),this._next()}))}status(){return 0===this.queue.length?"done":"in-progress"}},o=(e,t={})=>{if("function"!=typeof e)throw new Error("doPoll: The first argument must be a function.");const{interval:s=200,timeout:r=1e3}=t;let i,n,o,a,l=!1;const c=()=>{h(),a(console.info("===> doPoll: cancelled or timed out."))},u=e=>{h(),o(e)};function h(){l=!0,clearTimeout(i),clearInterval(n)}return{promise:new Promise(((t,h)=>{o=t,a=h;const p=e instanceof Promise,d=()=>{if(l)return;const t=p?e:e();p?t.then((e=>{e&&u(e)})).catch(a):(Boolean(t)||t)&&u(t)};n=setInterval(d,s),d(),i=setTimeout((()=>{l||c()}),r)})),stop:c}};window.PromiseQueue=t})();