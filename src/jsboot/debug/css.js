/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Contains various useful helpers when debugging with jsBoot.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/debug/core.js{PUKE-PACKAGE-GIT-REV}
 */

'use strict';

(function(scope) {
  var debug = false;

  var cssReload = function() {
    var t = [];
    var h = document.getElementsByTagName('head')[0];
    Array.prototype.forEach.call(document.getElementsByTagName('link'), function(item) {
      if (item.rel && item.rel.match(/style/)) {
        var p = item.getAttribute('href').replace(/\?jsbootCacheBuster=[^&]+/, '') +
                '?jsbootCacheBuster=' + Date.now();
        item.setAttribute('href', p);
      }
    });
    Array.prototype.forEach.call(document.getElementsByTagName('style'), function(item) {
      if (item.type && item.type.match(/\/css$/) && item.innerHTML.match(/@import/)) {
        var bef = item.nextSibling;
        var pn = item.parentNode;
        item.parentNode.removeChild(item);
        if (bef)
          bef.parentNode.insertBefore(item, bef);
        else
          pn.appendChild(item);
      }
    });
  };

  scope.cssPoller = new (function() {
    var cssPollerTout;
    this.start = function() {
      cssReload();
      cssPollerTout = window.setTimeout(this.start, 1000);
    };

    this.stop = function() {
      window.clearTimeout(cssPollerTout);
      cssPollerTout = null;
    };

    this.trigger = function() {
      cssReload();
    };

    this.status = function() {
      return !!cssPoller;
    };
  })();

}).apply(this, [jsBoot.debug]);

