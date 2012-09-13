'use strict';

(function(scope) {
  // Consumer may register an handler instead of the dumb one
  scope.registerErrorHandler = function(hnd) {
    handlers.push(hnd);
  };

  var handlers = [];
  if (this.onerror)
    handlers.push(this.onerror);

  // Dull private helper
  var err = function(message, ex) {
    console.error(' [jsBoot.core.errorHandler]', message, ex);
  };

  // Register as error handler
  this.onerror = function() {
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
}).apply(this, [jsBoot.core]);
