(function() {
  /*global jsBoot:true*/
  'use strict';

  var scope = jsBoot.debug;
  // Verbosity controller
  scope.console = {};
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
  scope.console.VERBOSITY = scope.console.INFO | scope.console.WARN | scope.console.ERROR | scope.console.LOG |
      scope.console.DEBUG | scope.console.TRACE;

}).apply(this);
