'use strict';

(function(scope) {
  var started = false;
  scope.debug = new (function() {
    this.tick = function(mess, end) {
      console.debug(' [jsBoot.debug.tick]', mess);
      if (started) {
        console.timeEnd('perfDebugPoint');
      }else {
        started = console.time('perfDebugZero') || true;
      }
      console.time('perfDebugPoint');
      if (end) {
        started = false;
        console.warn(' [jsBoot.debug.tick]', 'Ending measurement! Total boot time:');
        console.timeEnd('perfDebugZero');
      }
    };
  })();
}).apply(this, [jsBoot]);

jsBoot.debug.tick('Debug module fully loaded. Starting time measurement');
