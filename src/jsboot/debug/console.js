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

(function() {
  'use strict';

  var scope = jsBoot.debug;

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

  scope.console = {
    VERBOSITY: e.ALL
  };

  // console.time('start');
  var c = this.console;
  Object.keys(e).forEach(function(i) {
    var level = scope.console[i] = e[i];
    var meth = c[i.toLowerCase()];
    c[i.toLowerCase()] = function() {
      if (scope.console.VERBOSITY & level) {
        // var args = Array.prototype.slice(arguments);
        // args.push(Date.now());
        // console.timeEnd('start');
        // console.timeEnd('previous');
        // console.time('previous');
        // Might very well crash IE bitch
        try {
          meth.apply(c, arguments);
        }catch (e) {
          Array.prototype.slice(arguments).forEach(function(arg) {
            meth.apply(c, [arg]);
          });
        }
      }
    };
  });

}).apply(this);
