(function() {

  /*global jsBoot:true,$:true,console:true*/
  'use strict';

  (function() {
    if (typeof $().uniform == 'undefined')
      console.warn(' [jsBoot.ui]: uniform is not loaded - stylable forms support disabled');
    else
      this.forms = function(selector, opts) {
        return $(selector).uniform(opts);
      };
  }).apply(jsBoot.ui);
})();
