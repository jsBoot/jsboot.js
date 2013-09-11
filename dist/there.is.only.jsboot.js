/**
 * @file "Strict" tester.
 *
 * This file is a build-system helper and can be safely ignored.
 *
 * @author WebItUp
 * @version 0.4.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name strict.js
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/strict.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 */

(function() {
  // fool linter
  /*global whateverthenameofthis:true, console:false*/
  'use strict';
  try {
    whateverthenameofthis = 'will crash';
    try {
      console.error('Browser doesn\'t support strict mode!!!');
    }catch (e) {
    }
  }catch (e) {
  }
}).apply(this);
/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(o){var K=o.$LAB,y="UseLocalXHR",z="AlwaysPreserveOrder",u="AllowDuplicates",A="CacheBust",B="BasePath",C=/^[^?#]*\//.exec(location.href)[0],D=/^\w+\:\/\/\/?[^\/]+/.exec(C)[0],i=document.head||document.getElementsByTagName("head"),L=(o.opera&&Object.prototype.toString.call(o.opera)=="[object Opera]")||("MozAppearance"in document.documentElement.style),q=document.createElement("script"),E=typeof q.preload=="boolean",r=E||(q.readyState&&q.readyState=="uninitialized"),F=!r&&q.async===true,M=!r&&!F&&!L;function G(a){return Object.prototype.toString.call(a)=="[object Function]"}function H(a){return Object.prototype.toString.call(a)=="[object Array]"}function N(a,c){var b=/^\w+\:\/\//;if(/^\/\/\/?/.test(a)){a=location.protocol+a}else if(!b.test(a)&&a.charAt(0)!="/"){a=(c||"")+a}return b.test(a)?a:((a.charAt(0)=="/"?D:C)+a)}function s(a,c){for(var b in a){if(a.hasOwnProperty(b)){c[b]=a[b]}}return c}function O(a){var c=false;for(var b=0;b<a.scripts.length;b++){if(a.scripts[b].ready&&a.scripts[b].exec_trigger){c=true;a.scripts[b].exec_trigger();a.scripts[b].exec_trigger=null}}return c}function t(a,c,b,d){a.onload=a.onreadystatechange=function(){if((a.readyState&&a.readyState!="complete"&&a.readyState!="loaded")||c[b])return;a.onload=a.onreadystatechange=null;d()}}function I(a){a.ready=a.finished=true;for(var c=0;c<a.finished_listeners.length;c++){a.finished_listeners[c]()}a.ready_listeners=[];a.finished_listeners=[]}function P(d,f,e,g,h){setTimeout(function(){var a,c=f.real_src,b;if("item"in i){if(!i[0]){setTimeout(arguments.callee,25);return}i=i[0]}a=document.createElement("script");if(f.type)a.type=f.type;if(f.charset)a.charset=f.charset;if(h){if(r){e.elem=a;if(E){a.preload=true;a.onpreload=g}else{a.onreadystatechange=function(){if(a.readyState=="loaded")g()}}a.src=c}else if(h&&c.indexOf(D)==0&&d[y]){b=new XMLHttpRequest();b.onreadystatechange=function(){if(b.readyState==4){b.onreadystatechange=function(){};e.text=b.responseText+"\n//@ sourceURL="+c;g()}};b.open("GET",c);b.send()}else{a.type="text/cache-script";t(a,e,"ready",function(){i.removeChild(a);g()});a.src=c;i.insertBefore(a,i.firstChild)}}else if(F){a.async=false;t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}else{t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}},0)}function J(){var l={},Q=r||M,n=[],p={},m;l[y]=true;l[z]=false;l[u]=false;l[A]=false;l[B]="";function R(a,c,b){var d;function f(){if(d!=null){d=null;I(b)}}if(p[c.src].finished)return;if(!a[u])p[c.src].finished=true;d=b.elem||document.createElement("script");if(c.type)d.type=c.type;if(c.charset)d.charset=c.charset;t(d,b,"finished",f);if(b.elem){b.elem=null}else if(b.text){d.onload=d.onreadystatechange=null;d.text=b.text}else{d.src=c.real_src}i.insertBefore(d,i.firstChild);if(b.text){f()}}function S(c,b,d,f){var e,g,h=function(){b.ready_cb(b,function(){R(c,b,e)})},j=function(){b.finished_cb(b,d)};b.src=N(b.src,c[B]);b.real_src=b.src+(c[A]?((/\?.*$/.test(b.src)?"&_":"?_")+~~(Math.random()*1E9)+"="):"");if(!p[b.src])p[b.src]={items:[],finished:false};g=p[b.src].items;if(c[u]||g.length==0){e=g[g.length]={ready:false,finished:false,ready_listeners:[h],finished_listeners:[j]};P(c,b,e,((f)?function(){e.ready=true;for(var a=0;a<e.ready_listeners.length;a++){e.ready_listeners[a]()}e.ready_listeners=[]}:function(){I(e)}),f)}else{e=g[0];if(e.finished){j()}else{e.finished_listeners.push(j)}}}function v(){var e,g=s(l,{}),h=[],j=0,w=false,k;function T(a,c){a.ready=true;a.exec_trigger=c;x()}function U(a,c){a.ready=a.finished=true;a.exec_trigger=null;for(var b=0;b<c.scripts.length;b++){if(!c.scripts[b].finished)return}c.finished=true;x()}function x(){while(j<h.length){if(G(h[j])){try{h[j++]()}catch(err){}continue}else if(!h[j].finished){if(O(h[j]))continue;break}j++}if(j==h.length){w=false;k=false}}function V(){if(!k||!k.scripts){h.push(k={scripts:[],finished:true})}}e={script:function(){for(var f=0;f<arguments.length;f++){(function(a,c){var b;if(!H(a)){c=[a]}for(var d=0;d<c.length;d++){V();a=c[d];if(G(a))a=a();if(!a)continue;if(H(a)){b=[].slice.call(a);b.unshift(d,1);[].splice.apply(c,b);d--;continue}if(typeof a=="string")a={src:a};a=s(a,{ready:false,ready_cb:T,finished:false,finished_cb:U});k.finished=false;k.scripts.push(a);S(g,a,k,(Q&&w));w=true;if(g[z])e.wait()}})(arguments[f],arguments[f])}return e},wait:function(){if(arguments.length>0){for(var a=0;a<arguments.length;a++){h.push(arguments[a])}k=h[h.length-1]}else k=false;x();return e}};return{script:e.script,wait:e.wait,setOptions:function(a){s(a,g);return e}}}m={setGlobalDefaults:function(a){s(a,l);return m},setOptions:function(){return v().setOptions.apply(null,arguments)},script:function(){return v().script.apply(null,arguments)},wait:function(){return v().wait.apply(null,arguments)},queueScript:function(){n[n.length]={type:"script",args:[].slice.call(arguments)};return m},queueWait:function(){n[n.length]={type:"wait",args:[].slice.call(arguments)};return m},runQueue:function(){var a=m,c=n.length,b=c,d;for(;--b>=0;){d=n.shift();a=a[d.type].apply(null,d.args)}return a},noConflict:function(){o.$LAB=K;return m},sandbox:function(){return J()}};return m}o.$LAB=J();(function(a,c,b){if(document.readyState==null&&document[a]){document.readyState="loading";document[a](c,b=function(){document.removeEventListener(c,b,false);document.readyState="complete"},false)}})("addEventListener","DOMContentLoaded")})(this);/**
 * @file "Any" script loader wrapper.
 *
 * The sole purpose of this file is to wrap any "loader" library
 * behind a unified interface.
 * See links for approaches to embeded loader.
 * This must work without any shim support, in most browsers.
 *
 * @see https://gist.github.com/603980
 * @see http://www.dustindiaz.com/scriptjs/
 *
 * @author WebItUp <dev@webitup.fr> (http://www.webitup.fr/lab)
 * @version 1.2.0
 *
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">MIT</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp <dev@webitup.fr> (http://www.webitup.fr/lab)</a>
 * @name loader.js
 * @location https://github.com/jsBoot/spitfire.js/blob/master/src/loader.js#111-0f8cc49a5082f7c6a0ca6ae84a9d585ad117fcd2
 */

/**
 * Provides a crude "script loader" abstraction on top of whatever
 * loader library is detected.
 * Currently supports labjs and requirejs (headjs and yahoo are provided as well,
 * with fewer test and possibly degraded performance / functionality).
 * The API itself ressembles a lot that of LABJS.
 *
 * @module Spitfire/loader
 * @summary Wrapper script "loader" singleton.
 * @todo implement http://yepnopejs.com/
 * @todo implement http://code.google.com/p/jsload/
 */

(function() {
  /*jshint browser:true, maxcomplexity:11*/
  /*global head:false, YUI:false, yepnope:false, requirejs:false, $LAB:false,
    define:false, exports:false*/
  'use strict';

  // Get a backend
  var backend;

  // http://headjs.com/#api
  if (typeof head != 'undefined')
    backend = function() {
      // Head has no "fork" feature
      return function(uris, callback) {
        uris.push(callback);
        return head.js.apply(head.js, uris);
        // head.js(file1 … fileN, [callback])
      };
    };

  // http://yuilibrary.com/yui/docs/get/index.html
  if (typeof YUI != 'undefined')
    backend = function() {
      var Y;
      YUI().use('get', function(o) {
        Y = o;
      });
      Y.Get.options.async = true;
      return function() {
        Y.Get.js.apply(Y.Get, arguments);
      };
    };

  if (typeof yepnope != 'undefined')
    backend = function() {
      return function(uris, callback) {
        var stamp = uris[uris.length - 1];
        yepnope({load: uris, callback: function(url) {
          if (stamp == url)
            callback();
        }});
      };
    };

  // http://requirejs.org/
  if (typeof requirejs != 'undefined')
    backend = function() {
      return function(uris, callback) {
        requirejs(uris, callback);
      };
    };

  var PvLoader;
  // http://labjs.com/documentation.php
  // LAB override entirely the PvLoader itself - not a backend per-se
  if (typeof $LAB != 'undefined')
    PvLoader = function() {
      var q = $LAB.sandbox();
      this.script = function(uri) {
        q = q.script(uri);
        return this;
      };
      this.wait = function(cbk) {
        // Lab has an irritable anus
        if (cbk)
          q = q.wait(cbk);
        else
          q = q.wait();
        return this;
      };
    };

  /*    backend = function(){
    var q = $LAB.sandbox();
    q.mark = Math.random(1);
    return function(uris, callback) {
      var mark = q.mark;
      for(var x = 0; x < uris.length; x++)
        q = q.script(uris[x]);
      // while (uris.length)
      //   q = q.script(uris.shift());
      q = q.wait(callback);
      q.mark = mark;
    };
  };*/

  if (!PvLoader)
    PvLoader = function() {
      var linger = null;
      var toLoad = [];
      var currentLoading = false;
      var bck = backend();

      var lingerEnd = function() {
        if (currentLoading)
          return;

        currentLoading = toLoad.shift();

        if (!currentLoading)
          return;

        if (!currentLoading.uris.length) {
          var cl = currentLoading.callback;
          currentLoading = false;
          if (cl)
            cl();
          lingerEnd();
          return;
        }

        bck(currentLoading.uris, function(err) {
          var cl = currentLoading.callback;
          currentLoading = false;
          if (cl)
            cl(err);
          lingerEnd();
        });
      };

      /**
       * Allows to request the loading of a given script specified by an uri.
       * The loading is always parallelized (if the underlying library supports it)
       * though the evaluation is parallelized between calls to wait.
       * Only javascript files can be loaded this way.
       *
       * @function module:Spitfire/loader.script
       * @summary Main loader function.
       * @see module:Spitfire/loader.wait
       * @example
       *   loader.script("someuri.js");
       *   loader.script("otheruri.js");
       * @example
       *   loader.script("someuri.js").script("otheruri.js");
       *
       * @param   {String} uri [description].
       * @returns {module:Spitfire/loader} Returns the loader so that calls can be chained.
       */
      this.script = function(uri) {
        if (linger)
          clearTimeout(linger);

        if (!toLoad.length)
          toLoad.push({uris: [], callback: false});
        toLoad[toLoad.length - 1].uris.push(uri);

        linger = setTimeout(lingerEnd, 1);
        return this;
      };

      /**
       * This method allows to specify "groups" of scripts that will be evaluated
       * after each other.
       * There is no guarantee of any sort on the evaluation order inside a group.
       * Note that some backend libraries don't support this properly and instead
       * this blocks *loading* to guarantee the execution order (which is bad).
       *
       * @function module:Spitfire/loader.wait
       * @summary Wait for previous scripts to evaluate.
       * @see module:Spitfire/loader.script
       * @example
       *   loader.script("someuri.js");
       *   loader.script("otheruri.js");
       *   loader.wait(function(){
       *   // both scripts have been executed
       *   });
       * @example
       *   loader.script("uri.js")
       *     .wait()
       *     .script("another.js")// when another executes, uri has been executed
       *     .wait(function(){
       *       // both have been executed
       *   });
       * @param   {Function} [callback] Function to be called when all previous scripts
       * have evaluated.
       * @returns {module:Spitfire/loader} Returns the loader so that calls can be chained.
       */
      this.wait = function(callback) {
        // Grab the last waiting stack, if any
        var me = toLoad.length ? toLoad[toLoad.length - 1] : false;
        // If currently loading, that's our client
        if (currentLoading)
          me = currentLoading;
        // If we have no stack and still a calback, call it now
        if (!me) {
          if (callback)
            callback();
          return this;
        }
        // If the stack doesn't have a callback, that's us
        if (!me.callback) {
          me.callback = callback;
          toLoad.push({uris: [], callback: false});
        }else {
          // Otherwise, it's just a chained callback - add it to a blank stack
          toLoad.push({uris: [], callback: callback});
        }
        return this;
      };
    };

  /**
   * Allows to get a new, separate loader instance
   *
   * @example
   * // Two different, unrelated loading queues.
   *   var ld2 = loader.fork();
   *   loader.script('some.js').wait();
   *   ld2.script('some2.js').wait();
   * @function module:Spitfire/loader.fork
   * @summary Provides a new loading stack
   * @returns {module:Spitfire/loader} Returns a new loader instance
   */
  PvLoader.prototype.fork = function() {
    return new PvLoader();
  };

  /**
  * This is meant as a helper to resolve an uri against that of another script, and does return
  * the "base" uri of a (previously loaded) script matching a name pattern.
  *
  * @todo Note this is NOT guaranteed to work - the document may NOT be ready at the time
  * this is used...
  * Correct approach would be to timeout and repeat this in case it returns false.
  *
  * @function module:Spitfire/loader.base
  * @summary Get the base uri of the first script matching a name pattern
  * @param   {String} pattern Pattern to match the script from which to extract a base uri.
  * @returns {String} Base uri of the matched script.
  */
  PvLoader.prototype.base = function(pattern) {
    var c = document.getElementsByTagName('script');
    var m;
    var re = new RegExp(pattern);
    // for(var x = 0, it; (x < c.length) && (it = c[x].src); x++){
    for (var x = 0, it; x < c.length; (it = c[x].getAttribute('src')), x++) {
      if (it && re.test(it)) {
        m = it.split('/');
        m.pop();
        m = m.join('/') || './';
        break;
      }
    }
    return m || null;
  };

  var idx = 1;
  var hook = null;
  /**
   * This allows to load stylesheets.
   * It works by embedding additional link rel into the document head.
   * Note that the order will be respected, and that they will be appended
   * AFTER anything already present in the head.
   *
   * @function module:Spitfire/loader.style
   * @todo See gulliver - this may fail in subtle ways
   * @summary A simple stylesheet loader.
   * @param   {String} url   Url of the stylesheet.
   * @param   {String} [media] Optional media that the stylesheet applies for.
   * @returns {undefined}
   */
  PvLoader.prototype.style = function(url, media) {
    var h = document.getElementsByTagName('head')[0];
    var s = document.createElement('link');
    s.setAttribute('type', 'text/css');
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('data-spitfire-index', idx);
    if (media)
      s.setAttribute('media', media);
    s.setAttribute('href', url);

    if (!hook)
      hook = h.lastChild;
    // && h.firstChild.nextSibling;
    if (!hook || !hook.nextSibling)
      h.appendChild(s);
    else
      h.insertBefore(s, hook.nextSibling);
    hook = s;
    idx++;
  };

  /*
   * =========================
   * AMD / noAMD dummy pattern
   * Asynchronous module loaders, CommonJS environments, web
   * browsers, and JavaScript engines. Credits: Oyvind Sean Kinsey.
   * =========================
   */
  // Pattern from JSON3
  // Export for asynchronous module loaders, CommonJS environments, web browsers, and JavaScript
  // engines.
  var isLoader = typeof define === 'function' && define.amd;
  var root = typeof exports == 'object' && exports;

  if (isLoader || root) {
    if (isLoader) {
      // Export for asynchronous module loaders. The namespace is
      // redefined because module loaders do not provide the "exports" object.
      define('Spitfire/loader', new PvLoader());
    }
  } else {
    if (!('Spitfire' in this))
      this.Spitfire = {};
    this.Spitfire.loader = new PvLoader();
  }
  /**
   * =========================
   * End of dummy pattern
   * =========================
   */

}).apply(this);

/**
 * @file
 * @summary Set of browser features tests, shims, and minimalistic testing API.
 *
 * @see http://afarkas.github.com/webshim/demos/demos/json-storage.html
 * @see http://code.google.com/p/html5-shims/wiki/LinksandResources
 * @see https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills
 * @see https://github.com/bestiejs/
 * @see http://es5.github.com/#x15.4.4.13
 *
 * @author WebItUp <dev@webitup.fr> (http://www.webitup.fr/lab)
 * @version 1.2.0
 *
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">MIT</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp <dev@webitup.fr> (http://www.webitup.fr/lab)</a>
 * @name shimer.js
 * @location https://github.com/jsBoot/spitfire.js/blob/master/src/shimer.js#111-0f8cc49a5082f7c6a0ca6ae84a9d585ad117fcd2
 */

(function() {
  /*jshint evil:true, browser:true, maxstatements:50,maxcomplexity:60*/
  /*global define:false, exports:false*/
  'use strict';

  /**
   * The idea here is to provide tests to detect browsers missing features
   * and bugs, and propose "shims" uris to be loaded.
   * To some extent, this ressembles modernizr - except it focuses on core
   * features (eg: ES5 language features), and does provide accompanying shims.
   * Currently provided are large parts of ES5, JSON, XHR, geolocation, console
   * and localStorage.
   *
   * @module Spitfire
   * @summary Provides shiming test/patching environment.
   */

  /*
   * =========================
   * AMD / noAMD dummy pattern
   * Asynchronous module loaders, CommonJS environments, web
   * browsers, and JavaScript engines. Credits: Oyvind Sean Kinsey.
   * =========================
   */
  var isLoader = typeof define === 'function' && define.amd;
  var root = typeof exports == 'object' && exports;

  // Pattern from JSON3
  // Export for asynchronous module loaders, CommonJS environments, web browsers, and JavaScript
  // engines.
  if (isLoader || root) {
    if (isLoader) {
      // Export for asynchronous module loaders. The namespace is
      // redefined because module loaders do not provide the "exports" object.
      define('Spitfire', (root = {}));
    }
  } else {
    // Export for browsers and JavaScript engines.
    root = this.Spitfire || (this.Spitfire = {});
  }
  /*
   * =========================
   * End of dummy pattern
   * =========================
   */

  var shimsTest = {};
  var toBeLoaded = [];

  /**
   * This describes what a test object should look like.
   * This is NOT an actual, instanciable class.
   * @todo Tests should be functions instead of booleans
   * @class module:Spitfire.Test
   * @abstract
   * @extends {Object}
   */

  /**
   * Whether or not the environment needs to shim that functionality.
   * @member module:Spitfire.Test.test
   * @type {Boolean}
   */

  /**
   * Optional uri to the file providing the actual shim.
   * This can be left undefined if a functional patch is provided.
   * @see module:Spitfire.Test.patch
   * @member module:Spitfire.Test.uri
   * @type {String}
   */

  /**
   * An optional function providing the actual shim.
   * If specified, will be favored over the uri.
   * @member module:Spitfire.Test.patch
   * @type {Function}
   */


  /**
   * Adds a newly created test to a shim category.
   * Said category can then be "use"-d to request this to be shimed.
   * Predefined categories are specified by this.SAFE (always loaded) and this.UNSAFE.
   *
   * @function module:Spitfire.add
   * @summary Adds a test.
   * @see module:Spitfire.use
   * @see module:Spitfire.Test
   * @see module:Spitfire.SAFE
   * @see module:Spitfire.UNSAFE
   * @example
   * // Provide a conditional shim to be loaded as part of the SAFE batch
   *  Spitfire.add({
   *    test: !Function.prototype.bind,
   *    uri: 'relative_shim_uri_to_bind.js'
   *  }, Spitfire.SAFE);
   * @example
   * // Provide an always-loaded shim, in its own category
   *  Spitfire.add({
   *    test: true,
   *    uri: 'json3.js'
   *  }, Spitfire.JSON);
   * @summary Allows to add a test in a category
   * @param   {module:Spitfire.Test} testObject The test object.
   * @param   {String} category The category to which this shim belong.
   * @returns {undefined}
   */
  root.add = function(testObject, category) {
    if (!(category in shimsTest))
      shimsTest[category] = [];
    shimsTest[category].push(testObject);
  };

  /**
   * For a given category, request that patchable shims are executed
   * and that loadable shims uris be returned once "boot" is called.
   * Note that the SAFE category is ALWAYS requested.
   * Predefined categories consist of UNSAFE, XHR, and JSON
   *
   * @function module:Spitfire.use
   * @example
   *   Spitfire.use(Spitfire.UNSAFE);
   *   var uris = Spitfire.boot();
   * @see module:Spitfire.boot
   * @see module:Spitfire.UNSAFE
   * @see module:Spitfire.XHR
   * @see module:Spitfire.JSON
   * @summary Requests a category of shims
   * @throws INVALID_CATEGORY if the requested category does not have any associated
   * tests.
   * @param   {String} cat Category to load.
   * @returns {undefined}
   */
  root.use = function(cat) {
    if (!cat || !(cat in shimsTest))
      throw 'INVALID_CATEGORY';
    for (var x = 0; x < shimsTest[cat].length; x++)
      toBeLoaded.push(shimsTest[cat][x]);
  };

  /**
   * Once categories have been requested via the "use" method, calling boot
   * evaluate every test and returns the list of uris to load.
   * Shims directly providing functionality via "patch" are executed before this
   * returns.
   * Note that the SAFE category is ALWAYS loaded.
   *
   * @function module:Spitfire.boot
   * @example
   *   Spitfire.use(Spitfire.UNSAFE);
   * // Just do it...
   *   var uris = Spitfire.boot();
   * @summary Give uris to shims.
   * @see module:Spitfire.use
   * @param   {Boolean} [useFull=false] If true, request non-minified versions of the shims.
   * Useful for debugging only.
   * @returns Array<String> An array of uris to load in order to obtain the shims.
   */
  root.boot = function(useFull) {
    var uris = [];
    for (var x = 0, shim; (x < toBeLoaded.length) && (shim = toBeLoaded[x]); x++) {
      if (shim.test) {
        if (shim.patch)
          shim.patch();
        else
          uris.push('burnscars/' + shim.uri + (useFull ? '.js' : '-min.js'));
      }
    }
    return uris;
  };


  /**
   * Enforces the loading of a shimed XHR, enforcing identical functionality
   * in any browser, regardless of the current support.
   * This is useful if you want to be DEAD SURE it will behave the same.
   * Know that XHR is very buggy and present numerous and wide discrepancies
   * between browsers, or even browsers versions - not only in IE.
   *
   * @member module:Spitfire.XHR
   * @constant
   * @type {String}
   */
  root.XHR = 'xhr';
  root.add({test: true, uri: 'xmlhttprequest'}, root.XHR);

  /**
   * Enforces the loading of a shimed JSON, enforcing identical functionality
   * in any browser, regardless of the current support.
   * This is useful if you want to be DEAD SURE it will behave the same.
   * JSON and related functions are very buggy and have wide discrepancies between browsers.
   *
   * @member module:Spitfire.JSON
   * @constant
   * @type {String}
   */
  root.JSON = 'json';
  root.add({test: true, uri: 'json3'}, root.JSON);

  /**
   * Requests that "unsafe" shims are loaded.
   * These are shims that don't actually provide real functionality, just create named methods
   * to allow for ES5 code to actually *run* without errors.
   * The drawback is that it will break feature detection in third-party libraries without
   * actually providing functionality... Careful with that.
   * @member module:Spitfire.UNSAFE
   * @constant
   * @type {String}
   */
  root.UNSAFE = 'unsafe';
  root.add({
    test: !Function.isGenerator,
    uri: 'function.isgenerator'
  }, root.UNSAFE);
  root.add({
    test:
        !Object.preventExtensions ||
        !Object.isSealed ||
        !Object.isFrozen ||
        !Object.seal ||
        !Object.freeze,
    uri: 'es5.shim.unsafe'
  }, root.UNSAFE);

  /**
   * This is the safe category, that should be used for any shim that is slick, does provide
   * complete functionality for a given section.
   * @member module:Spitfire.SAFE
   * @constant
   * @type {String}
   */
  root.SAFE = 'safe';

  /**
   * ES5 provided shims
   */
  var arrayTests =
      ([].unshift('test') === undefined) ||
      ([1, 2].splice(0).length != 2) ||
      !Array.isArray ||
      !Array.prototype.forEach ||
      !Array.prototype.map ||
      !Array.prototype.filter ||
      !Array.prototype.every ||
      !Array.prototype.some ||
      !Array.prototype.reduce ||
      !Array.prototype.reduceRight ||
      !Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1) ||
      !Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1);

  var functionTests = !Function.prototype.bind;
  var objectTests = !Object.keys;
  var dateTests = !Date.now ||
      !Date.prototype.toISOString || !Date.parse ||
      /*      isNaN(Date.parse("2000-01-01T00:00:00.000Z")) ||
      (Date.parse('+275760-09-13T00:00:00.000Z') !== 8.64e15) ||*/
      (new Date(-62198755200000).toISOString().indexOf('-000001') === -1) ||
      (function() {
        var dateToJSONIsSupported = false;
        try {
          dateToJSONIsSupported = (
              Date.prototype.toJSON &&
              new Date(NaN).toJSON() === null &&
              new Date(-62198755200000).toJSON().indexOf('-000001') !== -1 &&
              Date.prototype.toJSON.call({ // generic
                toISOString: function() {
                  return true;
                }
              })
              );
        } catch (e) {
        }
        return !dateToJSONIsSupported;
      })();

  var stringTests = !!'0'.split(void 0, 0).length ||
      (''.substr && '0b'.substr(-1) !== 'b') ||
      !String.prototype.trim ||
          '\x09\x0A\x0B\x0C\x0D \xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
          '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
          '\u2029\uFEFF'.trim();

  var es5Tests = arrayTests || functionTests || objectTests || dateTests || stringTests;

  // Although in ES5-SHIM, most modern browsers unfortunately want this
  /*  root.add({
      test: !es5Tests && (!String.prototype.trim ||
          '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
          '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
          '\u2029\uFEFF'.trim()),
      patch: function(){
        var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
            '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
            '\u2029\uFEFF';
        ws = '[' + ws + ']';
        var trimBeginRegexp = new RegExp('^' + ws + ws + '*'),
            trimEndRegexp = new RegExp(ws + ws + '*$');
        String.prototype.trim = function trim() {
          if (this === undefined || this === null) {
            throw new TypeError("can't convert " + this + ' to object');
          }
          return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
        };
      }
  }, root.SAFE);
  */
  // WebKit modern bugs... patched by ES5-shim, but we want it in there to avoid it
  /*  root.add({
    test: !!'0'.split(void 0, 0).length,
    patch: function(){
      var string_split = String.prototype.split;
      String.prototype.split = function(separator, limit) {
          if(separator === void 0 && limit === 0)return [];
          return string_split.apply(this, arguments);
      }
    }
  }, root.SAFE);
 */

  // Present in ES5-SHAM, which we don't always want while this is useful
  root.add({
    test: Object.freeze && (function() {
      try {
        Object.freeze(function() {});
      } catch (exception) {
        return true;
      }
      return false;
    })(),
    patch: function() {
      Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
          if (typeof object == 'function') {
            return object;
          } else {
            return freezeObject(object);
          }
        };
      })(Object.freeze);
    }
  }, root.SAFE);

  // Needed about everywhere
  root.add({
    test: (typeof TypeError == 'undefined'),
    patch: function() {
      window.TypeError = Error || function() {};
    }
  }, root.SAFE);

  /**
   * Standalone, other tests
   */

  // ==========
  // Objects - although these are available in es5-sham,
  // they are bundled with other, riskier shams, so let's keep it
  // separate for now
  // ==========
  root.add({
    test: !Object.getPrototypeOf,
    uri: 'object.getprototypeof'
  }, root.SAFE);

  root.add({
    test: !Object.getOwnPropertyDescriptor,
    uri: 'object.getownpropertydescriptor'
  }, root.SAFE);

  root.add({
    test: !Object.getOwnPropertyNames,
    uri: 'object.getownpropertynames'
  }, root.SAFE);

  root.add({
    test: !Object.create,
    uri: 'object.create'
  }, root.SAFE);

  root.add({
    test: !Object.defineProperty,
    uri: 'object.defineproperty'
  }, root.SAFE);

  root.add({
    test: !Object.defineProperties,
    uri: 'object.defineproperties'
  }, root.SAFE);

  root.add({
    test: !Object.isExtensible,
    uri: 'object.isextensible'
  }, root.SAFE);

  // ==========
  // Events
  // ==========
  root.add({
    test: !window.addEventListener,
    uri: 'events'
  }, root.SAFE);

  // ==========
  // Localstorage
  // ==========
  root.add({
    test: !window.localStorage,
    uri: 'localstorage'
  }, root.SAFE);

  // ==========
  // Geolocation
  // ==========
  root.add({
    test: !navigator.geolocation,
    uri: 'geolocation'
  }, root.SAFE);

  /**
   * Provided by third-party
   */

  // ==========
  // ES5
  // ==========
  root.add({
    test: es5Tests,
    uri: 'es5.shim'
  }, root.SAFE);


  // ==========
  // JSON
  // ==========
  root.add({
    test: !window.JSON,
    uri: 'json3'
  }, root.SAFE);

  // ==========
  // XHR
  // ==========

  root.add({
    test: !window.XMLHttpRequest,
    uri: 'xmlhttprequest'
  }, root.SAFE);

  // ==========
  // Console
  // ==========
  root.add({
    test: !window.console || eval('/*@cc_on @_jscript_version <= 9@*/') || !(function() {
      var ok = true;
      var props = [
        'log', 'debug', 'info', 'warn', 'error', 'assert' /*, 'dir', 'dirxml', 'exception', 'time',
          'timeEnd', 'table',
          'clear', 'trace', 'group', 'groupCollapsed', 'groupEnd', 'timeStamp', 'profile',
          'profileEnd', 'count'*/
      ];
      for (var x = 0; x < props.length; x++)
        ok &= !!window.console[props[x]];
      return ok;
    })(),
    uri: 'console'
  }, root.SAFE);

  // Use all safe shims by default
  root.use(root.SAFE);

  // ==========
  // Request animation frame
  // ==========

  root.add({
    test: !window.requestAnimationFrame || !window.cancelAnimationFrame,
    uri: 'animationframe'
  }, root.SAFE);

  root.add({
    test: !Array.from || !Array.of,
    uri: 'es6.array'
  }, root.SAFE);

  root.add({
    // XXX incomplete
    test: !Math.acosh || !Math.asinh || !Math.atanh || !Math.cosh || !Math.sinh || !Math.tanh ||
        !Math.expm1,
    uri: 'es6.math'
  }, root.SAFE);

  root.add({
    test: !Number.isFinite || !Number.isInteger || !Number.isNaN || !Number.toInteger,
    uri: 'es6.number'
  }, root.SAFE);

  root.add({
    test: !Object.getOwnPropertyDescriptors || !Object.getPropertyDescriptor ||
        !Object.getPropertyNames || !Object.is || !Object.isnt,
    uri: 'es6.object'
  }, root.SAFE);

  root.add({
    test: !String.prototype.repeat || !String.prototype.startsWith ||
        !String.prototype.endsWith || !String.prototype.contains,
    uri: 'es6.string'
  }, root.SAFE);

  // IE at large doesn't support additional arguments on settimeout.
  // This can't be shimed independtly considering we work synchronously for now with loader
  // AND XXX BEWARE - this means that setTimeout can't be used in following code
  // BEFORE this specific setTimeout runs out
  setTimeout(function(a) {
    if (!a) {
      var deref = window.setTimeout;
      window.setTimeout = function(callback, delay) {
        var a = Array.prototype.slice.call(arguments);
        a.shift();
        a.shift();
        var cl = function() {
          callback.apply(this, a);
        };
        deref(cl, delay);
      };
    }
  }, 1, true);

}).apply(this);


