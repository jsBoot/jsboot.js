/**
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @version {PUKE-PACKAGE-VERSION}
 * @location {PUKE-PACKAGE-GIT-ROOT}/lib/com/wiu/roxee/gist/strict.js
 * @fileOverview The Mingus and js.core libraries provides both a minimal framework and 
 * basic helpers defining generic types, and a specialization for Roxee
 * defining numerous classes to handle the model and controllers.
 * @author {PUKE-PACKAGE-AUTHOR}
 */

'use strict';

(function teststrict(){
  var isStrict = false;
  try{
    whatever = "will crash";
  }catch(e){
    isStrict = true;
  }
  if(!isStrict)
    console.error("This doesn't run in strict mode!!!");
})();
