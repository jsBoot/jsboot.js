'use strict';

// Verbosity controller
(function(scope) {
  var c = this.console;
  var s = scope.console = {};
  var e = {
    'DEBUG': 1,
    'LOG': 2,
    'INFO': 4,
    'WARN': 8,
    'ERROR': 16,
    'TRACE': 32,
    'ALL': 63
  };

  // console.time('start');
  for (var i in e) {
    s[i] = e[i];
    (function() {
      var meth = c[i.toLowerCase()];
      var level = s[i];
      c[i.toLowerCase()] = function() {
        if (s.VERBOSITY & level) {
          // var args = Array.prototype.slice(arguments);
          // args.push(Date.now());
          // console.timeEnd('start');
          // console.timeEnd('previous');
          // console.time('previous');
          // Might very well crash IE bitch
          try {
            meth.apply(c, arguments);
          }catch (e) {
            for (var i in arguments)
              meth(arguments[i]);
          }
        }
      };
    })();
  }
  s.VERBOSITY = s.INFO | s.WARN | s.ERROR | s.LOG | s.DEBUG | s.TRACE;
}).apply(this, [jsBoot.debug]);
