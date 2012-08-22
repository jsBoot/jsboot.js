/**
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @location {PUKE-PACKAGE-GIT-ROOT}/strict.js
 * @file The strict wrapper - this file is a build-system helper and can be safely ignored.
 */

'use strict';

(function teststrict() {
  var isStrict = false;
  try {
    whatever = 'will crash';
  }catch (e) {
    isStrict = true;
  }
  if (!isStrict)
    console.error("This doesn't run in strict mode!!!");
})();
