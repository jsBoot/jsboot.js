/**
 * @file "Strict" tester.
 *
 * This file is a build-system helper and can be safely ignored.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name strict.js
 * @location {PUKE-GIT-ROOT}/strict.js{PUKE-GIT-REVISION}
 */

(function() {
  // fool linter
  /*global whateverthenameofthis:true, console:false*/
  'use strict';
  try {
    whateverthenameofthis = 'will crash';
    try {
      console.error('Browser doesn\'t support strict mode!!!');
    }catch (e) {
    }
  }catch (e) {
  }
}).apply(this);
