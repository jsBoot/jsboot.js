// http://brad.is/coding/BigScreen/

(function(root) {
  if (typeof BigScreen == 'undefined')
    console.warn(' [jsBoot.ui]: Bigscreen is not loaded - portable fullscreen support disabled');
  else
    root.fullscreen = BigScreen;
}).apply(this, [jsBoot.ui]);
