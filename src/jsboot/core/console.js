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
