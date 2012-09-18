(function(root) {
  if (typeof $().hoverIntent == 'undefined')
    console.warn(' [jsBoot.ui]: hoverIntent is not loaded - enhanced hover detection support disabled');
  else
    root.hover = function(selector, opts) {
      return $(selector).hoverIntent(opts);
    };
}).apply(this, [jsBoot.ui]);
