/**
 * @file
 * @summary Useful to prevent a badly behaved prod application from pissing its guts out.
 * Otherwise, you really shouldn't have console calls in your code...
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/core/errorHandler.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */

/*global console*/
jsBoot.add(console).as('nativeConsole');
jsBoot.pack('jsBoot.core', function(api) {
  'use strict';

  var fakeConsole = {
    debug: function() {},
    log: function() {},
    info: function() {},
    trace: function() {},
    warn: console.warn,
    error: console.error
  };

  this.toggleConsole = function(on) {
    var mesh = on ? api.nativeConsole : fakeConsole;
    Object.getOwnPropertyNames(mesh).forEach(function(i) {
      console[i] = mesh[i];
    });
  };
});

/**
 * The overloaded Error object has an additional (array) member "stack".
 * If there is a printStackTrace method available in the scope at the moment the Error is built,
 * it will evalute that method - [] otherwise.
 *
 * @file
 * @summary An enhanced Error object with stacktrace.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/core/error.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 * @see  http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 * @see  http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
 */

/*global Error, window, printStackTrace*/
jsBoot.add(Error).as('NativeError');
jsBoot.pack('jsBoot.core', function(api) {
  'use strict';

  // Possibly pb related to X-Domain limitation shit
  this.Error = function(name, message) {
    // Error behavior is strange...
    var b = api.NativeError.apply(this, [message]);
    // Not too sure this leads anywhere safe though (google code fux...)
    if ((this == window) || (this === undefined))
      return;
    this.message = b.message;
    this.stack = b.stack;
    this.name = name;
    if (!this.stack)
      this.stack = (typeof 'printStackTrace' != 'undefined') ? printStackTrace() : [];
  };

  Object.getOwnPropertyNames(api.NativeError.prototype).forEach(function(i) {
    if (i != 'constructor')
      this.Error.prototype[i] = api.NativeError.prototype[i];
  }, this);

  ['NOT_IMPLEMENTED', 'UNSPECIFIED', 'NOT_INITIALIZED', 'WRONG_ARGUMENTS',
   'UNSUPPORTED', 'NATURAL_BORN_CRASH'].forEach(function(item, idx) {
    this.Error[item] = this.Error.prototype[item] = idx;
  }, this);

  this.Error.prototype.toString = function() {
    return this.name + ': ' + this.message + '\nStack: ' +
        ((typeof this.stack == 'array') ? this.stack.join('\n') : this.stack);
  };

});

/**
 * @namespace
 * @name jsBoot
 */

/**
 * @namespace
 * @name jsBoot.core
 */

/**
 * @class
 * @name jsBoot.core.Error
 */


/**
 * Just in case you are too lazy to define errors yourself, use this hodge pot here... NOT recommended.
 * @property
 * @static
 * @constant
 * @name jsBoot.core.Error.UNSPECIFIED
 */


/**
 * Use this in a method that explicitely wants to say implementation is missing (in a virtual for eg.)
 * @property
 * @static
 * @constant
 * @name jsBoot.core.Error.NOT_IMPLEMENTED
 */


/**
 * Meant to say that something has not been properly inited before being used
 * @property
 * @static
 * @constant
 * @name jsBoot.core.Error.NOT_INITIALIZED
 */


/**
 * Use this if you do validate arguments, and what's passed doesn't cut it
 * @property
 * @static
 * @constant
 * @name jsBoot.core.Error.WRONG_ARGUMENTS
 */



/**
 * Use this in factories for example, where the arguments ask for something that's not doable.
 * @property
 * @static
 * @constant
 * @name jsBoot.core.Error.UNSUPPORTED
 */



/**
 * Interecepted throw that gets respoofed into the list.
 * @property
 * @static
 * @constant
 * @name jsBoot.core.Error.NATURAL_BORN_CRASH
 */

/**
 * Provides a simple declarative mechanism to get hooked onto exceptions
 *
 * @file
 * @summary Mechanism to catch exceptions.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/core/errorHandler.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */

jsBoot.pack('jsBoot.core', function() {
  /*global window, console*/
  'use strict';

  // Consumer may register an handler instead of the dumb one
  /**
   * Call this declare a callback for exceptions
   * @summary
   * @function
   * @name jsBoot.core.registerErrorHandler
   * @param   {Function} hnd Callback to be notified of exceptions.
   * @returns undefined
   */

  this.registerErrorHandler = function(hnd) {
    handlers.push(hnd);
  };

  var handlers = [];
  if (window.onerror)
    handlers.push(window.onerror);

  var err = function(message, ex) {
    console.error(' [jsBoot.core.errorHandler]', message, ex);
  };

  window.onerror = function(e) {
    var args = Array.prototype.slice.call(arguments);
    try {
      return handlers.some(function(item) {
        return item.apply(null, args);
      });
    }catch (ed) {
      err('Some error handler shamefully failed to do anything useful because of', ed);
      err('"Lost" error was:', e);
    }
  };

});

