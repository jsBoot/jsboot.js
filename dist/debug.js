/**
 * @file
 * @summary Provides a way to filter out console verbosity.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/console.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */

/*jshint devel:true*/
jsBoot.add(console).as('nativeConsole');
jsBoot.pack('jsBoot.debug', function(api) {
  'use strict';

  // Verbosity controller
  var e = {
    'DEBUG': 1,
    'LOG': 2,
    'INFO': 4,
    'WARN': 8,
    'ERROR': 16,
    'TRACE': 32,
    'ALL': 63
  };

  this.console = {
    VERBOSITY: e.ALL
  };

  // console.time('start');
  Object.keys(e).forEach(function(i) {
    var level = this.console[i] = e[i];
    var nativeMeth = api.nativeConsole[i.toLowerCase()];
    api.nativeConsole[i.toLowerCase()] = (function() {
      if (this.console.VERBOSITY & level) {
        // var args = Array.prototype.slice(arguments);
        // args.push(Date.now());
        // console.timeEnd('start');
        // console.timeEnd('previous');
        // console.time('previous');
        // Might very well crash IE bitch
        try {
          nativeMeth.apply(api.nativeConsole, arguments);
        }catch (e) {
          Array.prototype.slice(arguments).forEach(function(arg) {
            nativeMeth.apply(api.nativeConsole, [arg]);
          });
        }
      }
    }.bind(this));
  }, this);

});

/**
 * @file
 * @summary A css-reloader/refresher debugging helper.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/css.js#65-b772c23316bf59b80f8239279cff657afb13e37e
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


/**
 * @file
 * @summary Declare a dummy debug default error handler
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/console.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */


jsBoot.use('jsBoot.core');
jsBoot.run(function(api) {
  /*global console, location*/
  'use strict';

  // The default error handler is a stupid logger to console
  var markee = ' ┌∩┐(◣_◢)┌∩┐ ';

  api.core.registerErrorHandler(function(str, fileName, lineNumber) {
    console.error(markee, markee, markee);
    console.warn('File:', fileName);
    console.warn('Number:', lineNumber);
    console.warn('Date', new Date());
    console.warn('Location', location.href);
    console.error('Exception:', str);
    console.error(markee, markee, markee);
    return false;
  });
});

/**
 * @file
 * @summary Debug core providing a tick method for perf measurements
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/debug/tick.js#65-b772c23316bf59b80f8239279cff657afb13e37e
 */

jsBoot.pack('jsBoot.debug', function() {
  /*global console*/
  'use strict';

  var started = false;
  this.tick = function(message, end) {
    console.info(' [jsBoot.debug.tick]', message);
    if (started) {
      console.timeEnd('Time since last tick');
    }else {
      started = console.time('Total time') || true;
    }
    console.time('Time since last tick');
    if (end) {
      started = false;
      console.info(' [jsBoot.debug.tick]', 'Ending measurement! Total boot time:');
      console.timeEnd('Total time');
    }
  };

  this.tick('Debug module fully loaded. Starting time measurement');

});

