(function() {
  /*global $, console*/
  'use strict';

  (function() {
    if (typeof $().dataTable == 'undefined')
      console.warn(' [jsBoot.ui]: dataTable is not loaded - enhanced tables support disabled');
    else
      this.table = function(selector, opts) {
        return $(selector).dataTable(opts);
      };
  }).apply(jsBoot.ui);

})();