/**
 * @namespace Errors spat by eventDispatchers
 * @name Roxee.gist.errors.eventDispatcher
 */

/**
 * A listener failed during execution.
 * @memberOf Roxee.gist.errors.eventDispatcher
 * @property
 * @type String
 * @constant
 * @name LISTENER_FAILURE
 */

jsBoot.add(1).as('delay');
jsBoot.pack('jsBoot.types', function(api) {
  /*jshint browser:true*/
  'use strict';

  // A simple event emitter, supporting coalesce and asynchronous dispatching
  this.EventDispatcher = function() {
    // Useful while debugging (will CRASH AND STOP dispatching on the first failing listener)
    this.crash = false;

    this.addEventListener = function(type, listener, context, throwable) {
      if (!(type in listeners)) {
        listeners[type] = [];
        queue[type] = [];
      }
      // Bind the listener onto the desired execution context
      var l = listener.bind(context);
      l.throwable = !!throwable;
      l.bound = listener;
      l.context = context;
      listeners[type].push(l);
    };

    // BEWARE keeping references to inactive objects will prevent needed GC... This is no *weak* ref.
    // XXX untested code
    this.removeEventListener = function(type, listener, context) {
      if (!(type in listeners))
        return;

      listeners[type].some(function(l, x) {
        if ((listener == l.bound) && (context == l.context))
          listeners[type].splice(x, 1);
      });

      // for (var x = 0, l; (x < listeners[type].length) && (l = listeners[type][x]); x++)
      //   if ((listener == l.bound) && (context == l.context)) {
      //     listeners[type].splice(x, 1);
      //     return;
      //   }
    };

    this.dispatchEvent = function(type, details, synchronous) {
      // Only dispatch if there is something to listen, or if this is a change event and there is a mutation listener
      if (!((type in listeners) || (type == this.CHANGE && ((BEFORE_MUTATION in listeners) ||
          (AFTER_MUTATION in listeners)))))
        return;
      // Cancel any previous running coalesce
      if (type in tout)
        clearTimeout(tout[type]);

      // Queue-up the details for the event to dispatch
      if (!(type in queue))
        queue[type] = [];
      queue[type].push(details);
      // If it's asynchronous, set timeout delay already
      if (!synchronous)
        tout[type] = setTimeout(handleQueue, api.delay, type, this);
      else
        handleQueue(type);
    };

    // Private var to hold listeners for given types
    var listeners = {};
    // Private var to hold timeout references for asynchronous dispatching
    var tout = {};
    // Queue, to hold coalescable events
    var queue = {};

    this.destroy = function() {
      Object.keys(tout).forEach(function(type) {
        clearTimeout(tout[type]);
      });
      // for (var type in tout) {
      //   if (tout.hasOwnProperty(type))
      //     clearTimeout(tout[type]);
      // }
      queue = {};
      tout = {};
      listeners = {};
    };

    var handleQueue = (function(type, target) {
      // If that was asynchronous, clear-up the timeout now
      if (type in tout)
        delete tout[type];

      // Change event may dispatch additional before and after mutation
      if ((type == CHANGE) && (BEFORE_MUTATION in listeners))
        listeners[BEFORE_MUTATION] = doHandle(listeners[BEFORE_MUTATION], target, BEFORE_MUTATION, {},
            'A before mutation event listener failed', this.crash);

      // For each event in the queue to be dispatched
      if (type in listeners)
        queue[type].forEach(function(details) {
          listeners[type] = doHandle(listeners[type], target, type, details, 'An event listener failed', this.crash);
        }, this);
      // Empty queue now
      queue[type].splice(0, queue[type].length);

      // Change event may dispatch additional before and after mutation
      if ((type == CHANGE) && (AFTER_MUTATION in listeners))
        listeners[AFTER_MUTATION] = doHandle(listeners[AFTER_MUTATION], target, AFTER_MUTATION, {},
            'An after mutation event listener failed', this.crash);
    }.bind(this));
  };

  // Dispatched when a batch of changes are handled
  var BEFORE_MUTATION = this.EventDispatcher.prototype.BEFORE_MUTATION = 'changestart';

  // Might be used to notify something changed in the object
  var CHANGE = this.EventDispatcher.prototype.CHANGE = 'change';

  // Dispatched when a batch of changes ends
  var AFTER_MUTATION = this.EventDispatcher.prototype.AFTER_MUTATION = 'changestop';

  // Static helper function
  var doHandle = function(listeners, target, type, details, mumble, crash) {
    // XXX Right now, result is not handled - provisional for cancelling / holding stuff
    var result = false;
    var eve = {
      type: type,
      target: target,
      details: details
    };
    var defThrow = [];
    var ret = listeners.filter(function(listener) {
      if (crash) {
        result |= listener(eve);
      }else {
        try {
          result |= listener(eve);
        }catch (e) {
          defThrow.push(new jsBoot.core.Error('LISTENER_FAILURE', mumble + ':' + e));
        }
      }
      return !listener.throwable;
    });

    // Throw no matter what - the crash thing is cool to stop the flow at the first error,
    // but production code HAS to report failures
    if (defThrow.length)
      throw defThrow.shift();
    return ret;
  };
});

