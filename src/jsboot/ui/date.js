(function() {
  /*global jsBoot:true,moment:true,console:true*/
  'use strict';

  (function() {
    if (typeof moment == 'undefined')
      console.warn(' [jsBoot.ui]: moment is not loaded - date manipulation library not available');
    else
      this.date = moment;
  }).apply(jsBoot.ui);

})();
