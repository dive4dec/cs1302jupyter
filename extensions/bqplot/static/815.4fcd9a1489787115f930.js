"use strict";(self.webpackChunkbqplot=self.webpackChunkbqplot||[]).push([[815],{4815:(t,n,e)=>{e.r(n),e.d(n,{clientPoint:()=>wt,create:()=>vt,creator:()=>s,customEvent:()=>ut,event:()=>tt,local:()=>mt,matcher:()=>p,mouse:()=>At,namespace:()=>o,namespaces:()=>i,select:()=>_t,selectAll:()=>xt,selection:()=>pt,selector:()=>l,selectorAll:()=>h,style:()=>L,touch:()=>St,touches:()=>bt,window:()=>E});var r="http://www.w3.org/1999/xhtml";const i={svg:"http://www.w3.org/2000/svg",xhtml:r,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function o(t){var n=t+="",e=n.indexOf(":");return e>=0&&"xmlns"!==(n=t.slice(0,e))&&(t=t.slice(e+1)),i.hasOwnProperty(n)?{space:i[n],local:t}:t}function u(t){return function(){var n=this.ownerDocument,e=this.namespaceURI;return e===r&&n.documentElement.namespaceURI===r?n.createElement(t):n.createElementNS(e,t)}}function c(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function s(t){var n=o(t);return(n.local?c:u)(n)}function a(){}function l(t){return null==t?a:function(){return this.querySelector(t)}}function f(){return[]}function h(t){return null==t?f:function(){return this.querySelectorAll(t)}}function p(t){return function(){return this.matches(t)}}function _(t){return new Array(t.length)}function v(t,n){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=n}function d(t,n,e,r,i,o){for(var u,c=0,s=n.length,a=o.length;c<a;++c)(u=n[c])?(u.__data__=o[c],r[c]=u):e[c]=new v(t,o[c]);for(;c<s;++c)(u=n[c])&&(i[c]=u)}function m(t,n,e,r,i,o,u){var c,s,a,l={},f=n.length,h=o.length,p=new Array(f);for(c=0;c<f;++c)(s=n[c])&&(p[c]=a="$"+u.call(s,s.__data__,c,n),a in l?i[c]=s:l[a]=s);for(c=0;c<h;++c)(s=l[a="$"+u.call(t,o[c],c,o)])?(r[c]=s,s.__data__=o[c],l[a]=null):e[c]=new v(t,o[c]);for(c=0;c<f;++c)(s=n[c])&&l[p[c]]===s&&(i[c]=s)}function y(t,n){return t<n?-1:t>n?1:t>=n?0:NaN}function g(t){return function(){this.removeAttribute(t)}}function w(t){return function(){this.removeAttributeNS(t.space,t.local)}}function A(t,n){return function(){this.setAttribute(t,n)}}function x(t,n){return function(){this.setAttributeNS(t.space,t.local,n)}}function S(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttribute(t):this.setAttribute(t,e)}}function b(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,e)}}function E(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function N(t){return function(){this.style.removeProperty(t)}}function C(t,n,e){return function(){this.style.setProperty(t,n,e)}}function P(t,n,e){return function(){var r=n.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,e)}}function L(t,n){return t.style.getPropertyValue(n)||E(t).getComputedStyle(t,null).getPropertyValue(n)}function T(t){return function(){delete this[t]}}function q(t,n){return function(){this[t]=n}}function B(t,n){return function(){var e=n.apply(this,arguments);null==e?delete this[t]:this[t]=e}}function D(t){return t.trim().split(/^|\s+/)}function M(t){return t.classList||new O(t)}function O(t){this._node=t,this._names=D(t.getAttribute("class")||"")}function V(t,n){for(var e=M(t),r=-1,i=n.length;++r<i;)e.add(n[r])}function k(t,n){for(var e=M(t),r=-1,i=n.length;++r<i;)e.remove(n[r])}function R(t){return function(){V(this,t)}}function H(t){return function(){k(this,t)}}function I(t,n){return function(){(n.apply(this,arguments)?V:k)(this,t)}}function U(){this.textContent=""}function j(t){return function(){this.textContent=t}}function z(t){return function(){var n=t.apply(this,arguments);this.textContent=null==n?"":n}}function G(){this.innerHTML=""}function X(t){return function(){this.innerHTML=t}}function Y(t){return function(){var n=t.apply(this,arguments);this.innerHTML=null==n?"":n}}function $(){this.nextSibling&&this.parentNode.appendChild(this)}function F(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function J(){return null}function K(){var t=this.parentNode;t&&t.removeChild(this)}function Q(){var t=this.cloneNode(!1),n=this.parentNode;return n?n.insertBefore(t,this.nextSibling):t}function W(){var t=this.cloneNode(!0),n=this.parentNode;return n?n.insertBefore(t,this.nextSibling):t}v.prototype={constructor:v,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,n){return this._parent.insertBefore(t,n)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}},O.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var n=this._names.indexOf(t);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};var Z={},tt=null;function nt(t,n,e){return t=et(t,n,e),function(n){var e=n.relatedTarget;e&&(e===this||8&e.compareDocumentPosition(this))||t.call(this,n)}}function et(t,n,e){return function(r){var i=tt;tt=r;try{t.call(this,this.__data__,n,e)}finally{tt=i}}}function rt(t){return t.trim().split(/^|\s+/).map((function(t){var n="",e=t.indexOf(".");return e>=0&&(n=t.slice(e+1),t=t.slice(0,e)),{type:t,name:n}}))}function it(t){return function(){var n=this.__on;if(n){for(var e,r=0,i=-1,o=n.length;r<o;++r)e=n[r],t.type&&e.type!==t.type||e.name!==t.name?n[++i]=e:this.removeEventListener(e.type,e.listener,e.capture);++i?n.length=i:delete this.__on}}}function ot(t,n,e){var r=Z.hasOwnProperty(t.type)?nt:et;return function(i,o,u){var c,s=this.__on,a=r(n,o,u);if(s)for(var l=0,f=s.length;l<f;++l)if((c=s[l]).type===t.type&&c.name===t.name)return this.removeEventListener(c.type,c.listener,c.capture),this.addEventListener(c.type,c.listener=a,c.capture=e),void(c.value=n);this.addEventListener(t.type,a,e),c={type:t.type,name:t.name,value:n,listener:a,capture:e},s?s.push(c):this.__on=[c]}}function ut(t,n,e,r){var i=tt;t.sourceEvent=tt,tt=t;try{return n.apply(e,r)}finally{tt=i}}function ct(t,n,e){var r=E(t),i=r.CustomEvent;"function"==typeof i?i=new i(n,e):(i=r.document.createEvent("Event"),e?(i.initEvent(n,e.bubbles,e.cancelable),i.detail=e.detail):i.initEvent(n,!1,!1)),t.dispatchEvent(i)}function st(t,n){return function(){return ct(this,t,n)}}function at(t,n){return function(){return ct(this,t,n.apply(this,arguments))}}"undefined"!=typeof document&&("onmouseenter"in document.documentElement||(Z={mouseenter:"mouseover",mouseleave:"mouseout"}));var lt=[null];function ft(t,n){this._groups=t,this._parents=n}function ht(){return new ft([[document.documentElement]],lt)}ft.prototype=ht.prototype={constructor:ft,select:function(t){"function"!=typeof t&&(t=l(t));for(var n=this._groups,e=n.length,r=new Array(e),i=0;i<e;++i)for(var o,u,c=n[i],s=c.length,a=r[i]=new Array(s),f=0;f<s;++f)(o=c[f])&&(u=t.call(o,o.__data__,f,c))&&("__data__"in o&&(u.__data__=o.__data__),a[f]=u);return new ft(r,this._parents)},selectAll:function(t){"function"!=typeof t&&(t=h(t));for(var n=this._groups,e=n.length,r=[],i=[],o=0;o<e;++o)for(var u,c=n[o],s=c.length,a=0;a<s;++a)(u=c[a])&&(r.push(t.call(u,u.__data__,a,c)),i.push(u));return new ft(r,i)},filter:function(t){"function"!=typeof t&&(t=p(t));for(var n=this._groups,e=n.length,r=new Array(e),i=0;i<e;++i)for(var o,u=n[i],c=u.length,s=r[i]=[],a=0;a<c;++a)(o=u[a])&&t.call(o,o.__data__,a,u)&&s.push(o);return new ft(r,this._parents)},data:function(t,n){if(!t)return _=new Array(this.size()),l=-1,this.each((function(t){_[++l]=t})),_;var e,r=n?m:d,i=this._parents,o=this._groups;"function"!=typeof t&&(e=t,t=function(){return e});for(var u=o.length,c=new Array(u),s=new Array(u),a=new Array(u),l=0;l<u;++l){var f=i[l],h=o[l],p=h.length,_=t.call(f,f&&f.__data__,l,i),v=_.length,y=s[l]=new Array(v),g=c[l]=new Array(v);r(f,h,y,g,a[l]=new Array(p),_,n);for(var w,A,x=0,S=0;x<v;++x)if(w=y[x]){for(x>=S&&(S=x+1);!(A=g[S])&&++S<v;);w._next=A||null}}return(c=new ft(c,i))._enter=s,c._exit=a,c},enter:function(){return new ft(this._enter||this._groups.map(_),this._parents)},exit:function(){return new ft(this._exit||this._groups.map(_),this._parents)},join:function(t,n,e){var r=this.enter(),i=this,o=this.exit();return r="function"==typeof t?t(r):r.append(t+""),null!=n&&(i=n(i)),null==e?o.remove():e(o),r&&i?r.merge(i).order():i},merge:function(t){for(var n=this._groups,e=t._groups,r=n.length,i=e.length,o=Math.min(r,i),u=new Array(r),c=0;c<o;++c)for(var s,a=n[c],l=e[c],f=a.length,h=u[c]=new Array(f),p=0;p<f;++p)(s=a[p]||l[p])&&(h[p]=s);for(;c<r;++c)u[c]=n[c];return new ft(u,this._parents)},order:function(){for(var t=this._groups,n=-1,e=t.length;++n<e;)for(var r,i=t[n],o=i.length-1,u=i[o];--o>=0;)(r=i[o])&&(u&&4^r.compareDocumentPosition(u)&&u.parentNode.insertBefore(r,u),u=r);return this},sort:function(t){function n(n,e){return n&&e?t(n.__data__,e.__data__):!n-!e}t||(t=y);for(var e=this._groups,r=e.length,i=new Array(r),o=0;o<r;++o){for(var u,c=e[o],s=c.length,a=i[o]=new Array(s),l=0;l<s;++l)(u=c[l])&&(a[l]=u);a.sort(n)}return new ft(i,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){var t=new Array(this.size()),n=-1;return this.each((function(){t[++n]=this})),t},node:function(){for(var t=this._groups,n=0,e=t.length;n<e;++n)for(var r=t[n],i=0,o=r.length;i<o;++i){var u=r[i];if(u)return u}return null},size:function(){var t=0;return this.each((function(){++t})),t},empty:function(){return!this.node()},each:function(t){for(var n=this._groups,e=0,r=n.length;e<r;++e)for(var i,o=n[e],u=0,c=o.length;u<c;++u)(i=o[u])&&t.call(i,i.__data__,u,o);return this},attr:function(t,n){var e=o(t);if(arguments.length<2){var r=this.node();return e.local?r.getAttributeNS(e.space,e.local):r.getAttribute(e)}return this.each((null==n?e.local?w:g:"function"==typeof n?e.local?b:S:e.local?x:A)(e,n))},style:function(t,n,e){return arguments.length>1?this.each((null==n?N:"function"==typeof n?P:C)(t,n,null==e?"":e)):L(this.node(),t)},property:function(t,n){return arguments.length>1?this.each((null==n?T:"function"==typeof n?B:q)(t,n)):this.node()[t]},classed:function(t,n){var e=D(t+"");if(arguments.length<2){for(var r=M(this.node()),i=-1,o=e.length;++i<o;)if(!r.contains(e[i]))return!1;return!0}return this.each(("function"==typeof n?I:n?R:H)(e,n))},text:function(t){return arguments.length?this.each(null==t?U:("function"==typeof t?z:j)(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?G:("function"==typeof t?Y:X)(t)):this.node().innerHTML},raise:function(){return this.each($)},lower:function(){return this.each(F)},append:function(t){var n="function"==typeof t?t:s(t);return this.select((function(){return this.appendChild(n.apply(this,arguments))}))},insert:function(t,n){var e="function"==typeof t?t:s(t),r=null==n?J:"function"==typeof n?n:l(n);return this.select((function(){return this.insertBefore(e.apply(this,arguments),r.apply(this,arguments)||null)}))},remove:function(){return this.each(K)},clone:function(t){return this.select(t?W:Q)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().__data__},on:function(t,n,e){var r,i,o=rt(t+""),u=o.length;if(!(arguments.length<2)){for(c=n?ot:it,null==e&&(e=!1),r=0;r<u;++r)this.each(c(o[r],n,e));return this}var c=this.node().__on;if(c)for(var s,a=0,l=c.length;a<l;++a)for(r=0,s=c[a];r<u;++r)if((i=o[r]).type===s.type&&i.name===s.name)return s.value},dispatch:function(t,n){return this.each(("function"==typeof n?at:st)(t,n))}};const pt=ht;function _t(t){return"string"==typeof t?new ft([[document.querySelector(t)]],[document.documentElement]):new ft([[t]],lt)}function vt(t){return _t(s(t).call(document.documentElement))}var dt=0;function mt(){return new yt}function yt(){this._="@"+(++dt).toString(36)}function gt(){for(var t,n=tt;t=n.sourceEvent;)n=t;return n}function wt(t,n){var e=t.ownerSVGElement||t;if(e.createSVGPoint){var r=e.createSVGPoint();return r.x=n.clientX,r.y=n.clientY,[(r=r.matrixTransform(t.getScreenCTM().inverse())).x,r.y]}var i=t.getBoundingClientRect();return[n.clientX-i.left-t.clientLeft,n.clientY-i.top-t.clientTop]}function At(t){var n=gt();return n.changedTouches&&(n=n.changedTouches[0]),wt(t,n)}function xt(t){return"string"==typeof t?new ft([document.querySelectorAll(t)],[document.documentElement]):new ft([null==t?[]:t],lt)}function St(t,n,e){arguments.length<3&&(e=n,n=gt().changedTouches);for(var r,i=0,o=n?n.length:0;i<o;++i)if((r=n[i]).identifier===e)return wt(t,r);return null}function bt(t,n){null==n&&(n=gt().touches);for(var e=0,r=n?n.length:0,i=new Array(r);e<r;++e)i[e]=wt(t,n[e]);return i}yt.prototype=mt.prototype={constructor:yt,get:function(t){for(var n=this._;!(n in t);)if(!(t=t.parentNode))return;return t[n]},set:function(t,n){return t[this._]=n},remove:function(t){return this._ in t&&delete t[this._]},toString:function(){return this._}}}}]);