jsBoot.use('jsBoot.types.EventDispatcher').as('dispatcher');

// An object that when mutating (eg: via a call to the change method) will dispatch a change event
jsBoot.pack('jsBoot.types', function(api) {
  /*global Ember*/
  'use strict';

  // XXX clarify this shit
  // XXX What's wrong with Ember.Object.prototype?
  this.Mutable = function() {
    if (typeof Ember != 'undefined') {
      var em = new Ember.Object();
      for (var i in em) {
        if (i != 'constructor' && i != 'set')
          this[i] = em[i];
      }
    }
    api.dispatcher.apply(this);
  };

  this.Mutable.prototype = Object.create(api.dispatcher.prototype);

  // XXX The persistence of "change" is only here for Roxee backward compat
  this.Mutable.prototype.set = this.Mutable.prototype.change = function(key, value) {
    var ov = (typeof Ember != 'undefined') ? this.get(key) : this[key];
    if (value == ov)
      return;
    this.dispatchEvent(this.CHANGE, {key: key, oldValue: ov, newValue: value});
    if (typeof Ember != 'undefined') {
      Ember.set(this, key, value);
    }else {
      this[key] = value;
    }
  };


  // Should not be constructed before the store is ready
  /*
  this.StoreMutable = function(storeObject){
    this.Mutable.apply(this);

    Object.keys(storeObject).forEach(function(key){
      // XXX miss typage instanciation
      this[key] = storeObject[key];
    }, this);

    // Should save on user-idle, or on logout / shutdown
    this.addEventListener(this.AFTER_MUTATION, function(){
      // Reset / repopulate store object
      Object.keys(storeObject).forEach(function(key){
        // XXX miss typage serialization
        if(key in this)
          storeObject[key] = this[key];
        else
          delete storeObject[key];
      });
    }, this);
  };

  StoreMutable.prototype = Object.create(Mutable.prototype);
  */

});



/*
  var des = function(valuesHolder){
  };
  return {
    toto: {
      enumerable: true,
      configurable: false,
      writable: true,
      value: 'whatever'
    },
    titi: {
      enumerable: true,
      configurable: false,
      value: 'toto',
      parse: function(value){
        return 'parse: ' + value;
      },
      serialize: function(value){
        return 'serialize: ' + value;
      }
    }
  };

  var TypedMutable = function(descriptor){
    var proxy = Object.create({}, descriptor);
    Object.keys(descriptor).forEach(function(key){
      Object.defineProperty(this, key, {
        enumerable: descriptor[key].enumerable,
        configurable: true,
        get: function(){
          if(descriptor[key].parse){
            return descriptor[key].parse(proxy[key]);
          return proxy[key];
        },
        set: descriptor[key].writable ? function(value){
          if(descriptor[key].serialize){
            proxy[key] = descriptor[key].serialize(value);
            return;
          }
          switch(typeof descriptor[key].value){
            case 'number':
              proxy[key] = parseInt(value, 10);
              break;
            case 'boolean':
              proxy[key] = !!value;
              break;
            case 'string':
              proxy[key] = '' + value;
              break;
            case 'object':
            // XXX code injection risk?
              proxy[key] = value; // Object.create({}, value);
              break;
            case 'function':
              // Custom filtering method
          }
        } : undefined
      });
    }, this);
  };

  var a1 = new TypedMutable(des);
  var a2 = new TypedMutable(des);
  // throw "toto"
*/

