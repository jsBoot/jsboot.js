/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Generic host code that shoud live inside the hosted frame.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/onegateisopening/gate.js
 */

/**#@+
 * @ignore
 */

(function() {
  /*jshint browser:true*/
  /*global simplePostMessage*/
  'use strict';
  /**
 * Shiming boot section
 */
  var shims = Spitfire.boot(location.href.match(/jsboot-debug/));

  for (var x = 0; x < shims.length; x++)
    Spitfire.loader.script('{SPIT-BASE}/' + shims[x]);

  /**
 * Actual gate implementation
 */
  var parentUrl;
  Spitfire.loader.wait(function() {
    // Name of the signal sent up for whenever we say we are ready
    var READY = 'ready';

    // The "caller" url
    parentUrl = decodeURIComponent(document.location.hash.replace(/^#/, ''));


    // Anyone can use this gate - the server will just enforce origin restriction based on app key host declarations
    simplePostMessage.receiveMessage(receiver, function() {return true;});

    // Say we are ready
    simplePostMessage.postMessage(READY, parentUrl, parent);

  });

  jsBoot.comcast.host = new (function() {
    var listenCbk;
    var rest;

    simplePostMessage.receiveMessage(function() {
      return listenCbk ? listenCbk.apply(arguments) : true;
    }, function() {
      return rest ? rest.apply(arguments) : true;
    });

    this.listen = function(cbk, restrictor) {
      listenCbk = cbk;
      rest = restrictor;
    };

    this.sendOut = function(message) {
      simplePostMessage.postMessage(message, parentUrl, parent);
    };
  })();

})();

/**#@-*/
