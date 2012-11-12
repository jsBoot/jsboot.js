jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().redactor == 'undefined')
    console.warn(' [jsBoot.ui]: Redactor is not loaded - wysiwyg support disabled');
  else
    this.wysiwyg = function(selector, opts) {
      return $(selector).redactor(opts);
    };
});
