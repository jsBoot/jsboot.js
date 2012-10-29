(function() {
  /*global jsBoot:true*/
  'use strict';

  (function(err) {
    this.ServiceError = function(/*name, message*/) {
      err.apply(this, arguments);
    };

    /*interestingly, switching the forEach and for statement below makes closure crash... */
    ['SERVICE_UNAVAILABLE', 'WRONG_CREDENTIALS', 'INVALID_SIGNATURE', 'BAD_REQUEST',
     'MEANINGLESS_DATA', 'UNAUTHORIZED', 'MISSING', 'SHOULD_NOT_HAPPEN'].forEach(function(item, idx) {
      this.ServiceError[item] = this.ServiceError.prototype[item] = idx;
    }, this);


    Object.keys(err.prototype).forEach(function(i){
      this.ServiceError.prototype[i] = err.prototype[i];
    }, this);

  }).apply(jsBoot.core, [jsBoot.core.Error]);

})();

/**
 * Services are down
 * @name SERVICE_UNAVAILABLE
 */


/**
 * Wrong appkey or wrong login password
 * @name WRONG_CREDENTIALS
 */


/**
 * Signature is not valid
 * @name INVALID_SIGNATURE
 */


/**
 * Request is unacceptable, malformed, whatever (should not happen)
 * @name BAD_REQUEST
 */


/**
 * Sent data can't be handled (should not happen)
 * @name MEANINGLESS_DATA
 */


/**
 * The provided credentials are not allowed to perform the requested action
 * @name UNAUTHORIZED
 */


/**
 * The resource requested can't be found
 * @name MISSING
 */


/**
 * Errrrr, yeah. Right.
 * @name UNSPECIFIED
 */


/**
 * Client is sending crap to the server! check your code Pavel!
 * @name SHOULD_NOT_HAPPEN
 */
