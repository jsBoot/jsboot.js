
(function(root) {
  if (typeof $().uniform == 'undefined')
    console.warn(' [jsBoot.ui]: uniform is not loaded - stylable forms support disabled');
  else
    root.forms = function(selector, opts) {
      return $(selector).uniform(opts);
    };
}).apply(this, [jsBoot.ui]);
