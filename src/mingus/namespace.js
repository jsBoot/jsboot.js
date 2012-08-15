/**
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @version {PUKE-PACKAGE-VERSION}
 * @location {PUKE-PACKAGE-GIT-ROOT}/lib/com/wiu/mingus/namespace.js
 * @fileOverview Namespace.
 * @author {PUKE-PACKAGE-AUTHOR}
 */

/**
 * This is low-level APIs, and may not be used directly.
 *
 * @name Mingus
 * @namespace Global core library (generic)
 * @extends Object
 */

window.Mingus = {
  /**
   * A namespace to hold basic grammars used by parsing classes
   *
   * @name Mingus.grammar
   * @namespace Low-level API.
   * @extends Object
   */
  'grammar': {},
  /**
     * Low-level API.
     *
     * @name Mingus.converters
     * @namespace A namespace to hold conversion helpers and other string manipulation goodies.
     * Currently holds punycode and utf16 manipulation methods.
     * @extends Object
     */
  'converters': {},
  /**
     * Low-level API.
     *
     * @name Mingus.crypto
     * @namespace A namespace to hold crypto helpers.
     * @extends Object
     */
  'crypto': {},
  /**
     * Low-level API.
     *
     * @name Mingus.xhr
     * @namespace A namespace to hold xhr enhancers/helpers (digest, appKeys, etc).
     * @extends Object
     */
  'xhr': {}
};

/**
 * A dummy nemaspace so that crappy jsdoctoolkit doesn't choke. This is the default console object
 * (possibly shimed), and some additions listed here.
 * @namespace
 * @name console
 */

/**
 * @memberOf console
 * @type Uint
 * @property
 * @name VERBOSITY
 * @example console.VERBOSITY = console.ERROR & console.INFO;
 */

/**#@+
 * @memberOf console
 * @constant
 * @type Uint
 * @see console.VERBOSITY
 */

/**
 * @property
 * @name DEBUG
 */

/**
 * @property
 * @name LOG
 */

/**
 * @property
 * @name WARN
 */

/**
 * @property
 * @name INFO
 */

/**
 * @property
 * @name ERROR
 */

/**#@-
 */






/*
// A funky wrapper to help filter-out calls to console with a simple regexp (console.filter)
(function() {
  var cl = console.log;
  //  var cw = console.warn;
  //  var ce = console.error;
  var ci = console.info;
  var cd = console.debug;

  var dump = function(meth) {
    return function() {
      try {
        i.dont.exist += 0;
      }catch (e) {
        // var stack = [], lastCall;
        // if (e.stack) {// Firefox
        //   stack = e.stack.split('\n');
        //   stack.shift();
        // }else if (window.opera && e.message) { //Opera
        //   stack = e.message.split('\n');
        // }else {
        //
        //   var currentFunction = arguments.callee.caller;
        //   while (currentFunction) {
        //     // var fn = currentFunction.toString();
        //     // var fname = fn.substring(fn.indexOf('function') + 8, fn.indexOf('')) || 'anonymous';
        //     stack.push(currentFunction.toString());
        //     currentFunction = currentFunction.caller;
        //   }
        //
        // }
        // lastCall = stack.shift();
        // if (!console.filter || (lastCall && lastCall.match(console.filter))
        // || (lastCall && lastCall.match(/firebug/)))
        meth.apply(console, arguments);
        return;
      }
    };
  };

  console.log = dump(cl);
  console.info = dump(ci);
  console.debug = dump(cd);
})();
*/



