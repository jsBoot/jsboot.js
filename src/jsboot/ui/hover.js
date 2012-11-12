jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().hoverIntent == 'undefined')
    console.warn(' [jsBoot.ui]: hoverIntent is not loaded - enhanced hover detection support disabled');
  else
    this.hover = function(selector, opts) {
      return $(selector).hoverIntent(opts);
    };
});
