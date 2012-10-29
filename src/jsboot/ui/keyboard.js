(function() {
  /*global jsBoot:true,KeyboardJS:true,Mousetrap:true,console:true*/
  'use strict';


  (function() {
    if (typeof KeyboardJS == 'undefined')
      console.info(' [jsBoot.ui]: KeyboardJS is not loaded - keyboard support disabled');
    else
      this.keyboard = KeyboardJS;

    if (typeof Mousetrap == 'undefined')
      console.warn(' [jsBoot.ui]: Mousetrap is not loaded - keyboard support disabled');
    else
      this.keyboard = Mousetrap;
  }).apply(jsBoot.ui);

})();
