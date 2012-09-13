/**
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @file This is jsBoot (internal) package manager.
 * It's meant to operate over either AMD or plain old-fashioned js namespace.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/gister/require.js{PUKE-PACKAGE-GIT-REV}
 */


// Guarantee that require is here




// import()

// module Foo {
//     export let x = 42;
// }

// // Variant A: import URL syntax
// import "bar.js" as Bar;
// import y from Bar;

// // Variant B: module = syntax
// module Bar = "bar.js";
// import y from Bar;
// Gister.module('Foo', function() {
//   export let x = 42;
//   export function sum(x, y) {
//     return x + y;
//   }
//   export var pi = 3.141593;
// });

// // With assign
// Gister.import('url.js').as('Bar');
// Gister.from('Bar').import('Bar');
// // Direct fetch
// Gister.import('y').from('url.js');


// // we can import in script code, not just inside a module
// Gister.import(['sum', 'pi']).from('Foo');
// Gister.import('*').from('Foo');
// alert('2π = ' + sum(pi, pi));

// // a static module reference
// Gister.module('M', Foo);
// // reify M as an immutable "module instance object"
// alert('2π = ' + M.sum(M.pi, M.pi));

// //
// Gister.import({ draw: drawShape }).from('shape');
// Gister.import({ draw: drawGun }).from('cowboy');


// module widgets {
//   export module button { ... }
//   export module alert { ... }
//   export module textarea { ... }
//   ...
// };

// import { messageBox, confirmDialog } from widgets.alert;

// Gister.module('JSON').at('http://json.org/modules/json2.js');


/**
 * Gister.import('URL').as('ModuleName');
 * Gister.import('SubName').from('ModuleName'); // Implicitely from URL
 * Gister.import('SubName').from('OtherModuleName'); // From package explicitely registred  as OtherModuleName
 */

// this.simpleRequire = function(deps, factory) {
// this.simpleDefine = function(identifier, deps, factory) {

