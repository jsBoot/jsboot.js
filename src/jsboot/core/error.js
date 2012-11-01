/**
 * The overloaded Error object has an additional (array) member "stack".
 * If there is a printStackTrace method available in the scope at the moment the Error is built,
 * it will evalute that method - [] otherwise.
 *
 * @file
 * @summary An enhanced Error object with stacktrace.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/core/error.js{PUKE-GIT-REVISION}
 * @see  http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 * @see  http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
 */

(function() {
  /*global Error, window, printStackTrace*/
  'use strict';

  var scope = jsBoot.core;

  // Possibly pb related to X-Domain limitation shit
  scope.Error = function(name, message) {
    // Error behavior is strange...
    var b = Error.apply(this, [message]);
    // Not too sure this leads anywhere safe though (google code fux...)
    if ((this == window) || (this === undefined))
      return;
    this.message = b.message;
    this.stack = b.stack;
    this.name = name;
    if (!this.stack)
      this.stack = (typeof 'printStackTrace' != 'undefined') ? printStackTrace() : [];
  };

  Object.getOwnPropertyNames(Error.prototype).forEach(function(i) {
    if (i != 'constructor')
      scope.Error.prototype[i] = Error.prototype[i];
  }, this);

  ['NOT_IMPLEMENTED', 'UNSPECIFIED', 'NOT_INITIALIZED', 'WRONG_ARGUMENTS',
   'UNSUPPORTED', 'NATURAL_BORN_CRASH'].forEach(function(item, idx) {
    scope.Error[item] = scope.Error.prototype[item] = idx;
  });

  scope.Error.prototype.toString = function() {
    return this.name + ': ' + this.message + '\nStack: ' +
        ((typeof this.stack == 'array') ? this.stack.join('\n') : this.stack);
  };

})();

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
