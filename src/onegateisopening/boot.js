// This is a nutshell meant to be aggregated AFTER loader-lab.js and spitfire.js

(function() {
  /*jshint browser:true,evil:true*/
  /*global Spitfire:false*/
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
    var getPackedObjects = function(pack, version, sub, useFull) {
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
    };

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
