/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file This is a nutshell meant to be aggregated after gulliver and whose sole purpose
 * is to actually load there.is.only.jsboot.
 * This is good ONLY if one wants an ABSOLUTE MINIMAL bootstrapper instead of loading
 * the full regular bootstrapper right away (which is about 20k, and might be blocking).
 * Note that unlike the regular bootstrapper, you can't work right ahead, but instead have
 * to tiojs.wait(function(){//do some}) first.
 * Does allow alternate loaders by using extra "loader-THING" param in the script url
 * (use an hastag)
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/onegateisopening/b.js{PUKE-PACKAGE-GIT-REV}
 */

(function(aDoc, gull) {
  /*jshint browser:true*/
  /*global gulliver*/
  'use strict';

  var waiters = [];
  // Fake the wait interface for jsBoot until the real one gets there
  // There is no requirejs faking dance here for the simple reason if you already got yourself
  // require, there is almost NO reason why you would use gulliver
  this.tiojs = {
    wait: function(cbk) {
      waiters.push(cbk);
    }
  };

  var booter = function() {
    var c = aDoc.getElementsByTagName('script');
    var m;
    // for(var x = 0, it; (x < c.length) && (it = c[x].src); x++){
    for (var x = 0, it; x < c.length; (it = c[x].getAttribute('src')), x++) {
      if (it && it.search(/t\.i\.o\.j/) != -1) {
        m = it.match(/loader-([a-z]+)/);
        m = m ? '.' + m.pop() : '';
        break;
      }
    }
    // DOM nodes not ready yet - restart crap
    if (typeof m == 'undefined') {
      window.setTimeout(booter, 1);
      return;
    }

    gull(function() {
      for (var x = 0; x < waiters.length; x++)
        waiters[x]();
    }, 'there.is.only.jsboot' + m, 't.i.o.j');
  };
  booter();
}).apply(this, [document, gulliver]);
