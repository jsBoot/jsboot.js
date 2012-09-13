// This is a nutshell meant to be aggregated AFTER loader-lab.js and spitfire.js

(function() {
  // List of available static resources to be served via getPack
  var statics = '{SPIT-STATICS}';
  var spitBase = '{SPIT-BASE}/';

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
  for (var i = 0, tup, item; (i < ref.length) && (item = ref[i].src); i++) {
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
          throw new Error('Don\'t know how to load requested:', url);
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
        insertThing(spitBase + shims[x]);
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
      version = new RegExp('-' + (version || 'trunk') + '.');

      // For each item in the pack
      for (var x = 0, item; (x < pack.length) && (item = pack[x]); x++)
        // Enforce submatching if requested, and test version
        if ((!re || re.test(item)) && version.test(item)) {
          insertThing(item, !useFull);
        }
    };

    /**
     * Boot main: this will load the default / recommended jsboot stack.
     * That is: shims, ember, jsboot
     */
    this.boot = new (function() {
      var common = function(debug) {
        bootLoader.use(bootLoader.SHIMS);
        bootLoader.wait();
        bootLoader.use(bootLoader.MINGUS);
        // Stacktrace should be in core prolly
        bootLoader.use('stacktrace', params.trunk ? 'trunk' : '0.3');
        // XXX temporary - 
        bootLoader.wait();
        bootLoader.use(bootLoader.CORE);
        bootLoader.wait();
        if (debug)
          bootLoader.use(bootLoader.DEBUG);
        bootLoader.use(bootLoader.SERVICE);
      };

      this.backbone = function(cbk, debug) {
        common(params.debug || debug);
        bootLoader.use(bootLoader.BACKBONE_STACK, params.trunk);
        bootLoader.wait(cbk);
        return bootLoader;
      };

      this.ember = function(cbk, debug) {
        common(params.debug || debug);
        bootLoader.use(bootLoader.EMBER_STACK, params.trunk, params.debug || debug);
        bootLoader.wait(cbk);
        return bootLoader;
      };
    })();


    var bootLoader = this.loader = new (function() {

      /**
       * Available "stacks" to be spoofed to the use method
       */
      this.SHIMS = 'shims-stack';
      this.EMBER_STACK = 'ember-stack';
      this.BACKBONE_STACK = 'backbone-stack';
      this.TOOLING_STACK = 'tooling-stack';

      // Shortcut to request trunk versions for something
      this.TRUNK = 'trunk';

      // Available modules
      this.MINGUS = params.base + 'mingus.js';
      // *Basic* jsBoot functionality required for anything else to work
      this.CORE = params.base + 'core.js';
      // Any of these below depend on core *stressing that*
      this.DEBUG = params.base + 'debug.js';
      this.GISTER = params.base + 'gister.js';
      this.SERVICE = params.base + 'service.js';

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
       * Use main
       */
      this.use = function(thing, version, sub) {
        switch (thing) {
          // Shims
          case this.SHIMS:
            // Use of version is undocumented - allows to use placeholders shims - will fuck up
            // feature detection
            getShims(!params.notminified, params.experimental);
            this.wait();
            break;

          // Modules
          case this.MINGUS:
          case this.CORE:
          case this.SERVICE:
          case this.GISTER:
          case this.DEBUG:
            insertThing(thing, !params.notminified);
            break;

          // "Complete" stacks
          case this.BACKBONE_STACK:
            this.use('jquery', params.trunk ? 'trunk' : 1.7);
            // this.use('handlebars', params.trunk ? 'trunk' : '1.b6', 'main');// runtime?
            this.wait();
            this.use('backbone', params.trunk ? 'trunk' : '0.9.2');
            this.use('i18n', params.trunk ? 'trunk' : '3rc2');
            this.wait(function() {
              throw 'Backbone stack is largely untested. You may continue at your own risks';
            });
            break;

          case this.EMBER_STACK:
            // XXX for now, ember pre doesn't support yet 1.8
            this.use('jquery', params.trunk ? 'trunk' : 1.7);
            this.use('handlebars', params.trunk ? 'trunk' : '1.b6', 'main');// runtime?
            this.wait();
            this.use('ember', params.trunk ? 'trunk' : '1.0.pre', sub ? 'debug' : 'prod');
            this.use('i18n', params.trunk ? 'trunk' : '3rc2');
            this.wait();
            break;

          case this.TOOLING_STACK:
            this.use('sh', params.trunk ? 'trunk' : 1.8, 'core');
            this.use('jasmine', params.trunk ? 'trunk' : '1.2.0', 'core');
            this.wait();
            this.use('sh', params.trunk ? 'trunk' : 1.8, 'js');
            this.use('jasmine', params.trunk ? 'trunk' : '1.2.0', 'html');
            this.wait();
            break;

          default:
            if (thing in statics)
              getPackedObjects(statics[thing], version, sub, params.notminified);
            else
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
      define('jsBoot/boot', (root = {}));
      require(['Spitfire/loader', 'Spitfire'], function(sl, s) {
        beWise.call(root, sl, s);
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


// Spitfire.loader.script('https://getfirebug.com/firebug-lite.js');//#startOpened=false,overrideConsole=true,enablePersistent=true');
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
//     Spitfire.loader.script('https://getfirebug.com/firebug-lite.js#startOpened=true,startInNewWindow=false,overrideConsole=true,enablePersistent=true');
//   };

//   this.open = function(){
//     var max = 0;
//     Spitfire.loader.script('https://getfirebug.com/firebug-lite.js#startOpened=true,startInNewWindow=false,overrideConsole=true,enablePersistent=true');
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
