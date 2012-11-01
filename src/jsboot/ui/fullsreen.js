(function() {
  /*global BigScreen, console*/
  'use strict';

  // http://brad.is/coding/BigScreen/

  (function() {
    if (typeof BigScreen == 'undefined')
      console.warn(' [jsBoot.ui]: Bigscreen is not loaded - portable fullscreen support disabled');
    else
      this.fullscreen = BigScreen;
  }).apply(jsBoot.ui);

})();
