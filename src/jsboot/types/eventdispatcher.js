/**
 * @namespace Errors spat by eventDispatchers
 * @name Roxee.gist.errors.eventDispatcher
 */

/**
 * A listener failed during execution.
 * @memberof Roxee.gist.errors.eventDispatcher
 * @property
 * @type {String}
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
