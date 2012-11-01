/**
 * Provides a simple declarative mechanism to get hooked onto exceptions
 *
 * @file
 * @summary Mechanism to catch exceptions.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/core/errorHandler.js{PUKE-GIT-REVISION}
 */

(function() {
  /*global window, console*/
  'use strict';

  var scope = jsBoot.core;


  // Consumer may register an handler instead of the dumb one
  /**
   * Call this declare a callback for exceptions
   * @summary
   * @function
   * @name jsBoot.core.registerErrorHandler
   * @param   {Function} hnd Callback to be notified of exceptions.
   * @returns undefined
   */

  scope.registerErrorHandler = function(hnd) {
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

})();
