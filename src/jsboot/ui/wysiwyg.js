(function(root) {
  if (typeof $().redactor == 'undefined')
    console.warn(' [jsBoot.ui]: Redactor is not loaded - wysiwyg support disabled');
  else
    root.wysiwyg = function(selector, opts) {
      return $(selector).redactor(opts);
    };
}).apply(this, [jsBoot.ui]);