simpleDefine('jsBoot.gister', ['Spitfire.loader'], function(loader) {
  // Next package will be attached to this root
  var nextRoot;
  // Next dependencies for the next package
  var nextDependencies = {};
  // Holds internally defined packages
  var hiddenPackages = {};
  // Private variable to yield props until next "as" call
  var last = {name: undefined, symbol: undefined, scope: undefined};

  // The actual gister
  var builder = function() {

    var packToUrl = {};
    var urlToPack = {};

    var lastUrl;
    this.url = function(url) {
      urlToPack[url] = [];
      lastUrl = url;
      loader.script(url);
      loader.wait(function() {
        var packs = urlToPack[url];
        packs.forEach(function(item) {
          packToUrl[item].ready = true;
        });
      });
    };

    this.provides = function(pack) {
      if (typeof pack != 'array')
        pack = [pack];
      pack.forEach(function(item) {
        urlToPack[lastUrl].push(item);
        packToUrl[item] = {url: lastUrl, ready: false};
      });
      return this;
    };

    // This will be public - creating objects on window
    this.openpublic = function(n) {
      nextRoot = create(n, window);
      return this;
    };

    // Will sink into hidden
    this.openprivate = function(n) {
      nextRoot = create(n, hiddenPackages);
      return this;
    };

    this.from = function(n) {
    };


    /**
     * Request some public API to be imported.
     * Many may be requested at once, by using multiple arguments.
     * If the last argument is set to true, the imports shall be optional - otherwise
     * failing to import one of them will throw.
     * @param  {String} pack The name of a public pack to import.
     * @return {Gister} Returns self.
     */
    this.use = function(pack) {
      var args = Array.prototype.slice.call(arguments);
      var opt = (typeof args[args.length - 1] == boolean) && args.pop();
      last = {name: undefined, symbol: undefined, scope: nextDependencies};
      args.forEach(function(pack) {
        last.name = botch(pack, window, opt, nextDependencies);
      });
      return this;
    };

    /**
     * Request some private API to be imported.
     * Many may be requested at once, by using multiple arguments.
     * If the last argument is set to true, the imports shall be optional - otherwise
     * failing to import one of them will throw.
     * @param  {String} pack The name of a private pack to import.
     * @return {Gister} Returns self.
     */
    this.reveal = function(pack) {
      var args = Array.prototype.slice.call(arguments);
      var opt = (typeof args[args.length - 1] == boolean) && args.pop();
      last = {name: undefined, symbol: undefined, scope: nextDependencies};
      args.forEach(function(pack) {
        last.name = botch(pack, hiddenPackages, opt, nextDependencies);
      });
      return this;
    };

    /**
     * Adds a random "thing", to be exposed in the scope under a name to be specified by following
     * this statement with a call to .as("name").
     * Useful for parameters for example.
     * @param {Whatever} param The "thing" to be exposed.
     */
    this.add = function(param) {
      last = {name: undefined, symbol: param, scope: nextDependencies};
      return this;
    };

    this.contains = function(pack) {
      return !!find(pack, hiddenPackages, true);
    };

    // Rename last symbol (use, reveal, sink, add)
    this.as = function(as) {
      // Params end-up here as they don't define a name right away
      if (!last.name) {
        last.scope[as] = last.symbol;
      }else if (as != last.name) {
        // If the rename makes any sense
        last.scope[as] = last.scope[last.name];
        delete last.scope[last.name];
      }
      // Blank out the shit to avoid train accidents afterwards
      last = {name: undefined, symbol: undefined, scope: undefined};
      return this;
    };

    this.pack = function(n, fun) {
      if (!nextRoot)
        throw new Error('You need to call openpublic/openprivate before being calling pack');

      // Add ourselves to the imported stuff
      nextDependencies['gister'] = this;

      // Attach the function to its root, pass-up the imports and execute
      nextRoot[n] = fun.call(nextRoot[n], nextDependencies) || nextRoot[n];

      // if (typeof nextRoot[n] == 'function') {
      //   nextRoot[n].isGistOf = function(thing) {
      //     return this.constructor == thing;
      //   };
      // }

      // Forget context for next pack
      nextRoot = undefined;
      // Forget imports for next pack
      nextDependencies = {};
    };

    /**
     * Allows to delete a specific package entirely.
     * If the name is ommited, will delete gister itself.
     * @param  {String} pack The name of the package.
     * @return {undefined} No return value.
     */
    this.del = function(pack) {
      if (name) {
        del(pack, window, true);
        del(pack, hiddenPackages, true);
      }else {
        delete Roxee.gister;
      }
    };

    /**
     * Hides away some symbol as an internal.
     * Can be not deleted, but simply attached to internals
     * @param  {String} pack Name of the symbol to sink.
     * @param  {Boolean} dontdelete If set to true, the original namespace will be left untouched.
     * @return {Self}            this.
     */
    this.sink = function(pack, dontdelete) {
      last = {name: botch(pack, window, false, hiddenPackages), symbol: undefined, scope: hiddenPackages};
      if (!dontdelete)
        del(n, window);
      return this;
    };


  };

  /*  var destroyable = function(scope, n) {
    // Preserve possibly defined method
    var old = ('annihilate' in scope[n]) ? scope[n].annihilate : null;
    scope[n].annihilate = function() {
      var ex;
      try {
        if (old)
          old.apply(scope[n]);
      }catch (e) {
        ex = e;
      }
      // If a ns is reopened, the destroyable method might have been overriden
      // and if not, we are gonna do this multiple times, so, careful bitch, be lazy.
      del(n, scope, true);
      // Rethrow any caught exception
      if (ex)
        throw ex;
    };
  };*/

  // Private methods
  var botch = function(pack, scope, optional, imports) {
    // Get symbol from last part of name
    var lastName = pack.split('.').pop();
    // Fetch object
    var obj = find(pack, scope, optional);
    // Prevent override of gister
    if ((lastName == 'gister'))
      throw new Error('Gister is a non-importable package and a reserved symbol...');
    // Warn about overwriting existing symbols, be it for the same package or a different one
    if (lastName in imports) {
      if (imports[lastName] == obj)
        throw new Error('Importing already imported package ' + pack + '...');
      else
        throw new Error('Importing package ' + pack + 'that will shadow already defined symbol');
    }
    // Check if the package was already imported under a different name
    // Not a problem per-se - just very bad practice
    for (var i in imports) {
      if (imports[i] == obj)
        throw new Error('Importing already imported package ' + pack + ' (known as ' + i + ')');
    }
    // Finally set the import anyway, and return
    imports[lastName] = obj;
    return lastName;
  };

  var del = function(pack, scope, lazy) {
    var lastScope, lastFragment;
    try {
      pack.split('.').forEach(function(fragment) {
        lastFragment = fragment;
        lastScope = scope;
        scope = scope[fragment];
      });
      delete lastScope[lastFragment];
    }catch (e) {
      if (!lazy)
        throw new Error('You try to delete a non existent package (' +
            pack + ' in scope ' + scope + ').');
    }
    return true;
  };

  var find = function(pack, scope, optional) {
    try {
      pack.split('.').forEach(function(fragment) {
        scope = scope[fragment];
      });
    }catch (e) {
      if (!optional)
        throw new Error('You mandatory requested a package that doesn\'t exist (' +
            pack + ' in scope ' + scope + ').');
    }
    return scope;
  };

  var create = function(pack, scope) {
    pack.split('.').forEach(function(fragment) {
      scope = scope[fragment] || (scope[fragment] = {});
    });
    return scope;
  };

  // Expose publicly - and I mean PUBLICLY - no fuck AMD
  return hiddenPackages['gister'] = new builder();
  // Check [native] on used functions?
});
