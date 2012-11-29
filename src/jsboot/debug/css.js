/**
 * @file
 * @summary A css-reloader/refresher debugging helper.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/debug/css.js{PUKE-GIT-REVISION}
 */

jsBoot.pack('jsBoot.debug', function() {
  /*jshint browser:true*/
  'use strict';

  var cssReload = function() {
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

  var cssPollerTout;

  this.cssPoller = new (function() {
    this.boot = function(time) {
      this.shutdown();
      cssPollerTout = setInterval(cssReload, (time || 1) * 1000);
    };

    this.shutdown = function() {
      if (cssPollerTout) {
        clearInterval(cssPollerTout);
        cssPollerTout = null;
      }
    };

    this.trigger = function() {
      cssReload();
    };

    this.status = function() {
      return !!cssPollerTout;
    };
  })();

});