/*
jsBoot.use('jsBoot.types.Mutable');
jsBoot.pack('jsBoot.types', function(api) {
  'use strict';

  this.TypedMutable = function(descriptor, initialMesh) {
    api.Mutable.apply(this);

    this.isTyped = true;

    var privatePool = {};
    var lastMesh = {};

    Object.keys(descriptor).forEach(function(i) {
      var item = descriptor[i];
      switch (typeof item) {
        case 'number':
          this[i] = parseInt(item, 10);
          break;
        case 'boolean':
          this[i] = (item == 'true');
          break;
        case 'string':
          this[i] = '' + item;
          break;
        case 'object':
          // May be null, an array, or an object-object
          this[i] = item;
          break;
        case 'function':
          Object.defineProperty(this, i, {
            enumerable: true,
            configurable: true,
            get: function() {
              // XXX super dirty and dangerous - cause of the bind
              // Verify this in IE and other non-bindable browsers
              if (item.isDirty || item.constructor != Function)
                return item(lastMesh[i]);
              else {
                if (typeof privatePool[i] == 'undefined') {
                  privatePool[i] = new item(lastMesh[i] || null);
                }
                return privatePool[i];
              }
            },
            set: function(value) {
              privatePool[i] = value;
              // XXX dirty trix to let polymorph descriptors do whatever job need be be done
              if (item.isDirty)
                privatePool[i] = item(value);
            }
          });
          break;
      }
    }, this);

    this.free = function() {
      privatePool = {};
    };

    this.toObject = function() {
      var ret = {};
      Object.keys(descriptor).forEach(function(i) {
        ret[i] = (!!this[i] && (typeof this[i] == 'object') && ('toObject' in this[i])) ? this[i].toObject() : this[i];
      }, this);
      return ret;
    };

    this.fromObject = function(networkMesh) {
      if (typeof networkMesh != 'object')
        networkMesh = {id: networkMesh};
      Object.keys(networkMesh).forEach(function(i) {
        if (!(i in descriptor))
          return;
        var item = networkMesh[i];
        switch (typeof descriptor[i]) {
          case 'number':
            this.set(i, parseInt(item, 10));
            break;
          case 'boolean':
            this.set(i, (item == 'true'));
            break;
          case 'string':
            this.set(i, '' + item);
            break;
          case 'object':
            // May be null, an array, or an object-object
            this.set(i, item);
            break;
          case 'function':
            if (typeof privatePool[i] != 'undefined') {
              if (descriptor[i].constructor == Function) {
                if (!!privatePool[i]) {
                  privatePool[i].fromObject(networkMesh[i]);
                }else {
                  lastMesh[i] = networkMesh[i];
                }
              }else
                this.set(i, descriptor[i](networkMesh[i]));
            }else
              // Merge and override lastMesh otherwise, to be used for later construction
              lastMesh[i] = networkMesh[i];


            // if(typeof privatePool[i] != 'undefined')
            //   if('fromObject' in privatePool[i])
            //     privatePool[i].fromObject(networkMesh[i]);
            //   else
            //     this.set(i, descriptor[i](networkMesh[i]));
            // else
            //   // Merge and override lastMesh otherwise, to be used for later construction
            //   lastMesh[i] = networkMesh[i];
            break;
          default:
            this.set(i, item);
            throw new Error('UNTYPED_MESH', 'Mesh is not typed properly ' + i + ' ' + descriptor[i] + ' ' + item);
        }
      }, this);
    };

    if (initialMesh)
      this.fromObject(initialMesh);
  };

});

*/

/**
 * User activity controller that dispatch changes (blur, idle, active).
 *
 * @file
 * @summary User activity helper.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/controllers/idle.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */

/*jshint browser:true*/
jsBoot.use('jsBoot.types.EventDispatcher');
jsBoot.add(500).as('idleTime');
jsBoot.add(5000).as('staleTime');
jsBoot.pack('jsBoot.controllers', function(api) {
  'use strict';

  var STATE_CHANGED = 'STATE_CHANGED';
  var ACTIVE = 'ACTIVE';
  var IDLE = 'IDLE';
  var BLURRED = 'BLURRED';

  var UserActivityController = function() {
    // We are an event dispatcher
    api.EventDispatcher.apply(this);

    var idleInterval;
    var lastActive = Date.now();
    var lastState = IDLE;
    var staled = false;

    Object.defineProperty(this, 'status', {
      get: function() {
        return lastState;
      }
    });

    Object.defineProperty(this, 'staled', {
      get: function() {
        return staled;
      }
    });

    var checkState = (function() {
      if (lastState == ACTIVE) {
        if ((Date.now() - lastActive) > api.idleTime) {
          lastState = IDLE;
          this.dispatchEvent(STATE_CHANGED);
        }
      }else if (!staled) {
        if ((Date.now() - lastActive) > api.staleTime) {
          staled = true;
          this.dispatchEvent(STATE_CHANGED);
        }
      }
    }.bind(this));

    var isActive = (function(e) {
      if (lastState == BLURRED)
        return;
      lastActive = Date.now();
      if (lastState == IDLE) {
        lastState = ACTIVE;
        staled = false;
        this.dispatchEvent(STATE_CHANGED);
      }
    }.bind(this));

    var isBlur = (function() {
      lastState = BLURRED;
      this.dispatchEvent(STATE_CHANGED);
    }.bind(this));

    var isFocus = (function() {
      lastActive = Date.now();
      lastState = ACTIVE;
      staled = false;
      this.dispatchEvent(STATE_CHANGED);
    }.bind(this));

    this.boot = function(time, staleTime) {
      // Allow override of the default time
      if (time)
        api.idleTime = time * 1000;
      if (staleTime)
        api.staleTime = staleTime * 1000;
      // Idling support
      document.addEventListener('mousemove', isActive, true);
      document.addEventListener('click', isActive, true);
      document.addEventListener('dblclick', isActive, true);
      window.addEventListener('keypress', isActive, true);
      window.addEventListener('blur', isBlur, true);
      window.addEventListener('focus', isFocus, true);

      idleInterval = setInterval(checkState, api.idleTime / 2);
    };

    this.shutdown = function() {
      // Kill all refs to listeners
      this.destroy();
      clearInterval(idleInterval);
      // Idling support
      document.removeEventListener('mousemove', isActive, true);
      document.removeEventListener('click', isActive, true);
      document.removeEventListener('dblclick', isActive, true);
      window.removeEventListener('keypress', isActive, true);
      window.removeEventListener('blur', isBlur, true);
      window.removeEventListener('focus', isFocus, true);
    };
  };

  UserActivityController.prototype = Object.create(api.EventDispatcher.prototype, {
    STATE_CHANGED: {value: STATE_CHANGED, writable: false, enumerable: true},
    ACTIVE: {value: ACTIVE, writable: false, enumerable: true},
    IDLE: {value: IDLE, writable: false, enumerable: true},
    BLURRED: {value: BLURRED, writable: false, enumerable: true}
  });

  this.userActivity = new UserActivityController();
});

