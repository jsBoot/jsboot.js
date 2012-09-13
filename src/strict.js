/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file The strict wrapper - this file is a build-system helper and can be safely ignored.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/strict.js{PUKE-PACKAGE-GIT-REV}
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
