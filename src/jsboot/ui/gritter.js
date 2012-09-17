
(function(root) {
  root.gritter = function() {
    return $.gritter;
  };
}).apply(this, [jsBoot.ui]);


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
