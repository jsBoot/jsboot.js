/**
 * This is the *most minimal* bootstrapper possible.
 * It is meant to serve as a loader for an (actually useful) bootstrapper.
 * Don't use directly unless you know what you freaking do.
 * Bad things can still happen here, and nasty bugs are lurking.
 * Code adapted from getify JSLabs' gister.
 * This must work without any shim support, in most browsers.
 *
 * @file
 * @summary Tiny bootstrapper for companion script.
 *
 * @author WebItUp
 * @author Getify
 * @version 1.1.0
 *
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">MIT</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @see https://gist.github.com/603980
 * @name https://github.com/jsBoot/spitfire.js/blob/master/src/gulliver.js#62-f14fa4a0754ddf2a106d57504b97442407cd7d48
 */


(function() {
  /*jshint browser:true */
  'use strict';

  /**
   * The purpose is to provide a *minimal* loader, which only purpose is to
   * load a single (other!) file / library / loader.
   * Said script should reside alongside gulliver - its uri will be resolved
   * relatively to that of the gulliver script itself (assuming its name hasn't been
   * changed, or that the optional "name" param matches its new name).
   * Note that using it separately is not so much of a hot idea (you are better of
   * linking a complete loader instead...).
   * This might be useful inline though.
   *
   * @function gulliver
   * @summary Gulliver is a very tiny loader.
   * @example
   *   gulliver(function(){
   *     console.log('Library loaded');
   *   }, 'somelibrary.js');
   * @param       {Function} callback A function to call once the script is loaded.
   * @param       {String} uri        Uri of the script to load, relatively to gulliver itself.
   * @param       {String} [name=gulliver] "Name" of the gulliver script itself to resolve
   * the loaded script path and port hash options.
   * @returns     {undefined}
   */

  this.gulliver = function(callback, uri, name) {
    var head = document.head || document.getElementsByTagName('head');

    // loading code borrowed directly from LABjs itself
    var tout = function() {
      if ('item' in head) { // check if ref is still a live node list
        if (!head[0]) { // append_to node not yet ready
          setTimeout(tout, 25);
          return;
        }
        head = head[0]; // reassign from live node list ref to pure node ref --
        // avoids nasty IE bug where changes to DOM invalidate live node lists
      }
      // Get gulliver itself to guess options
      var scripts = document.getElementsByTagName('script');
      var re = new RegExp('(.*)\\/' + (name || 'gulliver') + '((?:-min)?\\.js)');
      for (var x = 0, baseGulliPath; x < scripts.length; x++) {
        baseGulliPath = scripts[x];
        if (baseGulliPath.src && (baseGulliPath = baseGulliPath.src.match(re))) {
          baseGulliPath.shift();
          uri = baseGulliPath.shift() + '/' + uri + baseGulliPath.shift();
          break;
        }
      }
      var scriptElem = document.createElement('script'),
          scriptdone = false;
      scriptElem.onload = scriptElem.onreadystatechange = function() {
        if ((scriptElem.readyState && scriptElem.readyState !== 'complete' &&
            scriptElem.readyState !== 'loaded') || scriptdone) {
          return false;
        }
        scriptElem.onload = scriptElem.onreadystatechange = null;
        scriptdone = true;
        callback();
      };
      scriptElem.src = uri;
      head.insertBefore(scriptElem, head.firstChild);
    };

    setTimeout(tout, 0);

    // required: shim for FF <= 3.5 not having document.readyState
    if ((document.readyState === null) && document.addEventListener) {
      var handler = function() {
        document.removeEventListener('DOMContentLoaded', handler, false);
        document.readyState = 'complete';
      };
      document.readyState = 'loading';
      document.addEventListener('DOMContentLoaded', handler, false);
    }
  };
}).apply(this);

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file This is a nutshell meant to be aggregated after gulliver and whose sole purpose
 * is to actually load there.is.only.jsboot.
 * This is good ONLY if one wants an ABSOLUTE MINIMAL bootstrapper instead of loading
 * the full regular bootstrapper right away (which is about 20k, and might be blocking).
 * Note that unlike the regular bootstrapper, you can't work right ahead, but instead have
 * to tiojs.wait(function(){//do some}) first.
 * Does allow alternate loaders by using extra "loader-THING" param in the script url
 * (use an hastag)
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/onegateisopening/b.js#65-b772c23316bf59b80f8239279cff657afb13e37e
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

