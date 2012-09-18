(function(root) {
  if (typeof $().validate == 'undefined')
    console.warn(' [jsBoot.ui]: Validate is not loaded - form validation support disabled');
  else
    root.validate = function(selector, opts) {
      return $(selector).validate(opts);
    };
}).apply(this, [jsBoot.ui]);

// http://docs.jquery.com/Plugins/Validation#API_Documentation
// https://github.com/jzaefferer/jquery-validation
