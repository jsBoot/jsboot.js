/*!
 * This is adapter from original source code:
 * jQuery postMessage - v0.5 - 9/11/2009
 * http://benalman.com/projects/jquery-postmessage-plugin/
 *
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 *
 * Current code is (c) 2012 WebItUp, under the MIT license.
 */


(function() {
  /*jshint browser:true*/
  'use strict';

  var scope = this.simplePostMessage = {};

  // XXXdmp Opera 9.x MessageEvent.origin fix (only for http:, not https:)
  if (typeof window.opera != 'undefined' && parseInt(window.opera.version(), 10) == 9) {
    /*jshint camelcase:false*/
    /*global Event*/
    Event.prototype.__defineGetter__('origin', function() {
      return 'http://' + this.domain;
    });
  }

  if (('postMessage' in window)) {
    var rmCallback;

    // Technically, this is shimed by event spitifire
    var removeListener = function(cbk) {
      // Technically, this is shimed by event spitifire
      if ('addEventListener' in window)
        window.removeEventListener('message', cbk, false);
      else
        window.detachEvent('onmessage', cbk);
    };

    var addListener = function(cbk) {
      if ('addEventListener' in window)
        window.addEventListener('message', cbk, false);
      else
        window.attachEvent('onmessage', cbk);
    };

    scope.postMessage = function(message, targetUrl, target) {
      /*jshint regexp:false*/
      target.postMessage(message, targetUrl.replace(/^([^:]+:\/\/[^\/]+).*/, '$1'));
    };

    scope.receiveMessage = function(callback, sourceOrigin) {
      // Since the browser supports window.postMessage, the callback will be
      // bound to the actual event associated with window.postMessage.
      // Unbind an existing callback if it exists.
      if (rmCallback)
        removeListener(rmCallback);

      // Bind the callback. A reference to the callback is stored for ease of
      // unbinding.
      rmCallback = function(e) {
        if ((typeof sourceOrigin === 'string' && e.origin !== sourceOrigin) ||
            ((typeof sourceOrigin === 'function') && sourceOrigin(e.origin) === false)) {
          return false;
        }
        callback(e);
      };
      addListener(rmCallback);
    };

  } else {
    var re = /^#?\d+&/;
    var intervalId,
        lastHash,
        cacheBust = 1,
        delay = 100;
    scope.postMessage = function(message, targetUrl, target) {
      /*jshint regexp:false*/
      message = typeof message === 'string' ? encodeURIComponent(message) : encodeURIComponent(JSON.stringify(message));
      target.location = targetUrl.replace(/#.*$/, '') + '#' + (+new Date()) + (cacheBust++) + '&' + message;
    };

    scope.receiveMessage = function(callback) {
      // XXX doesn't validate message origin - redirecting can spoof communication obviously
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      intervalId = setInterval(function() {
        var hash = document.location.hash;
        if (hash !== lastHash && re.test(hash)) {
          lastHash = hash;
          callback({ data: JSON.parse(hash.replace(re, '')) });
        }
      }, delay);
    };
  }

}).apply(this);
