/**
 * @file
 * @summary Declare a dummy debug default error handler
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/debug/console.js{PUKE-GIT-REVISION}
 */

(function() {
  /*global console, location*/
  'use strict';

  var core = jsBoot.core;
  // The default error handler is a stupid logger to console
  var markee = ' ┌∩┐(◣_◢)┌∩┐ ';

  core.registerErrorHandler(function(str, fileName, lineNumber) {
    console.error(markee, markee, markee);
    console.warn('File:', fileName);
    console.warn('Number:', lineNumber);
    console.warn('Date', new Date());
    console.warn('Location', location.href);
    console.error('Exception:', str);
    console.error(markee, markee, markee);
    return false;
  });

})();
