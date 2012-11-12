jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().uniform == 'undefined')
    console.warn(' [jsBoot.ui]: uniform is not loaded - stylable forms support disabled');
  else
    this.forms = function(selector, opts) {
      return $(selector).uniform(opts);
    };
});
