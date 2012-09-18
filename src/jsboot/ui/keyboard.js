(function(root) {
  if (typeof KeyboardJS == 'undefined')
    console.info(' [jsBoot.ui]: KeyboardJS is not loaded - keyboard support disabled');
  else
    root.keyboard = KeyboardJS;

  if (typeof Mousetrap == 'undefined')
    console.warn(' [jsBoot.ui]: Mousetrap is not loaded - keyboard support disabled');
  else
    root.keyboard = Mousetrap;
}).apply(this, [jsBoot.ui]);
