/*!
 **************************************************
 * Roxee modifications:
 * - patch opera (from pmxdr)
 * - unjqueryfy
 * - fix stict mode
 **************************************************
 *
 * jQuery postMessage - v0.5 - 9/11/2009
 * http://benalman.com/projects/jquery-postmessage-plugin/
 *
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery postMessage: Cross-domain scripting goodness
//
// *Version: 0.5, Last updated: 9/11/2009*
//
// Project Home - http://benalman.com/projects/jquery-postmessage-plugin/
// GitHub       - http://github.com/cowboy/jquery-postmessage/
// Source       - http://github.com/cowboy/jquery-postmessage/raw/master/jquery.ba-postmessage.js
// (Minified)   - http://github.com/cowboy/jquery-postmessage/raw/master/jquery.ba-postmessage.min.js (0.9kb)
//
// About: License
//
// Copyright (c) 2009 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
//
// About: Examples
//
// This working example, complete with fully commented code, illustrates one
// way in which this plugin can be used.
//
// Iframe resizing - http://benalman.com/code/projects/jquery-postmessage/examples/iframe/
//
// About: Support and Testing
//
// Information about what version or versions of jQuery this plugin has been
// tested with and what browsers it has been tested in.
//
// jQuery Versions - 1.3.2
// Browsers Tested - Internet Explorer 6-8, Firefox 3, Safari 3-4, Chrome, Opera 9.
//
// About: Release History
//
// 0.5 - (9/11/2009) Improved cache-busting
// 0.4 - (8/25/2009) Initial release

(function() {
  /*jshint browser:true, devel:true*/
  'use strict';
  '$:nomunge'; // Used by YUI compressor.

  var $ = window.simplePostMessage = {};
  // A few vars used in non-awesome browsers.
  var intervalId,
      lastHash,
      cacheBust = 1,

      // A var used in awesome browsers.
      rmCallback,

      // A few convenient shortcuts.
      // XXX breaks in strict mode - not useful in our case - pruning
      // window = this,
      FALSE = !1,

      // Reused internal strings.
      postMessage = 'postMessage',
      addEventListener = 'addEventListener',

      pReceiveMessage,

      // XXXdmp see below
      // I couldn't get window.postMessage to actually work in Opera 9.64!
      hasPostMessage = window[postMessage];// && !$.browser.opera;

  // XXXdmp Opera 9.x MessageEvent.origin fix (only for http:, not https:)
  if (typeof window.opera != 'undefined' && parseInt(window.opera.version(), 10) == 9) {
    /*jshint camelcase:false*/
    /*global Event*/
    Event.prototype.__defineGetter__('origin', function() {
      return 'http://' + this.domain;
    });
  }

  // Method: jQuery.postMessage
  //
  // This method will call window.postMessage if available, setting the
  // targetOrigin parameter to the base of the targetUrl parameter for maximum
  // security in browsers that support it. If window.postMessage is not available,
  // the target window's location.hash will be used to pass the message. If an
  // object is passed as the message param, it will be serialized into a string
  // using the jQuery.param method.
  //
  // Usage:
  //
  // > jQuery.postMessage( message, targetUrl [, target ] );
  //
  // Arguments:
  //
  //  message - (String) A message to be passed to the other frame.
  //  message - (Object) An object to be serialized into a params string, using
  //    the jQuery.param method.
  //  targetUrl - (String) The URL of the other frame this window is
  //    attempting to communicate with. This must be the exact URL (including
  //    any query string) of the other window for this script to work in
  //    browsers that don't support window.postMessage.
  //  target - (Object) A reference to the other frame this window is
  //    attempting to communicate with. If omitted, defaults to `parent`.
  //
  // Returns:
  //
  //  Nothing.

  $[postMessage] = function(message, targetUrl, target) {
    /*jshint regexp:false*/
    if (!targetUrl) { return; }

    // Default to parent if unspecified.
    target = target || parent;

    if (hasPostMessage) {
      // The browser supports window.postMessage, so call it with a targetOrigin
      // set appropriately, based on the targetUrl parameter.
      console.warn('SENNNNNNDINNNNNG', message);
      target[postMessage](message, targetUrl.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));

    } else if (targetUrl) {
      // Serialize the message if not a string. Note that this is the only real
      // jQuery dependency for this script. If removed, this script could be
      // written as very basic JavaScript.
      message = typeof message === 'string' ? encodeURIComponent(message) : encodeURIComponent(JSON.stringify(message));
      // The browser does not support window.postMessage, so set the location
      // of the target to targetUrl#message. A bit ugly, but it works! A cache
      // bust parameter is added to ensure that repeat messages trigger the
      // callback.
      target.location = targetUrl.replace(/#.*$/, '') + '#' + (+new Date()) + (cacheBust++) + '&' + message;
    }
  };

  // Method: jQuery.receiveMessage
  //
  // Register a single callback for either a window.postMessage call, if
  // supported, or if unsupported, for any change in the current window
  // location.hash. If window.postMessage is supported and sourceOrigin is
  // specified, the source window will be checked against this for maximum
  // security. If window.postMessage is unsupported, a polling loop will be
  // started to watch for changes to the location.hash.
  //
  // Note that for simplicity's sake, only a single callback can be registered
  // at one time. Passing no params will unbind this event (or stop the polling
  // loop), and calling this method a second time with another callback will
  // unbind the event (or stop the polling loop) first, before binding the new
  // callback.
  //
  // Also note that if window.postMessage is available, the optional
  // sourceOrigin param will be used to test the event.origin property. From
  // the MDC window.postMessage docs: This string is the concatenation of the
  // protocol and "://", the host name if one exists, and ":" followed by a port
  // number if a port is present and differs from the default port for the given
  // protocol. Examples of typical origins are https://example.org (implying
  // port 443), http://example.net (implying port 80), and http://example.com:8080.
  //
  // Usage:
  //
  // > jQuery.receiveMessage( callback [, sourceOrigin ] [, delay ] );
  //
  // Arguments:
  //
  //  callback - (Function) This callback will execute whenever a <jQuery.postMessage>
  //    message is received, provided the sourceOrigin matches. If callback is
  //    omitted, any existing receiveMessage event bind or polling loop will be
  //    canceled.
  //  sourceOrigin - (String) If window.postMessage is available and this value
  //    is not equal to the event.origin property, the callback will not be
  //    called.
  //  sourceOrigin - (Function) If window.postMessage is available and this
  //    function returns false when passed the event.origin property, the
  //    callback will not be called.
  //  delay - (Number) An optional zero-or-greater delay in milliseconds at
  //    which the polling loop will execute (for browser that don't support
  //    window.postMessage). If omitted, defaults to 100.
  //
  // Returns:
  //
  //  Nothing!

  $.receiveMessage = pReceiveMessage = function(callback, sourceOrigin, delay) {
    if (hasPostMessage) {
      // Since the browser supports window.postMessage, the callback will be
      // bound to the actual event associated with window.postMessage.

      if (callback) {
        // Unbind an existing callback if it exists.
        if (rmCallback)
          pReceiveMessage();

        // Bind the callback. A reference to the callback is stored for ease of
        // unbinding.
        rmCallback = function(e) {
          if ((typeof sourceOrigin === 'string' && e.origin !== sourceOrigin) ||
              ((typeof sourceOrigin === 'function') && sourceOrigin(e.origin) === FALSE)) {
            return FALSE;
          }
          console.warn('RECEVIGINNNNN----->', e);
          callback(e);
        };
      }

      if (window[addEventListener]) {
        window[callback ? addEventListener : 'removeEventListener']('message', rmCallback, FALSE);
      } else {
        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', rmCallback);
      }

    } else {
      // Since the browser sucks, a polling loop will be started, and the
      // callback will be called whenever the location.hash changes.

      if (intervalId)
        clearInterval(intervalId);
      intervalId = null;

      if (callback) {
        delay = typeof sourceOrigin === 'number' ?
            sourceOrigin :
            typeof delay === 'number' ?
            delay :
            100;

        intervalId = setInterval(function() {
          var hash = document.location.hash,
              re = /^#?\d+&/;
          if (hash !== lastHash && re.test(hash)) {
            lastHash = hash;
            // XXX we broke it since we JSON.stringify the shit...
            callback({ data: hash.replace(re, '') });
          }
        }, delay);
      }
    }
  };

})();
