(function(root) {
  if (typeof I18n == 'undefined')
    console.warn(' [jsBoot.ui]: I18n is not loaded - localization support disabled');
  else
    root.I18n = function() {
      return I18n;
    };
}).apply(this, [jsBoot.ui]);
