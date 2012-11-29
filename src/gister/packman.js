/**
 * @file
 * @summary Some package manager that doesn't sucks too much.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/gister/packman.js{PUKE-GIT-REVISION}
 */


// Guarantee that require is here

/*
Inline module declarations

// Define sources
gister.module('Bar').at('bar.js');
gister.module('Foo').at('foo.js');

Modules can be declared inline:

gister.module('Foo', function() {
    export let x = 42;
});

gister.import('bar.js').as('Bar');
gister.import({'y': 'localName'}).from('Bar');
gister.import('y').from("bar.js");

External module load

Modules can be loaded from external resources:

    // Variant A: import URL syntax

    // Variant B: module = syntax
It is not necessary to bind a module to a local name, if the programmer simply wishes to import
directly from the module:

*/


/*
gister.use('Module').as('Toto').from('Thing');
gister.use('Module').as('Toto').from('Thing');
gister.add('Toto1234').as('TotoVariableName');
gister.pack('Stuffy.Thing', function(){
});


    define = function(name, deps, callback) {
    require = req = function(deps, callback, relName, forceSync, alt) {

*/

/*global window*/

if (typeof jsBoot == 'undefined')
  var jsBoot = {};

(function(globalObject) {
  'use strict';

  // Adapted from JSON3 (credit Oyvind Sean Kinsey)
  // Detect the "define" function exposed by asynchronous module loaders
  // var isLoader = typeof define === 'function' && define.amd;
  // var internalObj = typeof exports == 'object' && exports;

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
        throw new Error('NEED_A_NAME', 'Trying to bind something without name');
      toAdd.push(lastAdd);
      lastAdd = null;
    }
  };

  this.use = function(a, optional) {
    flush();
    lastUse = {module: a, name: a.split('.').pop(), optional: optional};
    return this;
  };

  this.add = function(a, optional) {
    if ((a === undefined) && !optional)
      throw new Error('UNDEFINED', 'Requesting something local that is undefined');
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



  var simplePull = function(glob, name, optional) {
    name.split('.').forEach(function(fragment) {
      if (!glob || !(fragment in glob))
        if (!optional)
          throw new Error('MISSING', 'Trying to require something that doesn\'t exist: ' + name);
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

  // var amdHack = {};

  this.pack = function(name, factory) {
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
        throw new Error('ALREADY_DEFINED', 'You are shadowing ' + api[item.name] + ' with ' +
            item + ' for name ' + item.name);
      api[item.name] = item.value;
    });

    // If AMD pattern
    /*
    if (isLoader || internalObj) {
      // Get dependencies names
      var deps = [];
      var udeps = [];
      var localNames = [];
      localUse.forEach(function(item) {
        var k = item.module.replace(/\./g, '/').split('/');
        var rest = [];
        while(!(k.join('/') in amdHack) && k.length){
          rest.unshift(k.pop());
          console.warn("******** unshifting", JSON.stringify(rest));
        }
        if(!k.length)
          throw new Error('UNRESOLVED', 'Requested dep doesnt pan out');
        deps.push(k.join('/'));
        udeps.push(rest);

        localNames.push(item.name);
      });

      // Fuck the identifier as well AMD style
      name = name.replace(/\./g, '/');
      // deps.unshift(name);

      if (isLoader) {
        var module;
        var there = (name in amdHack);
        amdHack[name] = module = there ? amdHack[name] : {};
        if(!there){
          console.warn("defininnnnnnnnng", name);
          define(name, amdHack[name]);
        }

        console.warn("getting", JSON.stringify(deps), JSON.stringify(udeps));
        require(deps, function(){
          console.warn("Actually defining/requiring with no name", name);
          var args = Array.prototype.slice.call(arguments);
          localNames.forEach(function(key, idx){
            if (key in api)
              throw new Error('ALREADY_DEFINED', 'You are shadowing ' + key);
            api[key] = args.shift();
            while(udeps[idx].length){
              console.warn("----------> raising the bar");
              api[key] = api[key][udeps[idx].shift()];
            }
            if(api[key] === undefined)
              throw new Error('MISSING', 'Trying to require something that doesn\'t exist');
          });
          // udeps
          console.warn("getting udeps", udeps);

          var sub = {};
          sub = factory.apply(sub, [api]) || sub;
          Object.keys(sub).forEach(function(key){
            module[key] = sub[key];
            define(name + '/' + key, module[key]);
          });
        });

        // require(deps, function(mod){
        //   var module = mod || {};
        //   var args = Array.prototype.slice.call(arguments, 1);
        //   localNames.forEach(function(key){
        //     if (key in api)
        //       throw new Error('ALREADY_DEFINED', 'You are shadowing ' + key);
        //     api[key] = args.shift();
        //     if(api[key] === undefined)
        //       throw new Error('MISSING', 'Trying to require something that doesn\'t exist');
        //   });
        //   console.warn("requiring", name, mod, api);

        //   factory.apply(module, [api]) || module;
        // });

      }
    }else{*/
    localUse.forEach(function(item) {
      if (item.name in api)
        throw new Error('ALREADY_DEFINED', 'You are shadowing name ' + item.name);
      api[item.name] = simplePull(globalObject, item.module, item.optional);
    });

    var r = parentPull(globalObject, name);
    r.o[r.k] = factory.apply(r.o[r.k], [api]) || r.o[r.k];
    //    }
  };

  this.run = function(factory) {
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
        throw new Error('ALREADY_DEFINED', 'You are shadowing ' + item.name);
      api[item.name] = item.value;
    });

    // If AMD pattern
    /*    if (isLoader || internalObj) {
      // Get dependencies names
      var deps = localUse.map(function(item) {
        return item.module.replace(/\./g, '/');
      });
      var localNames = localUse.map(function(item) {
        return item.name;
      });
      if (isLoader) {
        require(deps, function(){
          var args = Array.prototype.slice.call(arguments);
          localNames.forEach(function(key){
            if (key in api)
              throw new Error('ALREADY_DEFINED', 'You are shadowing ' + key);
            api[key] = args.shift();
            if(api[key] === undefined)
              throw new Error('MISSING', 'Trying to require something that doesn\'t exist');
          });
          factory.apply({}, [api]);
        });
      }
    // Regular pattern
    } else {*/
    localUse.forEach(function(item) {
      if (item.name in api)
        throw new Error('ALREADY_DEFINED', 'You are shadowing ' + item.name);
      api[item.name] = simplePull(globalObject, item.module, item.optional);
    });

    factory.apply({}, [api]);
    // }
  };
}).apply(jsBoot, [window]);