/**
 * Single app helper.
 *
 * @file
 * @summary Single app helper.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/controllers/singleapp.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */

/*jshint browser:true*/
jsBoot.add(window.localStorage).as('localStorage');
jsBoot.add(window.sessionStorage).as('sessionStorage');
// Lifetime of a (stale) lock, before aquiring
jsBoot.add(1000).as('lifeLength');

jsBoot.use('jsBoot.types.EventDispatcher');
jsBoot.use('jsBoot.core.Error');

jsBoot.pack('jsBoot.controllers', function(api) {
  'use strict';

  // Trivial low level helpers
  var getId = function(name) {
    var id;
    // No session storage means we won't persist over reloads
    if (api.sessionStorage)
      id = api.sessionStorage.getItem('_jsbootsingleapp_' + name + '_instanceId');
    if (!id) {
      id = Date.now() + '-' + Math.random(1000);
      if (api.sessionStorage)
        api.sessionStorage.setItem('_jsbootsingleapp_' + name + '_instanceId', id);
    }
    return id;
  };

  var read = function(name) {
    return (api.localStorage.getItem('_jsbootsingleapp_' + name + '_lockname') || '').split('_');
  };

  var write = function(name, d) {
    api.localStorage.setItem('_jsbootsingleapp_' + name + '_lockname', d);
  };

  var kill = function(name) {
    api.localStorage.removeItem('_jsbootsingleapp_' + name + '_lockname');
  };

  var lockOwner;
  var isOwned = false;
  var saidFail = false;

  var ticker = function(appKey, instanceId, success, failure) {
    // Decide whether to acquire lock or not
    var currentOwner = read(appKey);
    // The lock is already there. Is it ours? Is it still valid?
    if ((currentOwner.pop() != instanceId) && ((Date.now() - currentOwner.shift()) < api.lifeLength)) {
      // If we previously owned it, or haven't spoken yet, scream!!!
      if (isOwned || !saidFail) {
        isOwned = false;
        saidFail = true;
        failure();
      }
      return;
    }

    // Otherwise, confirm / acquire lock
    if (!isOwned) {
      isOwned = true;
      saidFail = false;
      success();
    }
    // We do this after in order to resist porn mode conditions making the setItem call fail
    write(appKey, Date.now() + '_' + instanceId);
  };

  var free = function(appKey, instanceId) {
    // Clear timeout
    if (lockOwner) {
      window.clearInterval(lockOwner);
      lockOwner = undefined;
    }
    // Clean the lock if we own it
    if (read(appKey).pop() == instanceId)
      kill(appKey);
    // Reset
    isOwned = false;
    saidFail = false;
  };

  var own = function(key, id, ticktime, success, failure) {
    lockOwner = window.setInterval(ticker, ticktime, key, id, success, failure);
  };

  var ACQUIRED = 'acquired';
  var WAITING = 'waiting';
  var status;

  var success = function() {
    status = ACQUIRED;
    this.dispatchEvent(this.STATE_CHANGED);
  };

  var failure = function() {
    status = WAITING;
    this.dispatchEvent(this.STATE_CHANGED);
    throw new api.Error('ALREADY_LOCKED',
        'Another instance of the app is already running.', true);
  };

  var SingleApp = function() {
    api.EventDispatcher.apply(this);

    Object.defineProperty(this, 'status', {
      enumerable: true,
      get: function() {
        return status;
      }
    });

    var akey;
    var iid;

    this.boot = function(appKey, length) {
      if (length)
        api.lifeLength = length * 1000;
      status = WAITING;
      akey = appKey;
      iid = getId(akey);
      // Do good measure: cleanup shit if we were there before
      free(akey, iid);
      own(akey, iid, api.lifeLength / 2, success.bind(this), failure.bind(this));
    };

    this.shutdown = function() {
      this.destroy();
      free(akey, iid);
      akey = iid = null;
    };
  };

  SingleApp.prototype = Object.create(api.EventDispatcher.prototype);
  SingleApp.prototype.ACQUIRED = ACQUIRED;
  SingleApp.prototype.WAITING = WAITING;
  SingleApp.prototype.STATE_CHANGED = 'state_changed';

  this.singleApp = new SingleApp();

});


