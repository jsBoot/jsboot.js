/**
 * This file is a build-system helper and can be safely ignored.
 *
 * @file
 * @summary "Strict" tester.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/strict.js{PUKE-GIT-REVISION}
 */

(function() {
  // fool linter
  /*global whateverthenameofthis:true, console:true*/
  'use strict';
  try {
    whateverthenameofthis = 'will crash';
    try {
      console.error('This doesn\'t run in strict mode!!!');
    }catch (e) {
    }
  }catch (e) {
  }
}).apply(this);
