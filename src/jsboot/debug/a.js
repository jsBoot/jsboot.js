'use strict';

(function(scope) {
  var started = false;
  scope.debug = new (function() {
    this.tick = function(mess, end) {
      console.debug(' [jsBoot.debug.tick]', mess);
      if (started) {
        console.timeEnd('Time since last tick');
      }else {
        started = console.time('Total time') || true;
      }
      console.time('Time since last tick');
      if (end) {
        started = false;
        console.debug(' [jsBoot.debug.tick]', 'Ending measurement! Total boot time:');
        console.timeEnd('Total time');
      }
    };
  })();
}).apply(this, [jsBoot]);

jsBoot.debug.tick('Debug module fully loaded. Starting time measurement');