/**
 * Storage backend providing temporary and persistent spaces for both the app and the user.
 * Note that it proceeds by loading/saving entirely the objects.
 * This is a helper for reasonably sized objects, not an indexedDB for heavy manipulation
 * (stressing again: everything is loaded into RAM on boot / login, and saved on shutdown / flush).
 * Once booted, you can manipulate them as regular objects.
 *
 * @file
 * @summary Storage helper.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/utils/storage.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */


// - encrypt private datastore?
// http://bitwiseshiftleft.github.com/sjcl/doc/symbols/sjcl.html
// http://www.matasano.com/articles/javascript-cryptography/


// - compress persistent store?
// - http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip
// - http://rosettacode.org/wiki/LZW_compression
// - http://rumkin.com/tools/compression/compress_huff.php
// - https://github.com/olle/lz77-kit/blob/master/src/main/js/lz77.js

// - use something else?
// http://brian.io/lawnchair/adapters/

// http://dev-test.nemikor.com/web-storage/support-test/

// Idb (XXX to be implemented)

/*jshint browser:true, devel:true*/
var IDB = {
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
  IDBTransaction: window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
  IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
};

jsBoot.add(IDB).as('IDB');

// Optional backends
jsBoot.add(window.openDatabase, true).as('openDatabase');
jsBoot.add(window.localStorage, true).as('localStorage');
// XXX IE8 doesn't support this - "class doesn't support automation" error deep inside gister
// XXX SessionStorage is useful for time limited caching - it's not shared accross tabs
jsBoot.add(window.sessionStorage, true).as('sessionStorage');
jsBoot.add(window.JSON).as('json');

