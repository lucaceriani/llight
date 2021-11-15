(()=>{function $parcel$export(e,t,l,r){Object.defineProperty(e,t,{get:l,set:r,enumerable:!0,configurable:!0})}var $parcel$global="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},$parcel$modules={},$parcel$inits={},parcelRequire=$parcel$global.parcelRequire94c2;null==parcelRequire&&(parcelRequire=function(e){if(e in $parcel$modules)return $parcel$modules[e].exports;if(e in $parcel$inits){var t=$parcel$inits[e];delete $parcel$inits[e];var l={id:e,exports:{}};return $parcel$modules[e]=l,t.call(l.exports,l,l.exports),l.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r},parcelRequire.register=function(e,t){$parcel$inits[e]=t},$parcel$global.parcelRequire94c2=parcelRequire),parcelRequire.register("ascTh",(function(module,exports){var $aQC2N=parcelRequire("aQC2N");class LLight{debugEnabled=!1;isInitialized=!1;forId=[];$={};_=$aQC2N.default;opts={debug:!1,routing:!0};init(e){this.opts={...this.opts,...e},this.update(!0),document.dispatchEvent(new CustomEvent("llight:initialized"))}update(firstTime=!1){let ts=performance.now();const qa=e=>document.querySelectorAll(e);if(firstTime?this.dbg("Called llight() first time!"):this.dbg("Called llight()"),firstTime){for(let e of qa("[ll-for]"))e.setAttribute("ll-for-id",this.forId.length),this.forId.push(e.firstElementChild.cloneNode(!0));for(let e of qa("[ll-self]")){let t=e.getAttribute("ll-self");t||(t=e.getAttribute("id")),t?this.$.hasOwnProperty(t)?console.error(`llight: Trying to self-bind with name "${t}" but it already exists!`):this.$[t]=e:console.error('llight: No value for "ll-self" or "id"')}for(let e of qa("[ll-bind]"))e.addEventListener("input",(e=>this.bind(e)));for(let e of qa("[ll-\\@click]"))e.addEventListener("click",(e=>this.click(e)));for(let e of qa("[ll-\\@enter]"))e.addEventListener("keydown",(e=>this.enter(e)));window.addEventListener("hashchange",(e=>this.renderRoute()))}for(let node of qa("[ll-bind]")){let variable=eval(node.getAttribute("ll-bind"));/checkbox|radio/.test(node.type)?node.checked=variable:node.value=variable}for(let node1 of qa("[ll-text]"))node1.innerText=eval(node1.getAttribute("ll-text"));for(let node2 of qa("[ll-class]")){let arr=node2.getAttribute("ll-class").split(":");2==arr.length?eval(arr[1])?node2.classList.add(arr[0]):node2.classList.remove(arr[0]):console.error('ll-class must be in form: "class:expression"')}for(let node3 of qa("[ll-attr]")){let arr=node3.getAttribute("ll-attr").split("=");2==arr.length?node3.setAttribute(arr[0],eval(arr[1])):console.error('ll-attr must be in form: "attribute=expression"')}for(let node4 of qa("[ll-show]")){let expr=node4.getAttribute("ll-show");eval(expr)?node4.style.display="":node4.style.display="none"}for(let e of qa("a[ll-goto]")){let t=e.getAttribute("ll-goto");t.startsWith("/")||(t=`/${t}`),e.href=`#${t}`}for(let node6 of qa("[ll-for]")){let arr=eval(node6.getAttribute("ll-for")),childId=parseInt(node6.getAttribute("ll-for-id"));node6.innerHTML="";for(let e of arr){let t=this.forId[childId].cloneNode(!0);node6.appendChild(t),(t.querySelector("[ll-for-here]")||t).innerText=e}}this.opts.routing&&(firstTime&&(location.hash="#/"),this.renderRoute()),firstTime?document.body.dispatchEvent(new Event("llight.initialized")):document.body.dispatchEvent(new Event("llight.updated"));let te=performance.now();this.dbg(`It took ${Math.round(te-ts)} ms`)}renderRoute(){let e=location.hash.substr(1);document.querySelectorAll(`[ll-route="${e}"]`).forEach((e=>e.style.display="")),document.querySelectorAll(`[ll-route]:not([ll-route="${e}"])`).forEach((e=>e.style.display="none"))}click(e){"A"==e.target.nodeName&&e.preventDefault();let evalString=e.target.getAttribute("ll-@click");eval(evalString),this.update()}enter(e1){"Enter"===e1.key&&(eval(e1.target.getAttribute("ll-@enter")),this.update())}bind(e2){let variable=e2.target.getAttribute("ll-bind");/checkbox|radio/.test(e2.target.type)?eval(`${variable} = ${e2.target.checked}`):eval(`${variable} = ${JSON.stringify(e2.target.value)}`),this.update()}dbg(e){this.opts.debug&&console.log("[llight debug] "+e)}}if(window.ll)console.error("llight: LLight cannot be initialized, 'll' already exists");else{if(window.ll=new LLight,document.currentScript&&!document.currentScript.hasAttribute("ll-autoinit"))return;let autoinitValue=document.currentScript.getAttribute("ll-autoinit");if(!autoinitValue)return void document.addEventListener("DOMContentLoaded",(()=>window.ll.init()));let opts=null;try{if(opts=eval(`(${autoinitValue})`),"object"!=typeof opts||null===opts)throw"Option object is not of object type or is null :(";document.addEventListener("DOMContentLoaded",(()=>window.ll.init(opts)))}catch(e){console.error("Error in parsing options, see below. Using default options!"),console.error(e)}}})),parcelRequire.register("aQC2N",(function(e,t){$parcel$export(e.exports,"default",(()=>l));var l={randIntInclusive:r,randFloat:function(e,t){return Math.random()*(t-e)+e},randArray:function(e,t=1){if(t<=1)return e[r(0,e.length-1)];{let l=[...e];for(let e=l.length-1;e>0;e--){const t=Math.floor(Math.random()*(e+1)),r=l[e];l[e]=l[t],l[t]=r}return l.slice(0,t)}}};function r(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e+1)+e)}})),parcelRequire("ascTh")})();