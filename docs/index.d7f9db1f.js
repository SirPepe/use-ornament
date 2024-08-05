var t=Object.defineProperty,e=t=>{throw TypeError(t)},r=(e,r,n)=>r in e?t(e,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[r]=n,n=(t,e,n)=>r(t,"symbol"!=typeof e?e+"":e,n),s=(t,r,n)=>r.has(t)||e("Cannot "+n),i=(t,e,r)=>(s(t,e,"read from private field"),r?r.call(t):e.get(t)),a=(t,r,n)=>r.has(t)?e("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(t):r.set(t,n),o=(t,e,r,n)=>(s(t,e,"write to private field"),n?n.call(t,r):e.set(t,r),r);function l(t){let e=Math.round(Number(t));return Number.isFinite(e)&&!Number.isNaN(e)?e:0}function c(t){return Math.abs(l(t))}var h,u,m,d,f,p=class t extends HTMLElement{constructor(){super(),a(this,h,this.attachShadow({mode:"open"})),a(this,u),a(this,m,[]),a(this,d,0),a(this,f,null),n(this,"_handleClick",t=>{if("click"===t.type){for(let e of t.composedPath())if(e instanceof HTMLElement){if("next"===e.getAttribute("data-command")){this.next();return}if("prev"===e.getAttribute("data-command")){this.prev();return}}}});let[e,r,s]=t._template();o(this,u,e),i(this,h).append(e,r,s),i(this,h).addEventListener("click",this._handleClick)}static _template(){let t=document.createElement("slot"),e=document.createElement("slot");e.name="controls",e.innerHTML=`
      <div part="controls" class="defaultControls">
        <button part="controls-prevBtn" data-command="prev">
          <span>&lt;</span>
        </button>
        <button part="controls-nextBtn" data-command="next">
          <span>&gt;</span>
        </button>
      </div>
    `;let r=document.createElement("style");return r.innerHTML=`
      :host { display: grid; }
      :host(:not([controls])) slot[name=controls] { display: none }
      .defaultControls { position: relative; z-index: 1337; }
    `,[t,e,r]}static get observedAttributes(){return["keyframes","current"]}attributeChangedCallback(t,e,r){e!==r&&("keyframes"===t?(o(this,m,r?String(r).split(/\s+/).map(c).sort((t,e)=>t-e):[]),this._goToCurrent()):"current"===t&&(o(this,d,this._toKeyframeIdx(r)),this._goToCurrent()))}get controls(){return this.hasAttribute("controls")}set controls(t){t?this.setAttribute("controls","controls"):this.removeAttribute("controls")}get keyframes(){return i(this,m)}set keyframes(t){Array.isArray(t)?(t=Array.from(new Set(t.map(c).sort((t,e)=>t-e))),this.setAttribute("keyframes",t.join(" ")),o(this,m,t)):(this.removeAttribute("keyframes"),o(this,m,[])),this._goToCurrent()}_toKeyframeIdx(t){let e=l(t);return e<0&&(e=Math.abs(e)-1),e>this.maxFrame&&(e=this.maxFrame),i(this,m).indexOf(e)}get current(){return i(this,m)[i(this,d)]||0}set current(t){let e=this._toKeyframeIdx(t);-1!==e?(o(this,d,e),this.setAttribute("current",String(i(this,m)[e]))):(o(this,d,0),this.setAttribute("current","0"))}get nextCurrent(){return i(this,f)&&i(this,m)[i(this,d)]||null}get maxFrame(){return Math.max(...this.keyframes)}_goToCurrent(){let t=i(this,d);t in i(this,m)||(t=i(this,m).length>=1&&t<0?i(this,m).length-1:0),o(this,f,t);let e=this.dispatchEvent(new Event("cm-beforeframechange",{bubbles:!0,cancelable:!0}));o(this,f,null),e&&(this._setClass(i(this,m)[t]),t!==i(this,d)&&o(this,d,t),this.dispatchEvent(new Event("cm-afterframechange",{bubbles:!0})))}_setClass(t){let e=i(this,u).assignedElements()[0];if(e){for(let t of e.classList)/^frame[0-9]+$/.test(t)&&e.classList.remove(t);e.classList.add(`frame${t}`)}}next(){return o(this,d,i(this,d)+1),this._goToCurrent(),this.current}prev(){return o(this,d,i(this,d)-1),this._goToCurrent(),this.current}};h=new WeakMap,u=new WeakMap,m=new WeakMap,d=new WeakMap,f=new WeakMap,window.customElements.define("code-movie-runtime",p);const b=document.querySelector("code-movie-runtime"),v=document.querySelector("button.next"),g=document.querySelector("button.prev");function y(){g.disabled=0===b.current,v.disabled=b.current===b.maxFrame}for(const t of(v.addEventListener("click",()=>{b.next(),y()}),g.addEventListener("click",()=>{b.prev(),y()}),y(),document.querySelectorAll("table"))){let e=document.createElement("div");e.className="tableScroller",t.replaceWith(e),e.append(t)}const x={};for(const t of document.querySelectorAll("h2[id], h3[id], h3[id]")){let e=t.getAttribute("id");t.innerHTML+=`<a href="#${e}">#</a>`;let r=/^@[a-zA-Z]+/.exec(t.innerText);r&&(x[r[0]+"()"]=e)}for(const t of document.querySelectorAll("code:not([class])"))!t.closest("h2, h3, h4")&&x[t.innerText]&&(t.innerHTML=`<a class="ref" title="Jump to documentation for ${t.innerText}" href="#${x[t.innerText]}">${t.innerText}</a>`);