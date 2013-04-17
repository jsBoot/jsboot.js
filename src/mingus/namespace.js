/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-RIGHTS-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOMEPAGE}
 * @file Root namespace for the Mingus library.
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @location {PUKE-GIT-ROOT}/mingus/crypto/md5.js{PUKE-GIT-REVISION}
 */

/**
 * @kind namespace
 * @name Mingus
 * @summary Global core library (generic).
 * @description This is low-level APIs, and may not be used directly.
 */

/*jshint browser:true*/
(function() {
  'use strict';

  this.Mingus = {
    /**
     * @kind namespace
     * @name grammar
     * @summary Namespace holding "grammar" implementations.
     * @description Contains sub modules handling HTTP and the like grammar.
     * @memberof Mingus
     */
    'grammar': {},
    /**
     * @kind namespace
     * @name crypto
     * @summary Namespace holding cryptography helpers.
     * @description Contains sub modules for md5, etc.
     * @memberof Mingus
     */
    'crypto': {},
    /**
    /**
     * @kind namespace
     * @name xhr
     * @summary Namespace holding xhr enhancement related helpers.
     * @description Contains stuff to handle appkey signing, Digest implementation, gating, etc.
     * @memberof Mingus
     */
    'xhr': {}
  };

}).apply(window);
