// http://brad.is/coding/BigScreen/

(function(root) {
  if (typeof History == 'undefined')
    console.warn(' [jsBoot.ui]: History is not loaded - portable history support disabled');
  else
    root.history = History;
}).apply(this, [jsBoot.ui]);
