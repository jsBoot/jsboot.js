/**
 * @file
 * @summary Provides a way to filter out console verbosity.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/debug/console.js{PUKE-GIT-REVISION}
 */

/*jshint devel:true*/
jsBoot.add(console).as('nativeConsole');
jsBoot.pack('jsBoot.debug', function(api) {
  'use strict';

  // Verbosity controller
  var e = {
    'DEBUG': 1,
    'LOG': 2,
    'INFO': 4,
    'WARN': 8,
    'ERROR': 16,
    'TRACE': 32,
    'ALL': 63
  };

  this.console = {
    VERBOSITY: e.ALL
  };

  // console.time('start');
  Object.keys(e).forEach(function(i) {
    var level = this.console[i] = e[i];
    var nativeMeth = api.nativeConsole[i.toLowerCase()];
    api.nativeConsole[i.toLowerCase()] = (function() {
      if (this.console.VERBOSITY & level) {
        // var args = Array.prototype.slice(arguments);
        // args.push(Date.now());
        // console.timeEnd('start');
        // console.timeEnd('previous');
        // console.time('previous');
        // Might very well crash IE bitch
        try {
          nativeMeth.apply(api.nativeConsole, arguments);
        }catch (e) {
          Array.prototype.slice(arguments).forEach(function(arg) {
            nativeMeth.apply(api.nativeConsole, [arg]);
          });
        }
      }
    }.bind(this));
  }, this);

});
