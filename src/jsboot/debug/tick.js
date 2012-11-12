/**
 * @file
 * @summary Debug core providing a tick method for perf measurements
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/debug/tick.js{PUKE-GIT-REVISION}
 */

jsBoot.pack('jsBoot.debug', function() {
  /*global console*/
  'use strict';

  var started = false;
  this.tick = function(message, end) {
    console.info(' [jsBoot.debug.tick]', message);
    if (started) {
      console.timeEnd('Time since last tick');
    }else {
      started = console.time('Total time') || true;
    }
    console.time('Time since last tick');
    if (end) {
      started = false;
      console.info(' [jsBoot.debug.tick]', 'Ending measurement! Total boot time:');
      console.timeEnd('Total time');
    }
  };

  this.tick('Debug module fully loaded. Starting time measurement');

});
