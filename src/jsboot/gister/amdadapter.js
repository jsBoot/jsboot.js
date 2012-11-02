/**
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @file Provides an abstraction to be able to use transparently AMD or regular namespacing.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/gister/amdadapter.js{PUKE-PACKAGE-GIT-REV}
 */

// Might read almond for culture https://raw.github.com/jrburke/almond/latest/almond.js

(function() {
  'use strict';

  /**
   * A crappy helper to be able to live with or without AMD, and define modules or produce
   * classic namespace objects indifferently.
   * You pass it a string identifier representing your namespace to hook onto, "dependencies",
   * along with your closure function defining your code.
   * Your closure will be executed in the scope of the namespace defined by the "identifier" variable,
   * and then your dependencies as additional arguments.
   * Note that for modules, a parent module will also be defined with access to its "childs".
   *
   * So, this ISN'T about having AMD-like functions everywhere, instead of... AMD.
   * This IS about being able to write a nice package manager on top of it for (internal) needs,
   * that will adapt itself nicely to whatever the user ultimately wants.
   *
   * @param  {String} identifier The name of the root namespace to bind to (eg: "MyLibary.Something").
   * @param  [ {Array} deps]      An optional array of dependencies (use the identifier syntax).
   * @param  {Function} factory  The closure that defines your code.
   * @return {undefined}          Doesn't return anything.
   */

  this.simpleRequire = (function(deps, factory) {
    var isLoader = typeof define === 'function' && define.amd;
    var internalObj = typeof exports == 'object' && exports;

    // Export for asynchronous module loaders, CommonJS environments, web browsers, and JavaScript engines.
    if (isLoader || internalObj) {
      if (isLoader) {
        deps = deps.map(function(item) {
          return item.replace('.', '/');
        });
        require(deps, factory);
      }
    } else {
      deps = deps.map(function(depName) {
        var sc = this;
        depName.split('.').map(function(fragment) {
          sc = sc[fragment];
        });
        return sc;
      }, this);
      // Pass-up the dependencies to the function applied on scope
      factory.apply(this, deps);
    }
  }.bind(this));

  this.simpleDefine = (function(identifier, deps, factory) {
    // Handle varied syntax (with or without deps)
    if (typeof deps == 'function') {
      factory = deps;
      deps = [];
    }
    // Adapted from JSON3 (credit Oyvind Sean Kinsey)
    // Detect the "define" function exposed by asynchronous module loaders
    var isLoader = typeof define === 'function' && define.amd;
    var internalObj = typeof exports == 'object' && exports;

    // Export for asynchronous module loaders, CommonJS environments, web browsers, and JavaScript engines.
    if (isLoader || internalObj) {
      // Rename dependencies to match AMD syntax
      deps = deps.map(function(item) {
        return item.replace('.', '/');
      });
      // Fuck the identifier as well AMD style
      identifier = identifier.replace('.', '/');

      if (isLoader) {
        define(identifier, function(require, exports/*, module*/) {
          // Resolve deps
          deps = deps.map(function(item) {
            return require(item);
          });
          internalObj = {};
          internalObj = factory.apply(internalObj, deps) || internalObj;
          for (var i in internalObj) {
            if (internalObj.hasOwnProperty(i))
              exports[i] = internalObj[i];
          }
        });
      }
      // XXX not ready for COJS
    } else {
      // Export for browsers and JavaScript engines.
      var sc = this;
      var topScope;
      var topFragment;
      // Build-up namespace if necessary
      identifier.split('.').forEach(function(fragment) {
        topFragment = fragment;
        topScope = sc;
        sc = sc[fragment] || (sc[fragment] = {});
      });
      // Fetch dependencies
      deps = deps.map(function(depName) {
        var insc = this;
        depName.split('.').map(function(fragment) {
          insc = insc[fragment];
        });
        return insc;
      }, this);
      // Pass-up the dependencies to the function applied on scope
      var ret = factory.apply(sc, deps) || sc;
      // If the factory returned, use that instead of whatever was altered on the root
      if (ret)
        topScope[topFragment] = ret;
    }
  }.bind(this));
}).apply(this);

/*
  var parentHelper = {};
  this.defineSpitfire = function(identifier, deps, factory) {
    // A map like helper (can't rely on the browser yet)
    var map = function(arr, fun) {
      var ret = [];
      for (var i = 0; i < arr.length; i++) {
        ret.push(fun(arr[i]));
      }
      return ret;
    };

    // Handle varied syntax (with or without deps)
    if (typeof deps == 'function') {
      factory = deps;
      deps = [];
    }

    // Adapted from JSON3 (credit Oyvind Sean Kinsey)
    // Detect the "define" function exposed by asynchronous module loaders
    var isLoader = typeof define === 'function' && define.amd;
    var internalObj = typeof exports == 'object' && exports;

    // Export for asynchronous module loaders, CommonJS environments, web browsers, and JavaScript engines.
    if (isLoader || internalObj) {
      // Rename dependencies to match AMD syntax
      deps = map(deps, function(item) {
        return item.replace('.', '/');
      });
      // If the "parent" module was not defined, define it
      identifier = identifier.replace('.', '/');

      if (isLoader) {
        var parent = identifier.split('/');
        var child = parent.pop();
        parent = parent.join('/');
        if (!(parent in parentHelper)) {
          parentHelper[parent] = {};
          define(parent, function(require, exports, module) {
            console.warn('Actually defining solo', parent, JSON.stringify(parentHelper[parent]));
            for (var i in parentHelper[parent])
              exports[i] = require(parentHelper[parent][i]);
          });
        }
        parentHelper[parent][child] = identifier;
        // Add ourselves in the defined list
        parentHelper[identifier] = {};
        // Export for asynchronous module loaders. The namespace is redefined because
        // module loaders do not provide the "exports" object.
        define(identifier, function(require, exports, module) {
          // Resolve deps
          var d = [];
          for (var i = 0; i < deps.length; i++)
            d.push(require(deps[i]));
          // Provision to magically expose later defined submodules
          for (i in parentHelper[identifier])
            exports[i] = require(parentHelper[identifier][i]);
          internalObj = {};
          var ret = factory.apply(internalObj, d) || internalObj;
          for (var i in ret)
            exports[i] = ret[i];
        });
      }
    } else {
      // Export for browsers and JavaScript engines.
      var scope = window;
      var topScope;
      var topFragment;
      // Build-up namespace if necessary
      identifier.split('.').forEach(function(fragment) {
        topFragment = fragment;
        topScope = scope;
        scope = scope[fragment] || (scope[fragment] = {});
      });
      // Fetch dependencies
      deps = map(deps, function(depName) {
        var scope = window;
        map(depName.split('.'), function(fragment) {
          scope = scope[fragment];
        });
        return scope;
      });
      // pass-up both the root namespace and dependencies as function arguments
      var ret = factory.apply(scope, deps) || scope;
      if (ret)
        topScope[topFragment] = ret;
    }
  };

 */





/*

// Just to be dead sure gist won't fail at browser sniffing time
(function() {
  if (!('navigator' in window))
    window.navigator = {};

  if (!('appName' in navigator))
    navigator.appName = '';
  if (!('appVersion' in navigator))
    navigator.appVersion = '';
  if (!('platform' in navigator))
    navigator.platform = '';
  if (!('userAgent' in navigator))
    navigator.userAgent = '';
})();
*/
