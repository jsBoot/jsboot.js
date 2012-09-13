'use strict';

(function(scope) {
  var err = this.Error;
  scope.Error = function(name, message) {
    if ((this == window) || (this == undefined)) {
      console.warn('Google, please fix you shit. Error is a constructor damnit!', arguments);
      return;
    }
    err.apply(this, [message]);
    this.name = name;
    if (!('stack' in this))
      this.stack = ('printStackTrace' in this) ? this.printStackTrace() : [];
  };

  for (var i in this.Error.prototype)
    scope.Error.prototype[i] = this.Error.prototype[i];


  var errs = ['NOT_IMPLEMENTED', 'UNSPECIFIED', 'NOT_INITIALIZED', 'WRONG_ARGUMENTS',
    'UNSUPPORTED', 'NATURAL_BORN_CRASH'];

  errs.forEach(function(item, idx){
    scope.Error[item] = scope.Error.prototype[item] = idx;
  });

  scope.Error.prototype.toString = function() {
    return this.name + ': ' + this.message + '\nStack: ' +
        ((typeof this.stack == 'array') ? this.stack.join('\n') : this.stack);
  };

}).apply(this, [jsBoot.core]);


/**
 * Just in case you are too lazy to define errors yourself, use this hodge pot here... NOT recommended.
 * @memberOf Roxee.gist.errors
 * @property
 * @static
 * @constant
 * @name UNSPECIFIED
 */


/**
 * Use this in a method that explicitely wants to say implementation is missing (in a virtual for eg.)
 * @memberOf Roxee.gist.errors
 * @property
 * @static
 * @constant
 * @name NOT_IMPLEMENTED
 */


/**
 * Meant to say that something has not been properly inited before being used
 * @memberOf Roxee.gist.errors
 * @property
 * @static
 * @constant
 * @name NOT_INITIALIZED
 */


/**
 * Use this if you do validate arguments, and what's passed doesn't cut it
 * @memberOf Roxee.gist.errors
 * @property
 * @static
 * @constant
 * @name WRONG_ARGUMENTS
 */



/**
 * Use this in factories for example, where the arguments ask for something that's not doable.
 * @memberOf Roxee.gist.errors
 * @property
 * @static
 * @constant
 * @name UNSUPPORTED
 */



/**
 * Interecepted throw that gets respoofed into the list.
 * This is fatal.
 * @memberOf Roxee.gist.errors
 * @property
 * @static
 * @constant
 * @name NATURAL_BORN_CRASH
 */
