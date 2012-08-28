/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Basic utility class providing regexp atoms for the core part of the ABNF.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/mingus/grammar/ABNF.js
 */

/**
 * @kind namespace
 * @name ABNF
 * @memberof Mingus.grammar
 * @summary Provides basic regexps for the augmented BNF.
 * @description Implements <a href="http://tools.ietf.org/html/rfc5234#appendix-B.1">Core part of the RFC</a>
 * If you don't know what this is, you don't need it.
 * If you think you should, RTF <a href="http://tools.ietf.org/html/rfc5234"><cite>RFC 5234</cite></a>
 *
 * @property {String} ALPHA
 * @property {String} BIT
 * @property {String} CHAR
 * @property {String} CR
 * @property {String} LF
 * @property {String} CTL
 * @property {String} DIGIT
 * @property {String} DQUOTE
 * @property {String} HEXDIG
 * @property {String} HTAB
 * @property {String} SP
 * @property {String} WSP
 * @property {String} OCTET
 * @property {String} VCHAR
 * @property {String} CRLF
 * @property {String} LWSP
 */

Mingus.grammar.ABNF = new (function() {
  /**
   * @kind function
   * @memberof Mingus.grammar.ABNF
   * @name makeClass
   * @summary Simple helper to turn an aggregate of character range into a valid character class
   * Note this will fail stupidly if the given range contains an opening square bracket...
   * @param {String} thing A construct fragment.
   * @returns {String} The resulting pattern.
   */
  this.makeClass = function(thing) {
    // Un-enclosed character class
    if (thing && !thing.match(/\[/))
      return '[' + thing + ']';
    return thing;
  }

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
   * @kind function
   * @memberof Mingus.grammar.ABNF
   * @name alternate
   * @summary Simple helper to produce an alternate regexp pattern from n constructs.
   * Takes as many parameters as desired.
   * @returns {String} The resulting pattern.
   */

  this.alternate = function() {
    return '(?:' + Array.prototype.slice.call(arguments).map(this.makeClass).join('|') + ')';
  };

  /**
   * @kind function
   * @memberof Mingus.grammar.ABNF
   * @name repeat
   * @summary Simple helper to produce valid "repeat" patterns
   * @param {String} rule The construct to repeat.
   * @param {Uint} [n=0] The minimum number of repetitions to match.
   * @param {Uint} [m=Infinity] The maximum number of repetitions to match.
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
    }else {
      switch (n) {
        // 0 up to m matches
        case 0:
          if (m == 1)
            suffix = '?';
          else
            suffix = '{,' + m + '}';
          break;
        // n to m matches
        default:
          suffix = '{' + n + ',' + m + '}';
          break;
      }
    }
    return rule + suffix;
  };

  /**
   * @kind function
   * @memberof Mingus.grammar.ABNF
   * @name optional
   * @summary Simple helper to make a construct optional.
   * Does exactly the same thing as repeat(rule, 0, 1)
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

  this.ALPHA = '\\x41-\\x5A\\x61-\\x7A';// 'A-Za-z';
  /***/
  this.BIT = '01';
  /***/
  this.CHAR = '\\x01-\\x7f';
  /***/
  this.CR = '\\x0D';
  /***/
  this.LF = '\\x0A';
  /***/
  this.CTL = '\\x00-\\x1F\\x7F';
  /***/
  this.DIGIT = '\\x30-\\x39';//'0-9';
  /***/
  this.DQUOTE = '\\x22';
  /***/
  this.HEXDIG = this.DIGIT + 'ABCDEFabcdef';
  /***/
  this.HTAB = '\\x09'; // \t
  /***/
  this.SP = '\\x20';
  /***/
  this.WSP = this.SP + this.HTAB;
  /***/
  this.OCTET = '\\x00-\\xff';
  /***/
  this.VCHAR = '\\x21-\\x7E';

  /***/
  this.CRLF = this.makeClass(this.CR) + this.makeClass(this.LF);
  /***/
  this.LWSP = this.repeat(this.alternate(this.WSP, this.CRLF + this.makeClass(this.WSP)));

})();

