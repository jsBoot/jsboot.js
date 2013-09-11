/*
 <a href="http://en.wikipedia.org/wiki/MIT_License">MIT</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp <dev@webitup.fr> (http://www.webitup.fr/lab)</a>
 @name gulliver.js
 @location https://github.com/jsBoot/spitfire.js/blob/master/src/gulliver.js#111-0f8cc49a5082f7c6a0ca6ae84a9d585ad117fcd2
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/onegateisopening/b.js#74-70c39446998be95596b03bc170b23bba337ce8b4
*/
'use strict';(function(){this.gulliver=function(k,e,g){var a=document.head||document.getElementsByTagName("head"),h=function(){if("item"in a){if(!a[0]){setTimeout(h,25);return}a=a[0]}if(!/^[a-z]+:\/\//.test(e))for(var b=document.getElementsByTagName("script"),f=RegExp("(.*)\\/"+(g||"gulliver")+"((?:-min)?\\.js)"),m=0,d;m<b.length;m++)if(d=b[m],d.src&&(d=d.src.match(f))){d.shift();e=d.shift()+"/"+e+d.shift();break}var c=document.createElement("script"),n=!1;c.onload=c.onreadystatechange=function(){if(c.readyState&&
"complete"!==c.readyState&&"loaded"!==c.readyState||n)return!1;c.onload=c.onreadystatechange=null;n=!0;k()};c.src=e;a.insertBefore(c,a.firstChild)};setTimeout(h,0);if(null===document.readyState&&document.addEventListener){var b=function(){document.removeEventListener("DOMContentLoaded",b,!1);document.readyState="complete"};document.readyState="loading";document.addEventListener("DOMContentLoaded",b,!1)}}}).apply(this);
(function(k,e){var g=[];this.tiojs={wait:function(a){g.push(a)}};var a=function(){for(var h=k.getElementsByTagName("script"),b,l=0,f;l<h.length;f=h[l].getAttribute("src"),l++)if(f&&-1!=f.search(/t\.i\.o\.j/)){b=(b=f.match(/loader-([a-z]+)/))?"."+b.pop():"";break}"undefined"==typeof b?window.setTimeout(a,1):e(function(){for(var a=0;a<g.length;a++)g[a]()},"there.is.only.jsboot"+b,"t.i.o.j")};a()}).apply(this,[document,gulliver]);
