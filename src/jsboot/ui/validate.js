(function(root) {
  root.chosen = function(selector, opts) {
    return $(selector).validate(opts);
  };
}).apply(this, [jsBoot.ui]);

// http://docs.jquery.com/Plugins/Validation#API_Documentation
// https://github.com/jzaefferer/jquery-validation