jsBoot.use('jsBoot.core.Error');
jsBoot.pack('jsBoot.utils', function(api) {
  'use strict';
  // XXX see IE8 error from above
  // api.sessionStorage = ('sessionStorage' in window) ? window.sessionStorage : null;

  var userKey;

  this.storage = new (function() {
    /**#@+
     * @memberOf Roxee.gist.dataStore
     */

    /**
     * An accessor to the persistent dataStore.
     * @property
     * @type String
     * @name persistent
     */
    this.persistent = {};

    /**
     * An accessor to the volatile (caching) dataStore.
     * @property
     * @type String
     * @name cache
     */
    this.cache = {};

    /**
     * An accessor to the caching private dataStore.
     * @property
     * @type String
     * @name userCache
     */

    this.userCache = {};

    /**
     * An accessor to the persistent private dataStore.
     * @property
     * @type String
     * @name userPersistent
     */

    this.userPersistent = {};

    // Actual API functions
    this.boot = function(appKey, oncomplete) {
      // Boot storage
      persistentAdapter.init(appKey);
      cacheAdapter.init(appKey);

      var boot = 0;

      var cbk = function(sub, d) {
        Object.keys(d).forEach(function(key) {
          sub[key] = d[key];
        });
        boot++;
        if ((boot > 1) && oncomplete)
          oncomplete();
      };

      persistentAdapter.read(null, cbk.bind(this, this.persistent));
      cacheAdapter.read(null, cbk.bind(this, this.cache));
    };

    this.login = function(uKey, oncomplete) {
      userKey = uKey;

      var boot = 0;

      var cbk = function(sub, d) {
        Object.keys(d).forEach(function(key) {
          sub[key] = d[key];
        });
        boot++;
        if ((boot > 1) && oncomplete)
          oncomplete();
      };

      persistentAdapter.read(userKey, cbk.bind({}, this.userPersistent));
      cacheAdapter.read(userKey, cbk.bind({}, this.userCache));
    };

    this.logout = function(oncomplete) {
      // Write user data
      if (userKey) {

        var boot = 0;

        var cbk = function(sub) {
          Object.keys(sub).forEach(function(key) {
            delete sub[key];
          });
          boot++;
          if ((boot > 1) && oncomplete)
            oncomplete();
        };

        persistentAdapter.write(userKey, this.userPersistent, cbk.bind({}, this.userPersistent));
        cacheAdapter.write(userKey, this.userCache, cbk.bind({}, this.userCache));
        userKey = undefined;
      }else
        setTimeout(oncomplete, 1);
    };

    this.commit = function() {
      if (userKey) {
        persistentAdapter.write(userKey, this.userPersistent);
        cacheAdapter.write(userKey, this.userCache);
      }
      persistentAdapter.write(null, this.persistent);
      cacheAdapter.write(null, this.cache);
    };

    this.shutdown = function(oncomplete) {
      this.logout(function() {
        var boot = 0;

        var cbk = function(sub) {
          Object.keys(sub).forEach(function(key) {
            delete sub[key];
          });
          boot++;
          if ((boot > 1) && oncomplete)
            oncomplete();
        };
        persistentAdapter.write(null, this.persistent, cbk.bind({}, this.persistent));
        cacheAdapter.write(null, this.cache, cbk.bind({}, this.cache));
      }.bind(this));
    };

  })();

  // XXX beware - this is buggy in webkit, and there is no way to be sure write are really commited
  var domAdapter = function(json, store) {
    var prefix;
    return {
      init: function(key) {
        console.info(' [ponyStorage] Using domStorage adapter', store);
        prefix = key;
      },
      read: function(key, callback) {
        key = prefix + '_' + (key || '');
        var ret, err;
        try {
          ret = json.parse(store.getItem(key) || '{}');
          if (!ret)
            throw 'whatever';
        }catch (e) {
          store.removeItem(key);
          ret = {};
          err = new api.Error('DATA_CORRUPTION',
              'Reading into the dataStore failed. This may be indicative of a possible data corruption.');
        }
        setTimeout(callback, 1, ret);
        if (err)
          throw err;
      },

      write: function(key, data, callback) {
        console.warn('jey writte!', key, data, callback);
        key = prefix + '_' + (key || '');
        try {
          store.setItem(key, json.stringify(data));
          if(callback)
            setTimeout(callback, 1, true);
        }catch (e) {
          store.removeItem(key);
          if(callback)
            setTimeout(callback, 1, false);
          throw new api.Error('DATA_CORRUPTION',
              'Writing into the dataStore failed. This may be indicative of a possible data corruption.');
        }

      }
    };
  };


  var sqlAdapter = function(json, dbEngine) {
    var db;
    return {
      init: function(key) {
        console.info(' [ponyStorage] Using openDatabase adapter');
        var shortName = key;
        var version = '1.0.0';
        var displayName = key;
        var maxSize = 65536 * 65536 * 65536;
        db = dbEngine(shortName, version, displayName, maxSize);
        // Ensure the table exists
        this.exec(
            'create table if not exists main (id text(32,0) collate nocase unique primary key, ' +
            'data blob not null on conflict fail);',
            []
        );
      },

      read: function(key, callback) {
        key = key || '';
        this.exec(
            'select * from main where id=?;',
            ['ns_' + key],
            function(r) {
              callback((r.length && json.parse(r.item(0).data)) || {});
            }, function() {
              callback({});
            }
        );
      },

      write: function(key, data, callback) {
        key = key || '';
        data = json.stringify(data);
        this.exec(
            'insert or replace into main (id, data) VALUES ( ?, ? );',
            ['ns_' + key, data],
            callback
        );
      },

      /*
      dump: function(){
        this.exec('select * from main;', null, function(r){
          for(var x = 0; x < r.length; x++)
            console.warn(r.item(x));
        });
      },
  */

      exec: function(query, params, onsuccess, onerror) {
        db.transaction(
            function(transaction) {
              transaction.executeSql(query, params || [], function(transaction, results) {
                if (onsuccess)
                  onsuccess(results.rows);
              }, function(tr, err) {
                console.error(' [ponyStorage] transaction failure', tr, err, query, params);
                if (onerror)
                  onerror(err);
                throw new api.Error('DATA_CORRUPTION', 'Failed executing query');
              });
            }
        );
      }
    };
  };

  var bogusAdapter = function() {
    return {
      init: function() {
        console.warn(' [ponyStorage] Using bogus adapter!');
      },
      read: function() {return {};},
      write: function() {}
    };
  };

  /*
  var idbAdapter = function(n) {
    var indexedDB = n.indexedDB;
    var IDBTransaction = n.IDBTransaction;
    var IDBKeyRange = n.IDBKeyRange;

    var db;
    return {
      init: function(key) {
        var request = indexedDB.open(key, 1);
        request.onerror = function(e) {
          console.error(' [ponyStorage] idb request failure', e);
        };
        request.onsuccess = function() {
          db = request.result;
        };
      }
    };
  };
  */

  var persistentAdapter;
  var cacheAdapter;
  /*if(api.IDB.indexedDB){
    persistentAdapter = idbAdapter(api.IDB);
  }else*/ if (api.openDatabase)
    persistentAdapter = sqlAdapter(api.json, api.openDatabase);
  else if (api.localStorage)
    persistentAdapter = domAdapter(api.json, api.localStorage);
  else
    persistentAdapter = bogusAdapter();

  if (api.sessionStorage)
    cacheAdapter = domAdapter(api.json, api.sessionStorage);
  else if (api.localStorage)
    cacheAdapter = domAdapter(api.json, api.localStorage);
  else
    persistentAdapter = bogusAdapter();

});
// (type == CACHE) ? api.sessionStorage : api.localStorage;



// Roxee.gister.use('Roxee.gist.types.utils').as('utils');
// Roxee.gister.use('Roxee.gist.types.EventDispatcher').as('dispatcher');
// Roxee.gister.use('Roxee.gist.types.Mutable').as('mutable');
// Roxee.gister.use('Roxee.gist.types.Lock').as('lockType');


// (function(_root_, err, lifecycle, loc, ses, delay, lifetime) {
// XXX: todo
// - have a scheduler write to the datastore regularly to minimize impact of crash?
// XXX have an activity observer, possibly in the lifecycle, with an USER_IDLE event



