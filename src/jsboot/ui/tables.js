(function(root) {
  if (typeof $().dataTable == 'undefined')
    console.warn(' [jsBoot.ui]: dataTable is not loaded - enhanced tables support disabled');
  else
    root.table = function(selector, opts) {
      return $(selector).dataTable(opts);
    };
}).apply(this, [jsBoot.ui]);
