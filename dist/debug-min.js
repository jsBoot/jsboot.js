/*
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/console.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/css.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/console.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/tick.js#74-70c39446998be95596b03bc170b23bba337ce8b4
*/
'use strict';jsBoot.add(console).as("nativeConsole");jsBoot.pack("jsBoot.debug",function(b){var c={DEBUG:1,LOG:2,INFO:4,WARN:8,ERROR:16,TRACE:32,ALL:63};this.console={VERBOSITY:c.ALL};Object.keys(c).forEach(function(a){var d=this.console[a]=c[a],e=b.nativeConsole[a.toLowerCase()];b.nativeConsole[a.toLowerCase()]=function(){if(this.console.VERBOSITY&d)try{e.apply(b.nativeConsole,arguments)}catch(a){Array.prototype.slice(arguments).forEach(function(a){e.apply(b.nativeConsole,[a])})}}.bind(this)},this)});
jsBoot.pack("jsBoot.debug",function(){var b=function(){Array.prototype.forEach.call(document.getElementsByTagName("link"),function(a){if(a.rel&&a.rel.match(/style/)){var b=a.getAttribute("href").replace(/\?jsbootCacheBuster=[^&]+/,"")+"?jsbootCacheBuster="+Date.now();a.setAttribute("href",b)}});Array.prototype.forEach.call(document.getElementsByTagName("style"),function(a){if(a.type&&a.type.match(/\/css$/)&&a.innerHTML.match(/@import/)){var b=a.nextSibling,c=a.parentNode;a.parentNode.removeChild(a);
b?b.parentNode.insertBefore(a,b):c.appendChild(a)}})},c;this.cssPoller=new function(){this.boot=function(a){this.shutdown();c=setInterval(b,1E3*(a||1))};this.shutdown=function(){c&&(clearInterval(c),c=null)};this.trigger=function(){b()};this.status=function(){return!!c}}});jsBoot.use("jsBoot.core");
jsBoot.run(function(b){b.core.registerErrorHandler(function(b,a,d){console.error(" \u250c\u2229\u2510(\u25e3_\u25e2)\u250c\u2229\u2510 "," \u250c\u2229\u2510(\u25e3_\u25e2)\u250c\u2229\u2510 "," \u250c\u2229\u2510(\u25e3_\u25e2)\u250c\u2229\u2510 ");console.warn("File:",a);console.warn("Number:",d);console.warn("Date",new Date);console.warn("Location",location.href);console.error("Exception:",b);console.error(" \u250c\u2229\u2510(\u25e3_\u25e2)\u250c\u2229\u2510 "," \u250c\u2229\u2510(\u25e3_\u25e2)\u250c\u2229\u2510 ",
" \u250c\u2229\u2510(\u25e3_\u25e2)\u250c\u2229\u2510 ");return!1})});jsBoot.pack("jsBoot.debug",function(){var b=!1;this.tick=function(c,a){console.info(" [jsBoot.debug.tick]",c);b?console.timeEnd("Time since last tick"):b=console.time("Total time")||!0;console.time("Time since last tick");a&&(b=!1,console.info(" [jsBoot.debug.tick]","Ending measurement! Total boot time:"),console.timeEnd("Total time"))};this.tick("Debug module fully loaded. Starting time measurement")});
