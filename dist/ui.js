jsBoot.pack('jsBoot.ui', function() {
  /*global moment, console*/
  'use strict';

  if (typeof moment == 'undefined')
    console.warn(' [jsBoot.ui]: moment is not loaded - date manipulation library not available');
  else
    this.date = moment;

});

jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().uniform == 'undefined')
    console.warn(' [jsBoot.ui]: uniform is not loaded - stylable forms support disabled');
  else
    this.forms = function(selector, opts) {
      return $(selector).uniform(opts);
    };
});

jsBoot.pack('jsBoot.ui', function() {
  /*global BigScreen, console*/
  'use strict';

  // http://brad.is/coding/BigScreen/

  if (typeof BigScreen == 'undefined')
    console.warn(' [jsBoot.ui]: Bigscreen is not loaded - portable fullscreen support disabled');
  else
    this.fullscreen = BigScreen;
});

jsBoot.pack('jsBoot.ui', function() {
  /*global History, console*/
  'use strict';

  // http://brad.is/coding/BigScreen/

  if (typeof History == 'undefined')
    console.warn(' [jsBoot.ui]: History is not loaded - portable history support disabled');
  else
    this.history = History;
});

jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().hoverIntent == 'undefined')
    console.warn(' [jsBoot.ui]: hoverIntent is not loaded - enhanced hover detection support disabled');
  else
    this.hover = function(selector, opts) {
      return $(selector).hoverIntent(opts);
    };
});

jsBoot.pack('jsBoot.ui', function() {
  /*global I18n, console*/
  'use strict';

  if (typeof I18n == 'undefined')
    console.warn(' [jsBoot.ui]: I18n is not loaded - localization support disabled');
  else
    this.I18n = function() {
      return I18n;
    };
});

jsBoot.pack('jsBoot.ui', function() {
  /*global KeyboardJS, Mousetrap, console*/
  'use strict';

  if (typeof KeyboardJS == 'undefined')
    console.warn(' [jsBoot.ui]: KeyboardJS is not loaded - keyboard support disabled - will try MouseTrap');
  else
    this.keyboard = KeyboardJS;

  if (typeof Mousetrap == 'undefined')
    console.warn(' [jsBoot.ui]: Mousetrap is not loaded - keyboard support disabled');
  else
    this.keyboard = Mousetrap;
});

jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $.gritter == 'undefined')
    console.warn(' [jsBoot.ui]: Gritter is not loaded - growl like notifications support disabled');
  else
    this.notify = function() {
      return $.gritter;
    };
});

/*

$.gritter.add({
  // (string | mandatory) the heading of the notification
  title: 'This is a notice!',
  // (string | mandatory) the text inside the notification
  text: 'This will fade out after a certain amount of time.'
});
Adding a more complex notification

$.gritter.add({
  // (string | mandatory) the heading of the notification
  title: 'This is a regular notice!',
  // (string | mandatory) the text inside the notification
  text: 'This will fade out after a certain amount of time.',
  // (string | optional) the image to display on the left
  image: 'http://a0.twimg.com/profile_images/59268975/jquery_avatar_bigger.png',
  // (bool | optional) if you want it to fade out on its own or just sit there
  sticky: false,
  // (int | optional) the time you want it to be alive for before fading out (milliseconds)
  time: 8000,
  // (string | optional) the class name you want to apply directly to the notification for
  custom styling
  class_name: 'my-class',
        // (function | optional) function called before it opens
  before_open: function(){
    alert('I am a sticky called before it opens');
  },
  // (function | optional) function called after it opens
  after_open: function(e){
    alert("I am a sticky called after it opens: \nI am passed the jQuery object for the created
    Gritter element...\n" + e);
  },
  // (function | optional) function called before it closes
  before_close: function(e, manual_close){
                // the manual_close param determined if they closed it by clicking the "x"
    alert("I am a sticky called before it closes: I am passed the jQuery object for the Gritter
    element... \n" + e);
  },
  // (function | optional) function called after it closes
  after_close: function(){
    alert('I am a sticky called after it closes');
  }
});
If you wanted to use the “sticky: true” option but still be able to delete it later, you can
create a variable that will hold a unique identifier.

var unique_id = $.gritter.add({
  // (string | mandatory) the heading of the notification
  title: 'This is a sticky notice!',
  // (string | mandatory) the text inside the notification
  text: 'This will not go away until the user has hit the (x) button because sticky has been
  set to true.',
  // (string | optional) the image to display on the left
  image: 'http://a0.twimg.com/profile_images/59268975/jquery_avatar_bigger.png',
  // (bool | optional) if you want it to fade out on its own or just sit there
  sticky: true
});
Now to delete that specific notification you can call:

$.gritter.remove(unique_id, {
  fade: true, // optional
  speed: 'fast' // optional
});
To remove all Gritter notifications you can call:

$.gritter.removeAll();
As well as

$.gritter.removeAll({
        before_close: function(e){
    alert("I am called before all notifications are closed.  I am passed the jQuery object
    containing all  of Gritter notifications.\n" + e);
  },
  after_close: function(){
    alert('I am called after everything has been closed.');
  }
});
If you want you can setup global defaults (optional)

Setting up global defaults is handy if you don’t want to specify a ‘time’ attribute for each
$.gritter.add call.

$.extend($.gritter.options, {
        position: 'bottom-left', // defaults to 'top-right' but can be 'bottom-left',
        'bottom-right', 'top-left', 'top-right' (added in 1.7.1)
  fade_in_speed: 'medium', // how fast notifications fade in (string or int)
  fade_out_speed: 2000, // how fast the notices fade out
  time: 6000 // hang on the screen for...
});


*/

jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  // XXX build that with the chosen plugin
  // http://harvesthq.github.com/chosen/

  if (typeof $().chosen == 'undefined')
    console.warn(' [jsBoot.ui]: Chosen is not loaded - enhanced form selects support disabled');
  else
    this.select = function(selector, opts) {
      return $(selector).chosen(opts);
    };
});
/*
$(".chzn-select").chosen({
    no_results_text: "No results matched",
    allow_single_deselect: true
  });


$("#form_field").chosen().change(function(){
});

<select data-placeholder="Choose a country..." style="width:350px;" multiple class="chzn-select">
Note: on single selects, the first element is assumed to be selected by the browser.
To take advantage of the default text support, you will need to include a blank option as the
first element of your select list.


*/

jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().dataTable == 'undefined')
    console.warn(' [jsBoot.ui]: dataTable is not loaded - enhanced tables support disabled');
  else
    this.table = function(selector, opts) {
      return $(selector).dataTable(opts);
    };
});

jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().validate == 'undefined')
    console.warn(' [jsBoot.ui]: Validate is not loaded - form validation support disabled');
  else
    this.validate = function(selector, opts) {
      return $(selector).validate(opts);
    };
});
// http://docs.jquery.com/Plugins/Validation#API_Documentation
// https://github.com/jzaefferer/jquery-validation

jsBoot.pack('jsBoot.ui', function() {
  /*global Raphael, console*/
  'use strict';

  if (typeof Raphael == 'undefined')
    console.warn(' [jsBoot.ui]: Raphael is not loaded - nicy graphs support disabled');
  else
    this.Vector = function() {
      return Raphael;
    };
});

jsBoot.pack('jsBoot.ui', function() {
  /*global $, console*/
  'use strict';

  if (typeof $().redactor == 'undefined')
    console.warn(' [jsBoot.ui]: Redactor is not loaded - wysiwyg support disabled');
  else
    this.wysiwyg = function(selector, opts) {
      return $(selector).redactor(opts);
    };
});