// http://www.calormen.com/polyfill/
// https://github.com/mozilla/shumway
// Check for modernizr once again as well
// https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills

// This is a nutshell meant to be aggregated AFTER loader-lab.js and spitfire.js

(function() {
  /*jshint browser:true,evil:true*/
  /*global Spitfire:false, define:false, exports:false*/
  'use strict';

  // List of available static resources to be served via getPack
  // var statics = '{SPIT-STATICS}';

  /**
   * Hash-passed parameters handling
   */
  // Default parameters values
  var params = {
    notminified: false,
    debug: false,
    trunk: false,
    experimental: false,
    base: null
  };


  // Extract parameters from script uri
  var ref = document.getElementsByTagName('script');
  for (var i = 0, tup, item; (i < ref.length); i++) {
    item = ref[i].src;
    if (/there\.is\.only\.jsboot/.test(item)) {
      // Have a base on us - still, allow for deplaced routing
      params.base = item.replace(/[^\/]+(?:[#]+)?$/, '');
      params.notminified = !/-min/.test(item);
      if (/#/.test(item)) {
        tup = item.split('#').pop().split(',');
        while (tup.length)
          params[tup.pop()] = true;
      }
      break;
    }
  }

  // Debug implies not minified
  params.notminified = params.notminified || params.debug;


  // Dumb-as-shit closure for AMD fuckwadry until gister gets in and we can save using all this crap
  var beWise = function(ld, shim) {
    /**
     * Abstract spitfire loader
     */
    var insertThing = function(url, minified) {
      if (minified)
        url = url.replace(/(\.[^.]+$)/, '-min$1');
      var t = url.match(/\.([^.]+)$/);
      if (t)
        t = t.pop().toLowerCase();
      switch (t) {
        case 'js':
          // XXX failure to load should STOP
          ld.script(url);
          break;
        case 'css':
          // XXX media?
          ld.style(url, 'all');
          break;
        default:
          // Make jshint happy...
          if (true)
            throw new Error('Don\'t know how to load requested:' + url);
          break;
      }
    };

    var wait = function(cbk) {
      ld.wait(cbk);
    };

    /**
     * Shims handling
     */
    var getShims = function(minified, withUnsafe) {
      if (withUnsafe)
        shim.use(shim.UNSAFE);
      var shims = shim.boot(!minified);
      // Kind of tricky - don't double minify
      for (var x = 0; x < shims.length; x++)
        insertThing(params.base + shims[x]);
    };

    /**
     * Static packages management
     */

    /**
     * Private helper to load a specific entry from a pack (eg: an array of urls)
     * Technically, abstract the statics.
     */
    /*    var getPackedObjects = function(pack, version, sub, useFull) {
      // Sub pattern matching on the pack (useful for stuff that come in non-versioned flavors)
      var re = sub && new RegExp(sub);
      // Version itself - defaulting on trunk
      // XXX tiny crap don't support normalized naming - hence the workaround for null version :(
      if (version != 'noversion')
        version = new RegExp('-' + (version || 'trunk') + '.');

      var inserting = false;
      // For each item in the pack
      for (var x = 0, item, subtest; (x < pack.length) && (item = pack[x]); x++) {
        subtest = item.split('/').pop();
        // Enforce submatching if requested, and test version
        if ((!re || re.test(subtest)) && ((version == 'noversion') || version.test(item))) {
          inserting = true;
          insertThing(item, !useFull);
        }
      }
      if (!inserting)
        throw 'Failed inserting requested ' + pack + ' version: ' + version + ' sub: ' + sub;
    };*/

    /**
     * Boot main: this will load the default / recommended jsboot stack.
     * That is: shims, ember, jsboot
     */
    this.boot = new (function() {
      var common = function(debug, version) {
        // XXX technically, this is not the same thing as HTML cond includes...
        // So, this may or may not be a good idea...
        var isIe = eval('/*@cc_on @_jscript_version <= 8 && !@*/false');
        if (isIe) {
          bootLoader.use('ie7', '2.1');
          bootLoader.wait();
        }

        bootLoader.use('normalize', version || '2.0', null, debug);
        bootLoader.use('h5bp', version || '4.0', null, debug);
        bootLoader.use(bootLoader.SHIMS, null, null, debug);
        bootLoader.wait();
        bootLoader.use(bootLoader.MINGUS, null, null, debug);
        // Stacktrace should be in core prolly
        bootLoader.use('stacktrace', version || 'stable', null, debug);
        bootLoader.wait();
        bootLoader.use(bootLoader.CORE, null, null, debug);
        bootLoader.wait();
        if (debug) {
          // And so console
          bootLoader.use('console', version || 'stable', null, debug);
          bootLoader.use(bootLoader.DEBUG, null, null, debug);
        }
        // XXX is a separate stack obviously
        // bootLoader.use(bootLoader.UI);
      };

      this.backbone = function(cbk, debug, trunk) {
        trunk = (params.trunk || trunk) && 'trunk';
        debug = params.debug || debug;
        common(debug, trunk);

        bootLoader.use('jquery', trunk || '1.8', null, debug);
        bootLoader.use('i18n', trunk || '3.0', null, debug);
        // this.use('handlebars', params.trunk ? 'trunk' : '1.b6', 'main');// runtime?
        bootLoader.wait();
        bootLoader.use('backbone', trunk || '0.9', null, debug);
        bootLoader.wait(function() {
          throw 'Backbone stack is largely untested. You may continue at your own risks';
        });
        bootLoader.wait(cbk);
        return bootLoader;
      };

      this.ember = function(cbk, debug, trunk) {
        trunk = (params.trunk || trunk) && 'trunk';
        debug = params.debug || debug;
        common(debug, trunk);
        bootLoader.use('jquery', trunk || '1.8', null, debug);
        bootLoader.use('handlebars', trunk || '1.0', 'main', debug);// runtime? 1.b6
        bootLoader.use('i18n', trunk || '3.0', null, debug);
        bootLoader.wait();
        bootLoader.use('ember', trunk || '1.0', debug ? 'debug' : 'prod', debug);
        bootLoader.wait(cbk);
        // XXX singletons here now unfortunately have conditionnals on Ember
        // This could be solved by being asynchronous on package execution
        // but would break everything else, likely...
        // Or by splitting out the App controller and other singleton stuff like that
        // maybe having a centralized jsBoot.start
        bootLoader.use(bootLoader.SERVICE, null, null, debug);
        return bootLoader;
      };


      this.tooling = function(cbk, debug, trunk) {
        trunk = (params.trunk || trunk) && 'trunk';
        debug = params.debug || debug;
        common(debug, trunk);
        bootLoader.use('prettify', params.trunk ? 'trunk' : '1.0', 'prettify');
        bootLoader.use('jasmine', params.trunk ? 'trunk' : '1.2', 'core');
        bootLoader.wait();
        bootLoader.use('prettify', params.trunk ? 'trunk' : '1.0', 'lang');
        bootLoader.use('jasmine', params.trunk ? 'trunk' : '1.2', 'html');
        bootLoader.wait(cbk);
        // XXX singletons here now unfortunately have conditionnals on Ember
        bootLoader.use(bootLoader.SERVICE, null, null, debug);
        return bootLoader;
      };
    })();


    var bootLoader = this.loader = new (function() {

      /**
       * Available "stacks" to be spoofed to the use method
       */
      this.SHIMS = 'shims-stack';

      // Shortcut to request trunk versions for something
      this.TRUNK = 'trunk';

      // Available modules
      this.MINGUS = params.base + 'mingus.js';
      // *Basic* jsBoot functionality required for anything else to work
      this.CORE = params.base + 'core.js';
      // Any of these below depend on core - *stressing that*
      this.DEBUG = params.base + 'debug.js';
      // Also depend on Mingus
      this.SERVICE = params.base + 'service.js';
      this.UI = params.base + 'ui.js';

      /**
       * Shimit main
       */
      // this.useShims = function(withUnsafe) {
      //   // This is undocumented - allows to use placeholders shims - will fuck up feature detection
      //   if (withUnsafe)
      //     Spitfire.use(Spitfire.UNSAFE);

      //   var shims = Spitfire.boot(debug);

      //   for (var x = 0; x < shims.length; x++)
      //     ld.script(spitfireLink + shims[x]);
      //   return this;
      // };

      /**
       * Wait main
       */

      this.wait = function(cbk) {
        wait(cbk);
        return this;
      };

      /**
       * Loading something that way will not block the main loader
       * Right now, is useful for external third-party APIs that we don't provide an abstraction for
       * like youtube, uservoice, analytics, etc.
       * Callback is mandatory if one wants to be notified, and you can't stack multiple modules the
       * way "use" allows.
       */
      this.lazyUse = function(scriptUrl, callback) {
        var fork = ld.fork();
        fork.script(scriptUrl);
        fork.wait(callback);
      };

      /**
       * Simple "debug" helper to get a list of available dependencies
       */
      // this.list = function() {
      //   return statics;
      // };

      this.params = function(name) {
        var c = document.getElementsByTagName('script');
        var re = new RegExp(name);
        for (var x = 0, it; x < c.length; x++) {
          it = c[x].getAttribute('src');
          if (it && re.test(it))
            return it.split('#').pop();
        }
      };

      /**
       * Use main
       */
      this.use = function(thing, version, sub, forceFull) {
        switch (thing) {
          // Shims
          case this.SHIMS:
            // Use of version is undocumented - allows to use placeholders shims - will fuck up
            // feature detection
            getShims(!params.notminified && !forceFull, params.experimental);
            this.wait();
            break;

          // Modules
          case this.CORE:
          case this.DEBUG:
          case this.MINGUS:
          case this.SERVICE:
          case this.UI:
            insertThing(thing, !params.notminified && !forceFull);
            break;

          default:
            // if (thing in statics)
            //   getPackedObjects(statics[thing], version, sub, params.notminified || forceFull);
            // else
            insertThing(thing);
            break;
        }
        return this;
      };
    })();


    /*
    this.getScriptBaseUrl = function(scriptName) {
      if (!scriptName)
        scriptName = document.scripts[0].src;
      var ret;
      var m = new RegExp(scriptName);
      Array.prototype.some.call(document.scripts, function(item) {
        // XXX have some IRI magic on this shit
        if (m.test(item.src)) {
          ret = item.src.split('/');
          ret.pop();
          ret = ret.join('/');
        }
        return ret;
      });
      return ret;
    };
    */
  };

  // XXX all this ridiculous little dance must cease after gister is there
  /**
   * =========================
   * AMD / noAMD dummy pattern
   * Asynchronous module loaders, CommonJS environments, web
   * browsers, and JavaScript engines. Credits: Oyvind Sean Kinsey.
   * =========================
   */
  var isLoader = typeof define === 'function' && define.amd;
  var root = typeof exports == 'object' && exports;

  // Pattern from JSON3
  // Export for asynchronous module loaders, CommonJS environments, web browsers, and JavaScript engines.
  if (isLoader || root) {
    if (isLoader) {
      // Export for asynchronous module loaders. The namespace is
      // redefined because module loaders do not provide the "exports" object.
      // define('jsBoot', (root = {}));
      // require(['Spitfire/loader', 'Spitfire'], function(sl, s) {
      //   beWise.call(root, sl, s);
      // });
      root = {};
      define('jsBoot', ['Spitfire/loader', 'Spitfire'], function(sl, s) {
        beWise.call(root, sl, s);
        // define('jsBoot/loader', root.loader);
        // define('jsBoot/boot', root.boot);
        return root;
      });
    }
  } else {
    // Export for browsers and JavaScript engines.
    root = this.jsBoot = {};
    // root = this.jsBoot.boot = {};
    beWise.call(root, Spitfire.loader, Spitfire);
  }
  /**
   * =========================
   * End of dummy pattern
   * =========================
   */
}).call(this);



// jsBoot.Ember = new (function() {
//   // Helper that loads a puke compiled template
//   // this.loadCompiledTemplate = function(url, callback) {
//   //   var xhrtpl = new XMLHttpRequest();
//   //   xhrtpl.open('GET', url, true);
//   //   xhrtpl.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//   //   xhrtpl.onreadystatechange = function() {
//   //     if (xhrtpl.readyState == 4 && xhrtpl.status == 200) {
//   //       var data = xhrtpl.responseText;
//   //       var parser = /\/[*\s]{1,}@template\s?:\s+([a-z0-9_.-\/]+)(?:[^\/]+|[^*]\/)*[*]\/((?:[^\/]+|[\/][^*])*)/g;
//   //       var result, name, content;
//   //       while ((parser.lastIndex < data.length) && (result = (parser.exec(data)))) {
//   //         content = result.pop();
//   //         name = result.pop();
//   //         Em.TEMPLATES[name] = Em.Handlebars.compile(content);
//   //       }
//   //       // And init the application
//   //       callback();
//   //     }
//   //   };
//   //   xhrtpl.send();
//   // };

//   var tpls = {};
//   var cpltpl = {};

//   this.loadTemplates = function(url, callback) {
//     var xhrtpl = new XMLHttpRequest();
//     xhrtpl.open('GET', url, true);
//     xhrtpl.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//     xhrtpl.onreadystatechange = function() {
//       if (xhrtpl.readyState == 4 && xhrtpl.status == 200) {
//         var data = xhrtpl.responseText;
//         var parser = /\/[*\s]{1,}@template\s?:\s+([a-z0-9_.-\/]+)(?:[^\/]+|[^*]\/)*[*]\/((?:[^\/]+|[\/][^*])*)/g;
//         var result, name, content;
//         while ((parser.lastIndex < data.length) && (result = (parser.exec(data)))) {
//           content = result.pop();
//           name = result.pop();
//           tpls[name] = content;
//         }
//         // And init the application
//         callback();
//       }
//     };
//     xhrtpl.send();
//   };

//   this.getLoadedTemplate = function(name) {
//     if (!(name in cpltpl))
//       cpltpl[name] = Em.Handlebars.compile(tpls[name]);
//     return cpltpl[name];
//   };
// })();











// jsBoot.core.loader = Spitfire.loader;



// Spitfire.loader.script('http://localhost:8080/target/target-script-min.js');


// Spitfire.loader.script('https://getfirebug.com/firebug-lite.js');//#startOpened=false,
// overrideConsole=true,enablePersistent=true');
// Spitfire.loader.wait(function(){
//   alert("am waiting too!!!!");
// });

// Here, AMD could be really useful
// XXX MUST wait for the shims one way or the other...

// var mods = {};

// Spitfire.loader.module = function(name){
//   if(mods[name].blocking)
//     this.wait();
//   this.script(mods[name].uri);
// };

// // This should be aggregated with the main lib - this is dull and blocks loading for nothing
// mods.mingus = {uri: coreHost + '/mingus' + suffix, blocking: false};
// // though... all this is crappy
// mods.core = {uri: coreHost + '/ember-roxee' + suffix, blocking: true};


// XXX firebuglite support
// XXX should honor a debug setting of some sort in order to toggle up magically if there is no support
// in the browser.
// jsBoot.core.debug = new (function(){
//   this.preload = function(){
//     // document.getElementsByTagName('html')[0].setAttribute('debug','true');
//     Spitfire.loader.script('https://getfirebug.com/firebug-lite.js#startOpened=true,startInNewWindow=false,
//     overrideConsole=true,enablePersistent=true');
//   };

//   this.open = function(){
//     var max = 0;
//     Spitfire.loader.script('https://getfirebug.com/firebug-lite.js#startOpened=true,startInNewWindow=false,
//     overrideConsole=true,enablePersistent=true');
//     var opener = function(){
//       max++;
//       console.warn("-> Firebug lite attempt at booting...");
//       try{
//         Firebug.chrome.open();
//       }catch(e){
//         console.error(e);
//         if(max < 10)
//           window.setTimeout(opener, 100);
//         else
//           console.error("Cant open... I give up");
//       }
//     };

//     Spitfire.loader.wait(opener);
//   };

//   this.close = function(){
//     Firebug.chrome.close();
//   };
// });

// jsBoot.core.debug.preload();

// XXX fails in IE???
// delete window.jsBootConfig;
/**
 * @file
 * @summary Some package manager that doesn't sucks too much.
 *
 * @author WebItUp
 * @version 0.4.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/gister/packman.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 */

/*global window*/

(function(globalObject) {
  /*jshint boss:true*/
  'use strict';

  var toUse = [];
  var lastUse;
  var toAdd = [];
  var lastAdd;

  var flush = function() {
    if (lastUse) {
      toUse.push(lastUse);
      lastUse = null;
    }
    if (lastAdd) {
      if (!lastAdd.name)
        throw new Error('NEED_A_NAME: Trying to bind "something" without any name');
      toAdd.push(lastAdd);
      lastAdd = null;
    }
  };

  var simplePull = function(glob, name, optional) {
    name.split('.').forEach(function(fragment) {
      if (!glob || !(fragment in glob))
        if (!optional)
          throw new Error('MISSING: Trying to require something that doesn\'t exist' + name);
        else
          return (glob = undefined);
        glob = glob[fragment];
    });
    return glob;
  };

  var parentPull = function(glob, name) {
    var ret = {};
    name.split('.').forEach(function(fragment) {
      ret.o = glob;
      ret.k = fragment;
      if (!(fragment in glob))
        glob[fragment] = {};
      glob = glob[fragment];
    });
    return ret;
  };

  var packer = function() {
    // Close anything going on
    flush();
    // Dereference requested stuff and flush it
    var localUse = toUse;
    var localAdd = toAdd;
    toUse = [];
    toAdd = [];

    // Add local elements to the API
    var api = {};
    localAdd.forEach(function(item) {
      if (item.name in api)
        throw new Error('ALREADY_DEFINED: You are shadowing ' + api[item.name] + ' with ' +
            item + ' for name ' + item.name);
      api[item.name] = item.value;
    });

    localUse.forEach(function(item) {
      if (item.name in api)
        throw new Error('ALREADY_DEFINED: You are shadowing name ' + item.name);
      api[item.name] = simplePull(globalObject, item.module, item.optional);
    });
    return api;
  };

  this.use = function(a, optional) {
    flush();
    lastUse = {module: a, name: a.split('.').pop(), optional: optional};
    return this;
  };

  this.add = function(a, optional) {
    if ((a === undefined) && !optional)
      throw new Error('UNDEFINED: Requesting something local that is undefined');
    flush();
    lastAdd = {value: a};
    return this;
  };

  this.as = function(a) {
    if (lastUse)
      lastUse.name = a;
    else if (lastAdd)
      lastAdd.name = a;
    flush();
  };

  this.has = function(name) {
    return simplePull(globalObject, name, true) !== undefined;
  };

  this.pack = function(name, factory) {
    var api = packer();
    var r = parentPull(globalObject, name);
    var ret = factory.apply(r.o[r.k], [api]);
    if (ret)
      r.o[r.k] = ret;
  };

  this.run = function(factory) {
    var api = packer();
    factory.apply({}, [api]);
  };

}).apply(jsBoot, [window]);
