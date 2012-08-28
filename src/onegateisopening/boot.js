// This is a nutshell meant to be aggregated AFTER loader-lab.js and spitfire.js

(function() {
  // Dumb-as-shit closure for AMD fuckwadry until gister gets in and we can save using all this crap
  var beWise = function(ld, shim) {
    /**
     * Abstract spitfire
     */
    var insertThing = function(url) {
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
     * Internal constants that got puked
     */
    // List of available static resources to be served via getPack
    var statics = '{SPIT-STATICS}';
    // Absolute link to the spitfire host
    var spitfireLink = '{SPIT-BASE}/';

    /**
     * Private helper to load a specific entry from a pack (eg: an array or urls)
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
          // Packed objects support alternate min syntax, so, do that if requested
          if (!useFull)
            item = item.replace(/(\.[^.]+$)/, '-min$1');
          // Insert "the thing"
          insertThing(item);
        }
    };


    // window.jsBoot = {
    //   core: {},
    //   Ember: {}
    // };

    /**
     * Available "stacks" to be spoofed to the use method
     */
    this.SHIMS = 'shims-stack';
    this.EMBER_STACK = 'ember-stack';
    this.TOOLING_STACK = 'tooling-stack';

    // Shortcut to request trunk versions for something
    this.TRUNK = 'trunk';

    /**
     * Debug
     */
    var debug = false;

    this.debug = new (function() {
      /**
       * This is for the debug version
       */

      var cssReload = function() {
        var t = [];
        var h = document.getElementsByTagName('head')[0];
        Array.prototype.forEach.call(document.getElementsByTagName('link'), function(item) {
          if (item.rel && item.rel.match(/style/)) {
            var p = item.getAttribute('href').replace(/\?jsbootCacheBuster=[^&]+/, '') +
                '?jsbootCacheBuster=' + Date.now();
            item.setAttribute('href', p);
          }
        });
        Array.prototype.forEach.call(document.getElementsByTagName('style'), function(item) {
          if (item.type && item.type.match(/\/css$/) && item.innerHTML.match(/@import/)) {
            var bef = item.nextSibling;
            var pn = item.parentNode;
            item.parentNode.removeChild(item);
            if (bef)
              bef.parentNode.insertBefore(item, bef);
            else
              pn.appendChild(item);
          }
        });
      };

      this.cssPoller = new (function() {
        var cssPollerTout;
        this.start = function() {
          cssReload();
          cssPollerTout = window.setTimeout(this.start, 1000);
        }.bind(this);

        this.stop = function() {
          window.clearTimeout(cssPollerTout);
          cssPollerTout = null;
        };

        this.trigger = function() {
          cssReload();
        };

        this.status = function() {
          return !!cssPoller;
        };
      })();


      this.start = function() {
        debug = true;
      };

      this.stop = function() {
        debug = false;
      };

      this.status = function() {
        return debug;
      };

    })();

    /**
     * Boot main: this will load the default / recommended jsboot stack.
     * That is: shims, ember, jsboot
     */
    this.boot = function(cbk, trunk) {
      this.use(this.SHIMS);
      this.wait();
      this.use(this.EMBER_STACK, trunk);
      this.wait(cbk);
      return this;
    };

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
        case this.SHIMS:
          // This is undocumented - allows to use placeholders shims - will fuck up feature detection
          if (version)
            shim.use(shim.UNSAFE);
          // Passing debug true means NOT minified
          var shims = shim.boot(debug);
          for (var x = 0; x < shims.length; x++)
            insertThing(spitfireLink + shims[x]);
          wait();
          break;

        case this.EMBER_STACK:
          // XXX for now, ember pre doesn't support yet 1.8
          getPackedObjects(statics.jquery, version ? 'trunk' : 1.7, '', debug);
          getPackedObjects(statics.handlebars, version ? 'trunk' : '1.b6', 'main', debug);// runtime?
          wait();
          getPackedObjects(statics.ember, version ? 'trunk' : '1.0.pre', debug ? 'debug' : 'prod', debug);
          getPackedObjects(statics.i18n, version ? 'trunk' : '3rc2', '', debug);
          wait();
          break;

        case this.TOOLING_STACK:
          getPackedObjects(statics.sh, version ? 'trunk' : 1.8, 'core', debug);
          getPackedObjects(statics.jasmine, version ? 'trunk' : '1.2.0', 'core', debug);
          ld.wait();
          getPackedObjects(statics.sh, version ? 'trunk' : 1.8, 'js', debug);
          getPackedObjects(statics.jasmine, version ? 'trunk' : '1.2.0', 'html', debug);
          wait();
          break;

        default:
          if (thing in statics)
            getPackedObjects(statics[thing], version, sub, debug);
          else
            insertThing(thing);
          break;
          // Enforce sequential for some stuff
      }
      return this;
    };

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
      define('jsBoot/core', (root = {}));
      require(['Spitfire/loader', 'Spitfire'], function(sl, s) {
        beWise.call(root, sl, s);
      });
    }
  } else {
    // Export for browsers and JavaScript engines.
    this.jsBoot = {};
    root = this.jsBoot.core = {};
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
