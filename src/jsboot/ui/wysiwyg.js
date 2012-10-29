(function() {
  /*global jsBoot:true,$:true,console:true*/
  'use strict';


  (function() {
    if (typeof $().redactor == 'undefined')
      console.warn(' [jsBoot.ui]: Redactor is not loaded - wysiwyg support disabled');
    else
      this.wysiwyg = function(selector, opts) {
        return $(selector).redactor(opts);
      };
  }).apply(jsBoot.ui);

})();
