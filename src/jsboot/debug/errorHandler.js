/**
 * Declare a dummy debug default error handler
 */

(function() {
  /*jshint browser:true*/
  /*global console:true, jsBoot:true*/
  'use strict';

  (function() {
    // The default error handler is a stupid logger to console
    var markee = ' ┌∩┐(◣_◢)┌∩┐ ';

    this.registerErrorHandler(function(str, fileName, lineNumber) {
      console.error(markee, markee, markee);
      console.error('File:', fileName);
      console.error('Number:', lineNumber);
      console.error('Date', new Date());
      console.error('Location', location.href);
      console.error('Exception:', str);
      console.error(markee, markee, markee);
      return false;
    });
  }).apply(jsBoot.core);

})();
