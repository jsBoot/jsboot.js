/**
 * Basic utility class providing regexp atoms for the core part of the ABNF.
 *
 * @file
 * @summary ABNF helper.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/mingus/grammar/ABNF.js{PUKE-GIT-REVISION}
 */


(function() {
  /*global Mingus*/
  'use strict';

  /**
   * If you don't know what this is, you don't need it.
   * If you think you should, RTF <a href="http://tools.ietf.org/html/rfc5234"><cite>RFC 5234</cite></a>
   * @namespace
   * @name Mingus.grammar.ABNF
   * @summary Provides basic regexps for the augmented BNF.
   * @see http://tools.ietf.org/html/rfc5234#appendix-B.1
   */
  Mingus.grammar.ABNF = new (function() {

    /**
   * Note this will fail stupidly if the given range contains an opening square bracket...
   *
   * @function
   * @name Mingus.grammar.ABNF.makeClass
   * @summary Simple helper to turn an aggregate of character range into a valid character class
   * @param {String} thing A construct fragment.
   * @returns {String} The resulting pattern.
   */
    this.makeClass = function(thing) {
      // Un-enclosed character class
      if (thing && !thing.match(/\[/))
        return '[' + thing + ']';
      return thing;
    };

    var prepareAll = function(thing, noForce) {
      if (!thing)
        return thing;
      var test = thing.match(/\[/g);
      // Un-enclosed character class
      if (!test)
        return '[' + thing + ']';
    // Multiple char class in there already, need enclosing
    // XXX might nest if used improperly
    // XXX might false positive match escaped \[
      else if (((test.length > 1) || !thing.match(/^\[[^\]]+\]$/)) && !noForce)
        return '(?:' + thing + ')';
      // Simple enclosed character class, nothing special to do
      return thing;
    };

    /**
   * Takes as many parameters as desired.
   *
   * @function
   * @name Mingus.grammar.ABNF.alternate
   * @summary Simple helper to produce an alternate regexp pattern from n constructs.
   * @param {...String} any construct.
   * @returns {String} The resulting pattern.
   */

    this.alternate = function() {
      return '(?:' + Array.prototype.slice.call(arguments).map(this.makeClass).join('|') + ')';
    };

    /**
   * @function
   * @name Mingus.grammar.ABNF.repeat
   * @summary Simple helper to produce valid "repeat" patterns
   * @param {String} rule The construct to repeat.
   * @param {UInt} [n=0] The minimum number of repetitions to match.
   * @param {UInt} [m=Infinity] The maximum number of repetitions to match.
   * @returns {String} The resulting pattern.
   */

    this.repeat = function(rule, n, m) {
      // Prepare the rule (proper enclosing)
      rule = prepareAll(rule);
      // Now, build out a readable suffix
      var suffix;
      // Unspecified m means default infinity - m as 0 doesn't make sense either and gets there
      if (!m) {
        if (!n)
          // 0 or more matches
          suffix = '*';
        else if (n == 1)
          // 1 or more matches
          suffix = '+';
        else
          // n or more matches
          suffix = '{' + n + ',}';
      }else if (n == m) {
        if (n == 1)
          // exactly one match... kind of dull - will get a useless enclosing by the way
          suffix = '';
        else
          // Exaclty n match, where n > 1
          suffix = '{' + n + '}';
      }else if (n) {
        suffix = '{' + n + ',' + m + '}';
      }else if (m == 1) {
        suffix = '?';
      }else {
        suffix = '{,' + m + '}';
      }
      return rule + suffix;
    };

    /**
   * Does exactly the same thing as repeat(rule, 0, 1)
   *
   * @function
   * @name Mingus.grammar.ABNF.optional
   * @summary Simple helper to make a construct optional.
   * @param {String} rule The construct to repeat.
   * @return {String} The resulting pattern.
   */
    this.optional = function(rule) {
      // Prepare the rule (proper enclosing)
      rule = prepareAll(rule);
      return rule + '?';
    };

    /*
B.1.  Core Rules
         ALPHA          =  %x41-5A / %x61-7A   ; A-Z / a-z
         BIT            =  "0" / "1"
         CHAR           =  %x01-7F
                                ; any 7-bit US-ASCII character,
                                ;  excluding NUL
         CR             =  %x0D
                                ; carriage return
         CRLF           =  CR LF
                                ; Internet standard newline
         CTL            =  %x00-1F / %x7F
                                ; controls
         DIGIT          =  %x30-39
                                ; 0-9
         DQUOTE         =  %x22
                                ; " (Double Quote)
         HEXDIG         =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
         HTAB           =  %x09
                                ; horizontal tab
         LF             =  %x0A
                                ; linefeed
         LWSP           =  *(WSP / CRLF WSP)
                                ; Use of this linear-white-space rule
                                ;  permits lines containing only white
                                ;  space that are no longer legal in
                                ;  mail headers and have caused
                                ;  interoperability problems in other
                                ;  contexts.
                                ; Do not use when defining mail
                                ;  headers and use with caution in
                                ;  other contexts.

         OCTET          =  %x00-FF
                                ; 8 bits of data
         SP             =  %x20
         VCHAR          =  %x21-7E
                                ; visible (printing) characters
         WSP            =  SP / HTAB
                                ; white space
  */


    /**
 * @member
 * @name Mingus.grammar.ABNF.ALPHA
 * @type String
 * @constant
 */

    this.ALPHA = '\\x41-\\x5A\\x61-\\x7A';// 'A-Za-z';


    /**
 * @member
 * @name Mingus.grammar.ABNF.BIT
 * @type String
 * @constant
 */
    this.BIT = '01';


    /**
 * @member
 * @name Mingus.grammar.ABNF.CHAR
 * @type String
 * @constant
 */
    this.CHAR = '\\x01-\\x7f';

    /**
 * @member
 * @name Mingus.grammar.ABNF.CR
 * @type String
 * @constant
 */
    this.CR = '\\x0D';

    /**
 * @member
 * @name Mingus.grammar.ABNF.LF
 * @type String
 * @constant
 */
    this.LF = '\\x0A';

    /**
 * @member
 * @name Mingus.grammar.ABNF.CTL
 * @type String
 * @constant
 */
    this.CTL = '\\x00-\\x1F\\x7F';

    /**
 * @member
 * @name Mingus.grammar.ABNF.DIGIT
 * @type String
 * @constant
 */
    this.DIGIT = '\\x30-\\x39';//'0-9';

    /**
 * @member
 * @name Mingus.grammar.ABNF.DQUOTE
 * @type String
 * @constant
 */
    this.DQUOTE = '\\x22';

    /**
 * @member
 * @name Mingus.grammar.ABNF.HEXDIG
 * @type String
 * @constant
 */
    this.HEXDIG = this.DIGIT + 'ABCDEFabcdef';

    /**
 * @member
 * @name Mingus.grammar.ABNF.HTAB
 * @type String
 * @constant
 */
    this.HTAB = '\\x09'; // \t

    /**
 * @member
 * @name Mingus.grammar.ABNF.SP
 * @type String
 * @constant
 */
    this.SP = '\\x20';

    /**
 * @member
 * @name Mingus.grammar.ABNF.WSP
 * @type String
 * @constant
 */
    this.WSP = this.SP + this.HTAB;

    /**
 * @member
 * @name Mingus.grammar.ABNF.OCTET
 * @type String
 * @constant
 */
    this.OCTET = '\\x00-\\xff';

    /**
 * @member
 * @name Mingus.grammar.ABNF.VCHAR
 * @type String
 * @constant
 */
    this.VCHAR = '\\x21-\\x7E';
    /**
 * @member
 * @name Mingus.grammar.ABNF.CRLF
 * @type String
 * @constant
 */
    this.CRLF = this.makeClass(this.CR) + this.makeClass(this.LF);

    /**
 * @member
 * @name Mingus.grammar.ABNF.LWSP
 * @type String
 * @constant
 */

    this.LWSP = this.repeat(this.alternate(this.WSP, this.CRLF + this.makeClass(this.WSP)));

  })();
})();
