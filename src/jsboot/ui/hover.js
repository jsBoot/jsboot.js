(function() {
  /*global $, console*/
  'use strict';

  (function() {
    if (typeof $().hoverIntent == 'undefined')
      console.warn(' [jsBoot.ui]: hoverIntent is not loaded - enhanced hover detection support disabled');
    else
      this.hover = function(selector, opts) {
        return $(selector).hoverIntent(opts);
      };
  }).apply(jsBoot.ui);

})();