// this.gist = new (function() {
//   // Try check if the storage is working - if not, scream





/**
     * A method to forcefully save to the datastore
     * @function
     * @name save
     */
/*
    // One application booting, boot ourselves
    lifecycle.addEventListener(lifecycle.BOOT, function() {
      // if(!sanity())
      //   return;
      // Try to get an exclusive access to the storage (not for the runner, though)
      if(!noLocking)
        ownLock();
      // Boot persistent storage
      this.persistent = readPersistent(applicationKey);
      //      say(this.INITIALIZED);
    }, this);

    lifecycle.addEventListener(lifecycle.USER_READY, function(e) {
      // if(!sanity())
      //   return;
      uid = e.details.id;
      this.persistentPrivate = readPersistent(applicationKey + '_' + e.details.id);
    }, this);

    lifecycle.addEventListener(lifecycle.USER_OUT, function(e) {
      // if(!sanity())
      //   return;
      writePersistent(applicationKey + '_' + e.details.id, this.persistentPrivate);
      uid = null;
    }, this);

    // Write shit on shutdown
    lifecycle.addEventListener(lifecycle.SHUTDOWN, function() {
      // if(!sanity())
      //   return;
      this.save();
      if(!noLocking)
        freeLock();
    }, this);


  });
*/

// });


// })(Roxee.core, !!Roxee.runner, Roxee.gist.errors, Roxee.controller.lifecycle, window.localStorage,
// window.sessionStorage, 500, 2000);




//    var cbks = [];

/*    this.NOT_INITIALIZED = 0;
    this.INITIALIZED = 1;
    this.FLUSHED = 2;

    this.status = this.NOT_INITIALIZED;*/
/*

    this.listen = function(ctx, meth) {
      cbks.push({ctx: ctx, meth: meth});
    };

    var say = function(value) {
      this.status = value;
      for (var i = 0; i < cbks.length; i++)
        try {
          cbks[i].meth.apply(cbks[i].ctx);
        }catch (e) {
          // XXX complain in case of error
        }
    };
    */


/*    this.setTemp = function(key, value) {
      try {
        ses.setItem(key, JSON.stringify(value));
      }catch (e) {
        err.newError(err.dataStore.DATA_CORRUPTION, 'Impossible to write data to volatile dataStore.
        Possibly memory limit reached.');
      }
    };

    this.getTemp = function(key) {
      try {
        var t = JSON.parse(ses.getItem(key));
        return t;
      }catch (e) {
        err.newError(err.dataStore.DATA_CORRUPTION, 'Impossible to read the requested data from volatile dataStore
        (' + key + '). Possible data corruption. Removing entry.');
        ses.removeItem(key);
      }
    };*/

/*
    var readTemporary = function(key){
      this.temporary = {};
      for(var x = 0, key; x < ses.length, key = ses.key(x); x++){
        try{
          this.temporary[key] = JSON.parse(ses.getItem(key));
        }catch(e){
          // XXX broadcast error
        }
      }
    };

    var writeTemporary = function(){
      ses.clear();
      for(var i in this.temporary){
        try{
          ses.setItem(i, JSON.stringify(this.temporary[i]));
        }catch(e){
          // XXX broadcast error
        }
      }
    };
    */

// this.store = function(key, object, store){
//   // Get or set something in the temporary store
//   // If storing, mark the object as persistent, and will also store in the local store
// };

// this.retrieve = function(key, store){
//   // Get from the store
// };

// // Flushes all persistent data. NOT to be used with a light heart.
// var destroy = function(){
//   loc.clear();
// };

// // Flushes the session storage
// var flush = function(){
//   ses.clear();
// };



jsBoot.pack('jsBoot.utils', function() {
  /*jshint browser:true*/
  'use strict';

  this.Tween = function(obj, descriptor, steps, duration, easer, oncomplete) {
    var delay = duration * 1000 / steps;
    var current = 0;
    var tout;

    var keys = Object.keys(descriptor);
    keys.forEach(function(key) {
      descriptor[key].range = descriptor[key].end - descriptor[key].start;
      descriptor[key].unit = descriptor[key].unit || '';
    });

    var eacher = function(key) {
      obj[key] = (descriptor[key].start + easer(descriptor[key].range, current, steps)) +
          descriptor[key].unit;
    };

    var stepper = function() {
      current++;
      if (current >= steps) {
        clearInterval(tout);
        oncomplete();
      }
      keys.forEach(eacher);
    };

    tout = setInterval(stepper, delay);
    // tout = setTimeout(stepper, delay);
  };

  this.Tween.EASE_IN = function(range, current, steps) {
    return Math.sqrt(current / steps) * range;
  };

  this.Tween.EASE_OUT = function(range, current, steps) {
    return Math.pow(current / steps, 2) * range;
  };

  this.Tween.LINEAR = function(range, current, steps) {
    return (current / steps) * range;
  };
});

