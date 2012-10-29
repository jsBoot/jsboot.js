(function() {
  /*global jsBoot:true,$:true,console:true*/
  'use strict';


  (function() {
    if (typeof $().validate == 'undefined')
      console.warn(' [jsBoot.ui]: Validate is not loaded - form validation support disabled');
    else
      this.validate = function(selector, opts) {
        return $(selector).validate(opts);
      };
  }).apply(jsBoot.ui);

})();
// http://docs.jquery.com/Plugins/Validation#API_Documentation
// https://github.com/jzaefferer/jquery-validation
