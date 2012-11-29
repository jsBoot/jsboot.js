jsBoot.pack('jsBoot.ui', function() {
  /*global KeyboardJS, Mousetrap, console*/
  'use strict';

  if (typeof KeyboardJS == 'undefined')
    console.warn(' [jsBoot.ui]: KeyboardJS is not loaded - keyboard support disabled - will try MouseTrap');
  else
    this.keyboard = KeyboardJS;

  if (typeof Mousetrap == 'undefined')
    console.warn(' [jsBoot.ui]: Mousetrap is not loaded - keyboard support disabled');
  else
    this.keyboard = Mousetrap;
});
