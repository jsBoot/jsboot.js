(function(root) {
  if (typeof moment == 'undefined')
    console.warn(' [jsBoot.ui]: moment is not loaded - date manipulation library not available');
  else
    root.date = moment;
}).apply(this, [jsBoot.ui]);
