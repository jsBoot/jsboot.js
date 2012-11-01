/**
 * @file
 * @summary Useful to prevent a badly behaved prod application from pissing its guts out.
 * Otherwise, you really shouldn't have console calls in your code...
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/core/errorHandler.js{PUKE-GIT-REVISION}
 */

(function() {
  /*global console*/
  'use strict';

  var scope = jsBoot.core;

  var nativeConsole = console;
  var fakeConsole = {
    debug: function() {},
    log: function() {},
    info: function() {},
    trace: function() {},
    warn: console.warn,
    error: console.error
  };

  scope.toggleConsole = function(on) {
    var mesh = on ? nativeConsole : fakeConsole;
    Object.getOwnPropertyNames(mesh).forEach(function(i) {
      console[i] = mesh[i];
    });
  };
})();
