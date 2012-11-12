jsBoot.pack('jsBoot.ui', function() {
  /*global History, console*/
  'use strict';

  // http://brad.is/coding/BigScreen/

  if (typeof History == 'undefined')
    console.warn(' [jsBoot.ui]: History is not loaded - portable history support disabled');
  else
    this.history = History;
});
