jsBoot.pack('jsBoot.ui', function() {
  /*global I18n, console*/
  'use strict';

  if (typeof I18n == 'undefined')
    console.warn(' [jsBoot.ui]: I18n is not loaded - localization support disabled');
  else
    this.I18n = function() {
      return I18n;
    };
});
