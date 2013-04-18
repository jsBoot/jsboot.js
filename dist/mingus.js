/**
 * This file is a build-system helper and can be safely ignored.
 *
 * @file
 * @summary "Strict" tester.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/strict.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

(function() {
  // fool linter
  /*global whateverthenameofthis:false, console:false*/
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

/*!
 * This is adapter from original source code:
 * jQuery postMessage - v0.5 - 9/11/2009
 * http://benalman.com/projects/jquery-postmessage-plugin/
 *
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 *
 * Current code is (c) 2012 WebItUp, under the MIT license.
 */


(function() {
  /*jshint browser:true*/
  'use strict';

  var scope = this.simplePostMessage = {};

  // XXXdmp Opera 9.x MessageEvent.origin fix (only for http:, not https:)
  if (typeof window.opera != 'undefined' && parseInt(window.opera.version(), 10) == 9) {
    /*jshint camelcase:false*/
    /*global Event*/
    Event.prototype.__defineGetter__('origin', function() {
      return 'http://' + this.domain;
    });
  }

  if (('postMessage' in window)) {
    var rmCallback;

    // Technically, this is shimed by event spitifire
    var removeListener = function(cbk) {
      // Technically, this is shimed by event spitifire
      if ('addEventListener' in window)
        window.removeEventListener('message', cbk, false);
      else
        window.detachEvent('onmessage', cbk);
    };

    var addListener = function(cbk) {
      if ('addEventListener' in window)
        window.addEventListener('message', cbk, false);
      else
        window.attachEvent('onmessage', cbk);
    };

    scope.postMessage = function(message, targetUrl, target) {
      /*jshint regexp:false*/
      target.postMessage(message, targetUrl.replace(/^([^:]+:\/\/[^\/]+).*/, '$1'));
    };

    scope.receiveMessage = function(callback, sourceOrigin) {
      // Since the browser supports window.postMessage, the callback will be
      // bound to the actual event associated with window.postMessage.
      // Unbind an existing callback if it exists.
      if (rmCallback)
        removeListener(rmCallback);

      // Bind the callback. A reference to the callback is stored for ease of
      // unbinding.
      rmCallback = function(e) {
        if ((typeof sourceOrigin === 'string' && e.origin !== sourceOrigin) ||
            ((typeof sourceOrigin === 'function') && sourceOrigin(e.origin) === false)) {
          return false;
        }
        callback(e);
      };
      addListener(rmCallback);
    };

  } else {
    var re = /^#?\d+&/;
    var intervalId,
        lastHash,
        cacheBust = 1,
        delay = 100;
    scope.postMessage = function(message, targetUrl, target) {
      /*jshint regexp:false*/
      message = typeof message === 'string' ? encodeURIComponent(message) : encodeURIComponent(JSON.stringify(message));
      target.location = targetUrl.replace(/#.*$/, '') + '#' + (+new Date()) + (cacheBust++) + '&' + message;
    };

    scope.receiveMessage = function(callback) {
      // XXX doesn't validate message origin - redirecting can spoof communication obviously
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      intervalId = setInterval(function() {
        var hash = document.location.hash;
        if (hash !== lastHash && re.test(hash)) {
          lastHash = hash;
          callback({ data: JSON.parse(hash.replace(re, '')) });
        }
      }, delay);
    };
  }

}).apply(this);

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file Root namespace for the Mingus library.
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/crypto/md5.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
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

/**
 * Basic utility class providing regexp atoms for the core part of the ABNF.
 *
 * @file
 * @summary ABNF helper.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/ABNF.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
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

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file Basic utility class providing regexp atoms for the address part of the internet message format RFC.
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/IMF.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

/**
 * @kind namespace
 * @name IMF
 * @memberof Mingus.grammar
 * @summary Provides basic regexps for addresses and a trivial validation function.
 * @description This implements part of <a href="http://tools.ietf.org/html/rfc5322">RFC 5322</a>.
 * @requires Mingus.grammar.ABNF
 */

(function() {
  /*global Mingus*/
  'use strict';

  (function(ABNF) {
    /*

4.1.  Miscellaneous Obsolete Tokens

   These syntactic elements are used elsewhere in the obsolete syntax or
   in the main syntax.  Bare CR, bare LF, and NUL are added to obs-qp,
   obs-body, and obs-unstruct.  US-ASCII control characters are added to
   obs-qp, obs-unstruct, obs-ctext, and obs-qtext.  The period character
   is added to obs-phrase.  The obs-phrase-list provides for a
   (potentially empty) comma-separated list of phrases that may include
   "null" elements.  That is, there could be two or more commas in such
   a list with nothing in between them, or commas at the beginning or
   end of the list.

      Note: The "period" (or "full stop") character (".") in obs-phrase
      is not a form that was allowed in earlier versions of this or any
      other specification.  Period (nor any other character from
      specials) was not allowed in phrase because it introduced a
      parsing difficulty distinguishing between phrases and portions of
      an addr-spec (see section 4.4).  It appears here because the
      period character is currently used in many messages in the
      display-name portion of addresses, especially for initials in
      names, and therefore must be interpreted properly.

   obs-NO-WS-CTL   =   %d1-8 /            ; US-ASCII control
                       %d11 /             ;  characters that do not
                       %d12 /             ;  include the carriage
                       %d14-31 /          ;  return, line feed, and
                       %d127              ;  white space characters

   obs-ctext       =   obs-NO-WS-CTL

   obs-qtext       =   obs-NO-WS-CTL

   obs-qp          =   "\" (%d0 / obs-NO-WS-CTL / LF / CR)

   obs-utext       =   %d0 / obs-NO-WS-CTL / VCHAR

   obs-body        =   *((*LF *CR *((%d0 / text) *LF *CR)) / CRLF)

   obs-unstruct    =   *((*LF *CR *(obs-utext *LF *CR)) / FWS)


   obs-phrase      =   word *(word / "." / CFWS)

   obs-phrase-list =   [phrase / CFWS] *("," [phrase / CFWS])

   Bare CR and bare LF appear in messages with two different meanings.
   In many cases, bare CR or bare LF are used improperly instead of CRLF
   to indicate line separators.  In other cases, bare CR and bare LF are
   used simply as US-ASCII control characters with their traditional
   ASCII meanings.
  */

    // Note that specials are not needed for the address spec
    var obsNOWSCTL = '\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f';
    var obsCtext = obsNOWSCTL;
    var obsQtext = obsNOWSCTL;
    var obsQp = '\\\\' + ABNF.makeClass('\\x00' + obsNOWSCTL + ABNF.LF + ABNF.CR);

    /*
3.2.1.  Quoted characters

   Some characters are reserved for special interpretation, such as
   delimiting lexical tokens.  To permit use of these characters as
   uninterpreted data, a quoting mechanism is provided.



Resnick                     Standards Track                    [Page 10]

RFC 5322                Internet Message Format             October 2008


   quoted-pair     =   ("\" (VCHAR / WSP)) / obs-qp

   Where any quoted-pair appears, it is to be interpreted as the
   character alone.  That is to say, the "\" character that appears as
   part of a quoted-pair is semantically "invisible".

      Note: The "\" character may appear in a message where it is not
      part of a quoted-pair.  A "\" character that does not appear in a
      quoted-pair is not semantically invisible.  The only places in
      this specification where quoted-pair currently appears are
      ccontent, qcontent, and in obs-dtext in section 4.
  */

    var newQp = '\\\\' + ABNF.makeClass(ABNF.VCHAR + ABNF.WSP);

    var quotedPair = ABNF.alternate(newQp, obsQp);

    /*
4.2.  Obsolete Folding White Space

   In the obsolete syntax, any amount of folding white space MAY be
   inserted where the obs-FWS rule is allowed.  This creates the
   possibility of having two consecutive "folds" in a line, and
   therefore the possibility that a line which makes up a folded header
   field could be composed entirely of white space.

   obs-FWS         =   1*WSP *(CRLF 1*WSP)

  */

    var obsFWS = ABNF.repeat(ABNF.WSP, 1) + ABNF.repeat(ABNF.CRLF + ABNF.repeat(ABNF.WSP, 1));


    /*
3.2.2.  Folding White Space and Comments

   White space characters, including white space used in folding
   (described in section 2.2.3), may appear between many elements in
   header field bodies.  Also, strings of characters that are treated as
   comments may be included in structured field bodies as characters
   enclosed in parentheses.  The following defines the folding white
   space (FWS) and comment constructs.

   Strings of characters enclosed in parentheses are considered comments
   so long as they do not appear within a "quoted-string", as defined in
   section 3.2.4.  Comments may nest.

   There are several places in this specification where comments and FWS
   may be freely inserted.  To accommodate that syntax, an additional
   token for "CFWS" is defined for places where comments and/or FWS can
   occur.  However, where CFWS occurs in this specification, it MUST NOT
   be inserted in such a way that any line of a folded header field is
   made up entirely of WSP characters and nothing else.

   FWS             =   ([*WSP CRLF] 1*WSP) /  obs-FWS
                                          ; Folding white space

   ctext           =   %d33-39 /          ; Printable US-ASCII
                       %d42-91 /          ;  characters not including
                       %d93-126 /         ;  "(", ")", or "\"
                       obs-ctext

   ccontent        =   ctext / quoted-pair / comment

   comment         =   "(" *([FWS] ccontent) [FWS] ")"

   CFWS            =   (1*([FWS] comment) [FWS]) / FWS


   Throughout this specification, where FWS (the folding white space
   token) appears, it indicates a place where folding, as discussed in
   section 2.2.3, may take place.  Wherever folding appears in a message
   (that is, a header field body containing a CRLF followed by any WSP),
   unfolding (removal of the CRLF) is performed before any further
   semantic analysis is performed on that header field according to this
   specification.  That is to say, any CRLF that appears in FWS is
   semantically "invisible".

   A comment is normally used in a structured field body to provide some
   human-readable informational text.  Since a comment is allowed to
   contain FWS, folding is permitted within the comment.  Also note that
   since quoted-pair is allowed in a comment, the parentheses and
   backslash characters may appear in a comment, so long as they appear
   as a quoted-pair.  Semantically, the enclosing parentheses are not
   part of the comment; the comment is what is contained between the two
   parentheses.  As stated earlier, the "\" in any quoted-pair and the
   CRLF in any FWS that appears within the comment are semantically
   "invisible" and therefore not part of the comment either.

   Runs of FWS, comment, or CFWS that occur between lexical tokens in a
   structured header field are semantically interpreted as a single
   space character.


  */

    var FWS = ABNF.alternate(ABNF.optional(ABNF.repeat(ABNF.WSP) + ABNF.CRLF) + ABNF.repeat(ABNF.WSP, 1), obsFWS);

    var ctext = '\\x21-\\x27\\x2a-\\x5b\\x5d-\\x7e' + obsCtext;

    // XXX Doesn't allow nested comments inside comments contents - too much of a
    // pain to implement :-)

    var ccontent = ABNF.alternate(ctext, quotedPair);

    var comment = '\\(' + ABNF.repeat(ABNF.optional(FWS) + ccontent) + ABNF.optional(FWS) + '\\)';

    ccontent = ABNF.alternate(ctext, quotedPair, comment);

    var CFWS = ABNF.alternate(ABNF.repeat(ABNF.optional(FWS) + comment, 1) + ABNF.optional(FWS), FWS);


    /*
3.2.4.  Quoted Strings

   Strings of characters that include characters other than those
   allowed in atoms can be represented in a quoted string format, where
   the characters are surrounded by quote (DQUOTE, ASCII value 34)
   characters.


   qtext           =   %d33 /             ; Printable US-ASCII
                       %d35-91 /          ;  characters not including
                       %d93-126 /         ;  "\" or the quote character
                       obs-qtext

   qcontent        =   qtext / quoted-pair

   quoted-string   =   [CFWS]
                       DQUOTE *([FWS] qcontent) [FWS] DQUOTE
                       [CFWS]

   A quoted-string is treated as a unit.  That is, quoted-string is
   identical to atom, semantically.  Since a quoted-string is allowed to
   contain FWS, folding is permitted.  Also note that since quoted-pair
   is allowed in a quoted-string, the quote and backslash characters may
   appear in a quoted-string so long as they appear as a quoted-pair.

   Semantically, neither the optional CFWS outside of the quote
   characters nor the quote characters themselves are part of the
   quoted-string; the quoted-string is what is contained between the two
   quote characters.  As stated earlier, the "\" in any quoted-pair and
   the CRLF in any FWS/CFWS that appears within the quoted-string are
   semantically "invisible" and therefore not part of the quoted-string
   either.
  */

    var qtext = obsQtext + '\\x21\\x23-\\x5b\\x5d-\\x7e';

    var qcontent = ABNF.alternate(qtext, quotedPair);
    var quotedString = ABNF.optional(CFWS) + ABNF.makeClass(ABNF.DQUOTE) +
        ABNF.repeat(ABNF.optional(FWS) + qcontent) + ABNF.optional(FWS) +
        ABNF.makeClass(ABNF.DQUOTE) + ABNF.optional(CFWS);


    /*
3.2.3.  Atom

   Several productions in structured header field bodies are simply
   strings of certain basic characters.  Such productions are called
   atoms.

   Some of the structured header field bodies also allow the period
   character (".", ASCII value 46) within runs of atext.  An additional
   "dot-atom" token is defined for those purposes.

      Note: The "specials" token does not appear anywhere else in this
      specification.  It is simply the visible (i.e., non-control, non-
      white space) characters that do not appear in atext.  It is
      provided only because it is useful for implementers who use tools
      that lexically analyze messages.  Each of the characters in
      specials can be used to indicate a tokenization point in lexical
      analysis.


   atext           =   ALPHA / DIGIT /    ; Printable US-ASCII
                       "!" / "#" /        ;  characters not including
                       "$" / "%" /        ;  specials.  Used for atoms.
                       "&" / "'" /
                       "*" / "+" /
                       "-" / "/" /
                       "=" / "?" /
                       "^" / "_" /
                       "`" / "{" /
                       "|" / "}" /
                       "~"

   atom            =   [CFWS] 1*atext [CFWS]

   dot-atom-text   =   1*atext *("." 1*atext)

   dot-atom        =   [CFWS] dot-atom-text [CFWS]

   specials        =   "(" / ")" /        ; Special characters that do
                       "<" / ">" /        ;  not appear in atext
                       "[" / "]" /
                       ":" / ";" /
                       "@" / "\" /
                       "," / "." /
                       DQUOTE

   Both atom and dot-atom are interpreted as a single unit, comprising
   the string of characters that make it up.  Semantically, the optional
   comments and FWS surrounding the rest of the characters are not part
   of the atom; the atom is only the run of atext characters in an atom,
   or the atext and "." characters in a dot-atom.
  */

    var atext = ABNF.ALPHA + ABNF.DIGIT + '\\/=?^_`{|}~!#$%&\'*+-';
    var atom = ABNF.optional(CFWS) + ABNF.repeat(atext, 1) + ABNF.optional(CFWS);

    var dotAtomText = ABNF.repeat(atext, 1) + ABNF.repeat('[.]' + ABNF.repeat(atext, 1));
    var dotAtom = ABNF.optional(CFWS) + dotAtomText + ABNF.optional(CFWS);



    // Various tokens
    var word = ABNF.alternate(atom, quotedString);



    /*
4.4.  Obsolete Addressing

   There are four primary differences in addressing.  First, mailbox
   addresses were allowed to have a route portion before the addr-spec
   when enclosed in "<" and ">".  The route is simply a comma-separated
   list of domain names, each preceded by "@", and the list terminated
   by a colon.  Second, CFWS were allowed between the period-separated
   elements of local-part and domain (i.e., dot-atom was not used).  In
   addition, local-part is allowed to contain quoted-string in addition
   to just atom.  Third, mailbox-list and address-list were allowed to
   have "null" members.  That is, there could be two or more commas in
   such a list with nothing in between them, or commas at the beginning
   or end of the list.  Finally, US-ASCII control characters and quoted-
   pairs were allowed in domain literals and are added here.

   obs-angle-addr  =   [CFWS] "<" obs-route addr-spec ">" [CFWS]

   obs-route       =   obs-domain-list ":"

   obs-domain-list =   *(CFWS / ",") "@" domain
                       *("," [CFWS] ["@" domain])

   obs-mbox-list   =   *([CFWS] ",") mailbox *("," [mailbox / CFWS])

   obs-addr-list   =   *([CFWS] ",") address *("," [address / CFWS])

   obs-group-list  =   1*([CFWS] ",") [CFWS]

   obs-local-part  =   word *("." word)

   obs-domain      =   atom *("." atom)

   obs-dtext       =   obs-NO-WS-CTL / quoted-pair

   When interpreting addresses, the route portion SHOULD be ignored.
  */

    var obsDtext = ABNF.alternate(obsNOWSCTL, quotedPair);
    var obsDomain = atom + ABNF.repeat('[.]' + atom);
    var obsLocalPart = word + ABNF.repeat('[.]' + word);

    /*
3.4.1.  Addr-Spec Specification

   addr-spec       =   local-part "@" domain

   local-part      =   dot-atom / quoted-string / obs-local-part

   domain          =   dot-atom / domain-literal / obs-domain

   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]

   dtext           =   %d33-90 /          ; Printable US-ASCII
                       %d94-126 /         ;  characters not including
                       obs-dtext          ;  "[", "]", or "\"

   The domain portion identifies the point to which the mail is
   delivered.  In the dot-atom form, this is interpreted as an Internet
   domain name (either a host name or a mail exchanger name) as
   described in [RFC1034], [RFC1035], and [RFC1123].  In the domain-
   literal form, the domain is interpreted as the literal Internet
   address of the particular host.  In both cases, how addressing is
   used and how messages are transported to a particular host is covered
   in separate documents, such as [RFC5321].  These mechanisms are
   outside of the scope of this document.

   The local-part portion is a domain-dependent string.  In addresses,
   it is simply interpreted on the particular host as a name of a
   particular mailbox.


  */


    var dtext = ABNF.alternate('\\x21-\\x5a\\x5e-\\x7e', obsDtext);

    // XXX not proper - should conform to corresponding RFC (IRI prolly)
    var domainLiteral = ABNF.optional(CFWS) + '\\[' +
        ABNF.repeat(ABNF.optional(FWS) + dtext) +
        ABNF.optional(FWS) + '\\]' + ABNF.optional(CFWS);

    /**
   * @kind member
   * @name DOMAIN
   * @summary Regexp for "domain"
   * @description A string to create a regexp that matches the "domain" part of a mail address
   * @type String
   * @memberof Mingus.grammar.IMF
   * @constant
   * @example
   * // You will like use this to build a regexp that matches and split email addresses like so:
   * var validator = new RegExp("^(" + this.LOCAL_PART + ")@(" + this.DOMAIN + ")$");
   */
    this.DOMAIN = ABNF.alternate(dotAtom, domainLiteral, obsDomain);

    /**
   * @kind member
   * @name DOMAIN
   * @summary Regexp for "local part"
   * @description A string to create a regexp that matches the "local" part of a mail address
   * @type String
   * @memberof Mingus.grammar.IMF
   * @constant
   */
    this.LOCAL_PART = ABNF.alternate(dotAtom, quotedString, obsLocalPart);


    // Compile that crap only once please
    var validator = new RegExp('^(' + this.LOCAL_PART + ')@(' + this.DOMAIN + ')$');


    /**
   * @kind function
   * @name isValidAddress
   * @summary A trivial function to validate mail addresses.
   * @description Note that it enforces additional restrictions not mentioned in the RFC, sourced from <a
   * href="http://tools.ietf.org/html/rfc3696">this other RFC</a>, hence limits the local part to 64 characters,
   * and the domain part to 255 characters.
   * @memberof Mingus.grammar.IMF
   * @param {String} someAddress A random string to validate.
   * @returns {Boolean} Wether true if the string is a valid email address, or false otherwise...
   */

    this.IMF = {
      isValidAddress: function(someAddress) {
        /*
    Informal additional constraint described in http://tools.ietf.org/html/rfc3696

     In addition to restrictions on syntax, there is a length limit on
     email addresses.  That limit is a maximum of 64 characters (octets)
     in the "local part" (before the "@") and a maximum of 255 characters
     (octets) in the domain part (after the "@") for a total length of 320
     characters.  Systems that handle email should be prepared to process
     addresses which are that long, even though they are rarely
     encountered.
    */
        // Don't bother trying to validate crap
        if (someAddress.length > 320)
          return false;
        var r;
        return someAddress &&
            (r = someAddress.match(validator)) &&
            (r[1].length <= 64) &&
            (r[2].length <= 255);
      }
    };

  }).apply(Mingus.grammar, [Mingus.grammar.ABNF]);

})();

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file Utility class that provides regexp easing the parsing of IRIs.
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/IRI.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

/**
 * @summary Stuffier thinger with fries.
 * A (not so) simple regexp to parse internatinalized uris
 *
 * @description  Even if you know what this is, it's unlikely you should ever need to (not to
 * mention *want to*) read <a href="http://www.ietf.org/rfc/rfc3987">this</a>
 * - if you're still here: we use only the range in the Basic Multilingual Plane
 * for the ucs, and deliberately ignore anything in any of the planes from 1 to 16.
 * I have no idea how to do for these.
 * Anyhow, planes 3 to 13 are not assigned, 15 and 16
 * are private use, 14 is defined as "special purpose" (no idea what this is),
 * and ignoring the SMP and SIP shouldn't be too much of a big deal...
 *
 * <a href="http://tools.ietf.org/html/rfc3986">URI</a>
 * <a href="http://www.ietf.org/rfc/rfc3987">IRI</a>
 *
 * @todo Furthering internet host name validation
 * http://www.iana.org/domains/root/db/
 * http://data.iana.org/TLD/tlds-alpha-by-domain.txt
 *
 * @todo Write tests and compare to other implementations
 * http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
 * (surcouche: http://code.google.com/p/jsuri/)
 * http://www.fliquidstudios.com/projects/javascript-url-library/
 * http://medialize.github.com/URI.js/
 * https://github.com/medialize/URI.js
 * https://github.com/beaugunderson/javascript-ipv6
 * http://stackoverflow.com/questions/183485/can-anyone-recommend-a-good-free-javascript-for-punycode-
 * to-unicode-conversion
 * https://github.com/bestiejs/punycode.js
 *
 * http://jsperf.com/url-parsing/2
 * http://url.spec.whatwg.org/
 *
 * @namespace
 * @name Mingus.grammar.IRI
 * @requires Mingus.grammar.ABNF
 */

(function() {
  /*global Mingus*/
  'use strict';

  (function(ABNF) {


    /*
   dec-octet      = DIGIT                 ; 0-9
                  / %x31-39 DIGIT         ; 10-99
                  / "1" 2DIGIT            ; 100-199
                  / "2" %x30-34 DIGIT     ; 200-249
                  / "25" %x30-35          ; 250-255
   _ipv4address    = dec-octet "." dec-octet "." dec-octet "." dec-octet


   _h16            = 1*4HEXDIG
   _ls32           = ( _h16 ":" _h16 ) / _ipv4address

   IPv6address    =                            6( _h16 ":" ) _ls32
                  /                       "::" 5( _h16 ":" ) _ls32
                  / [               _h16 ] "::" 4( _h16 ":" ) _ls32
                  / [ *1( _h16 ":" ) _h16 ] "::" 3( _h16 ":" ) _ls32
                  / [ *2( _h16 ":" ) _h16 ] "::" 2( _h16 ":" ) _ls32
                  / [ *3( _h16 ":" ) _h16 ] "::"    _h16 ":"   _ls32
                  / [ *4( _h16 ":" ) _h16 ] "::"              _ls32
                  / [ *5( _h16 ":" ) _h16 ] "::"              _h16
                  / [ *6( _h16 ":" ) _h16 ] "::"


   unreserved     = ALPHA / DIGIT / "-" / "." / "_" / "~"
   sub-delims     = "!" / "$" / "&" / "'" / "(" / ")"
                  / "*" / "+" / "," / ";" / "="

   IPvFuture      = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )

   IP-literal     = "[" ( IPv6address / IPvFuture  ) "]"

  */

    // ip addressing
    var _decOctet = ABNF.alternate(
        ABNF.DIGIT,
        '[1-9]' + ABNF.makeClass(ABNF.DIGIT),
        '1' + ABNF.repeat(ABNF.DIGIT, 2),
        '2[0-4]' + ABNF.makeClass(ABNF.DIGIT),
        '25[0-5]'
        );

    var _ipv4address = _decOctet + '\\.' + _decOctet + '\\.' + _decOctet + '\\.' + _decOctet;

    var _h16 = ABNF.repeat(ABNF.HEXDIG, 1, 4);
    var _ls32 = ABNF.alternate(_h16 + '[:]' + _h16, _ipv4address);

    var ipv6address = ABNF.alternate(
        ABNF.repeat(_h16 + '[:]', 6, 6) + _ls32,
        '[:][:]' + ABNF.repeat(_h16 + '[:]', 5, 5) + _ls32,
        ABNF.optional(_h16) + '[:][:]' + ABNF.repeat(_h16 + '[:]', 4, 4) + _ls32,
        ABNF.optional(ABNF.repeat(_h16 + '[:]', 0, 1) + _h16) + '[:][:]' + ABNF.repeat(_h16 + '[:]', 3, 3) + _ls32,
        ABNF.optional(ABNF.repeat(_h16 + '[:]', 0, 2) + _h16) + '[:][:]' + ABNF.repeat(_h16 + '[:]', 2, 2) + _ls32,
        ABNF.optional(ABNF.repeat(_h16 + '[:]', 0, 3) + _h16) + '[:][:]' + _h16 + '[:]' + _ls32,
        ABNF.optional(ABNF.repeat(_h16 + '[:]', 0, 4) + _h16) + '[:][:]' + _ls32,
        ABNF.optional(ABNF.repeat(_h16 + '[:]', 0, 5) + _h16) + '[:][:]' + _h16,
        ABNF.optional(ABNF.repeat(_h16 + '[:]', 0, 6) + _h16) + '[:][:]'
        );

    var unreserved = ABNF.ALPHA + ABNF.DIGIT + '\\-._~';
    var subDelims = '!$&\'()*+,;=';
    var ipvfuture = 'v' + ABNF.repeat(ABNF.HEXDIG, 1) + '[.]' + ABNF.repeat(unreserved + subDelims + ':', 1);
    var ipliteral = '\\[' + ABNF.alternate(ipv6address, ipvfuture) + '\\]';


    /*
   pct-encoded    = "%" HEXDIG HEXDIG


   ucschar        = %xA0-D7FF / %xF900-FDCF / %xFDF0-FFEF
                  / %x10000-1FFFD / %x20000-2FFFD / %x30000-3FFFD
                  / %x40000-4FFFD / %x50000-5FFFD / %x60000-6FFFD
                  / %x70000-7FFFD / %x80000-8FFFD / %x90000-9FFFD
                  / %xA0000-AFFFD / %xB0000-BFFFD / %xC0000-CFFFD
                  / %xD0000-DFFFD / %xE1000-EFFFD


   iunreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~" / ucschar
   iuserinfo      = *( iunreserved / pct-encoded / sub-delims / ":" )
   ireg-name      = *( iunreserved / pct-encoded / sub-delims )

   ihost          = IP-literal / _ipv4address / ireg-name

   port           = *DIGIT

   iauthority     = [ iuserinfo "@" ] ihost [ ":" port ]

   scheme         = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
  */

    var pctEncoded = '%' + ABNF.makeClass(ABNF.HEXDIG) + ABNF.makeClass(ABNF.HEXDIG);

    // XXX don't know how to access the full range...
    var ucschar =
        '\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF'; /*+
   '\\u10000-\\u1FFFD\\u20000-\\u2FFFD\\u30000-\\u3FFFD' +
   '\\u40000-\\u4FFFD\\u50000-\\u5FFFD\\u60000-\\u6FFFD' +
   '\\u70000-\\u7FFFD\\u80000-\\u8FFFD\\u90000-\\u9FFFD' +
   '\\uA0000-\\uAFFFD\\uB0000-\\uBFFFD\\uC0000-\\uCFFFD' +
   '\\uD0000-\\uDFFFD\\uE1000-\\uEFFFD'*/

    //var ucschar = '\\uA0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF';

    // User info
    var iunreserved = ABNF.ALPHA + ABNF.DIGIT + '\\-._~' + ucschar;
    var iuserinfo = ABNF.repeat(ABNF.alternate(iunreserved + subDelims + ':', pctEncoded));
    var iregName = ABNF.repeat(ABNF.alternate(iunreserved + subDelims, pctEncoded));

    // Host
    var ihost = ABNF.alternate(ipliteral, _ipv4address, iregName);
    var port = ABNF.repeat(ABNF.makeClass(ABNF.DIGIT));

    // Auth
    var iauthority = ABNF.optional('(' + iuserinfo + ')@') + '(' + ihost + ')' + ABNF.optional('[:](' + port + ')');

    // Scheme... the easy bits
    var scheme = ABNF.makeClass(ABNF.ALPHA) + ABNF.repeat(ABNF.ALPHA + ABNF.DIGIT + '+.\\-');



    /*

   iprivate       = %xE000-F8FF / %xF0000-FFFFD / %x100000-10FFFD
   ipchar         = iunreserved / pct-encoded / sub-delims / ":"
                  / "@"
   iquery         = *( ipchar / iprivate / "/" / "?" )
   ifragment      = *( ipchar / "/" / "?" )
  */

    // Fragment and query. XXXdmp Astral here? Is it actually working?
    var iprivate = '\\uE000-\\uF8FF' /* + '\\uF0000-\\uFFFFD\\u100000-\\u10FFFD'*/;
    var ipchar = ABNF.alternate(iunreserved + subDelims + ':@', pctEncoded);
    var iquery = ABNF.repeat(ABNF.alternate(ipchar, iprivate + '\\/?'));
    var ifragment = ABNF.repeat(ABNF.alternate(ipchar, '\\/?'));

    /*
   isegment       = *ipchar
   isegment-nz    = 1*ipchar
   isegment-nz-nc = 1*( iunreserved / pct-encoded / sub-delims
                        / "@" )
                  ; non-zero-length segment without any colon ":"

   ipath-empty    = 0<ipchar>
   ipath-abempty  = *( "/" isegment )
   ipath-absolute = "/" [ isegment-nz *( "/" isegment ) ]
   ipath-noscheme = isegment-nz-nc *( "/" isegment )
   ipath-rootless = isegment-nz *( "/" isegment )

   ihier-part     = "//" iauthority ipath-abempty
                  / ipath-absolute
                  / ipath-rootless
                  / ipath-empty

   irelative-ref  = irelative-part [ "?" iquery ] [ "#" ifragment ]

   irelative-part = "//" iauthority ipath-abempty
                       / ipath-absolute
                  / ipath-noscheme
                  / ipath-empty
  */

    // Paths
    var isegment = ABNF.repeat(ipchar);
    var isegmentNz = ABNF.repeat(ipchar, 1);
    var isegmentNzNc = ABNF.repeat(ABNF.alternate(iunreserved + subDelims + '@', pctEncoded), 1);

    var ipathEmpty = '';//'.{0}'; // errrrr... houston... 0<ipchar> wtf?
    var ipathAbempty = ABNF.repeat('\\/' + isegment);
    var ipathAbsolute = '\\/' + ABNF.optional(isegmentNz + ipathAbempty);
    var ipathNoscheme = isegmentNzNc + ipathAbempty;
    var ipathRootless = isegmentNz + ipathAbempty;

    var ihierPart = ABNF.alternate('\\/\\/' + iauthority + '(' + ipathAbempty + ')', '(' + ipathAbsolute + ')',
        '(' + ipathRootless + ')', ipathEmpty);


    var irelativePart = ABNF.alternate('\\/\\/' + iauthority + '(' + ipathAbempty + ')', '(' + ipathAbsolute + ')',
        '(' + ipathNoscheme + ')', ipathEmpty);
    var irelativeRef = irelativePart + ABNF.optional('[?](' + iquery + ')') + ABNF.optional('#(' + ifragment + ')');

    var iri = '(' + scheme + ')[:]' + ihierPart + '(?:[?](' + iquery + '))?(?:#(' + ifragment + '))?';


    /*


   IRI            = scheme ":" ihier-part [ "?" iquery ]
                         [ "#" ifragment ]

   IRI-reference  = IRI / irelative-ref

   absolute-IRI   = scheme ":" ihier-part [ "?" iquery ]




   ipath          = ipath-abempty   ; begins with "/" or is empty
                  / ipath-absolute  ; begins with "/" but not "//"
                  / ipath-noscheme  ; begins with a non-colon segment
                  / ipath-rootless  ; begins with a segment
                  / ipath-empty     ; zero characters


   reserved       = gen-delims / sub-delims
   gen-delims     = ":" / "/" / "?" / "#" / "[" / "]" / "@"

  // genDelims = ':\\/?#[]@';
  // reserved = '[' + genDelims + subDelims + ']';
  */


    var reg = new RegExp('^' + ABNF.alternate(iri, irelativeRef) + '$');

    this.IRI = new (function() {

      // Some helpers tokens to be used by other grammars out of here (HTTP)
      // Almost an iri, without fragment neither matching
      this.ABSOLUTE_IRI = scheme + '[:]' + ABNF.alternate('\\/\\/' + iauthority + ipathAbempty, ipathAbsolute,
          ipathRootless, ipathEmpty) + '(?:[?]' + iquery + ')?';

      // Absolute path
      this.ABSOLUTE_PATH = ipathAbsolute;

      /**
     * Use this to build-up a regexp able to parse IRIs.
     * If used non-globally, will return separate matches for scheme,
     * user, host, port, path, query and fragments parts.
     *
     * @memberof Mingus.grammar.IRI
     * @name IRI_REFERENCE
     * @kind member
     * @type String
     * @static
     * @constant
     */
      this.IRI_REFERENCE = ABNF.alternate(iri, irelativeRef);

      /**
     * Parses IRI and returns a prepped object, if this is a valid IRI, undefined otherwise.
     * Note that at this time, no normalization is made.
     *
     * @memberof Mingus.grammar.IRI
     * @name parse
     * @static
     * @kind function
     * @param  {String} someStringIRI The IRI to split-up.
     * @return {Object} The object representing the IRI (scheme, user, host, port, path, query, fragment).
     */
      this.parse = function(someStringIRI) {
        var r = someStringIRI.match(reg);
        var e;
        r.shift();
        if (r) {
          e = {
            scheme: r.shift(),
            user: r.shift(),
            host: r.shift(),
            port: r.shift()
          };
          var p1 = r.shift(), p2 = r.shift(), p3 = r.shift();
          e.path = p1 ? p1 : (p2 ? p2 : p3);
          e.query = r.shift();
          e.fragment = r.shift();

          if (!e.scheme) {
            e.user = r.shift();
            e.host = r.shift();
            e.port = r.shift();
            p1 = r.shift();
            p2 = r.shift();
            p3 = r.shift();
            e.path = p1 ? p1 : (p2 ? p2 : p3);
            e.query = r.shift();
            e.fragment = r.shift();
          }
        }
        // 5, 6, 7 -> merge
        return e;
      };
    })();

  }).apply(Mingus.grammar, [Mingus.grammar.ABNF]);

})();

/**
 * Basic utility class providing regexp atoms for http (headers).
 *
 * @file
 * @summary Provides basic regexps to parse http.
 * @see http://tools.ietf.org/html/rfc2616.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/HTTP.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

/**
 * @namespace
 * @name Mingus.grammar.HTTP
 * @requires Mingus.grammar.ABNF
 * @requires Mingus.grammar.IRI
 */

/**
 * A simple method to get an object from a block of HTTP headers
 * @name Mingus.grammar.HTTP.parseHeaders
 * @function
 * @param {String} message The string to be parsed.
 * @returns {Object} The parsed headers
 */

/**
 * @namespace
 * @summary A subclass to handle the parsing of digest headers.
 * @name Mingus.grammar.HTTP.digest
 */

/**
 * @summary A method to parse wwwauthenticate headers
 * @function
 * @name Mingus.grammar.HTTP.digest.parse
 * @param  {String} message The header value to be parsed.
 * @returns {Object} The parsed result
 */

(function() {
  /*global Mingus*/
  'use strict';

  // A simple helper to build case insensitive classes from a given string
  // XXX beware this will break on code points for ex - this is meant for *plain alphanum strings and such*
  var laxCase = function(word) {
    var c = '';
    for (var i = 0; i < word.length; i++) {
      if (/[a-z]/i.test(word.charAt(i)))
        c += '[' + word.charAt(i).toLowerCase() + word.charAt(i).toUpperCase() + ']';
      else
        c += word.charAt(i);
    }
    return c;
  };

  (function(ABNF, IRI) {
    /*
The following are the same as ABNF:
       OCTET          = <any 8-bit sequence of data>
       UPALPHA        = <any US-ASCII uppercase letter "A".."Z">
       LOALPHA        = <any US-ASCII lowercase letter "a".."z">
       ALPHA          = UPALPHA | LOALPHA
       DIGIT          = <any US-ASCII digit "0".."9">
       <">            = <US-ASCII double-quote mark (34)>
       CR             = <US-ASCII CR, carriage return (13)>
       LF             = <US-ASCII LF, linefeed (10)>
       SP             = <US-ASCII SP, space (32)>
       HT             = <US-ASCII HT, horizontal-tab (9)>
       CRLF           = CR LF
       HEX            = "A" | "B" | "C" | "D" | "E" | "F"
                      | "a" | "b" | "c" | "d" | "e" | "f" | DIGIT
       CTL            = <any US-ASCII control character
                        (octets 0 - 31) and DEL (127)>
    */

    /*
  The following are new or introduce a difference

       CHAR           = <any US-ASCII character (octets 0 - 127)>
       LWS            = [CRLF] 1*( SP | HT )
       TEXT           = <any OCTET except CTLs,
                        but including LWS>

   A CRLF is allowed in the definition of TEXT only as part of a header
   field continuation. It is expected that the folding LWS will be
   replaced with a single SP before interpretation of the TEXT value.

   Hexadecimal numeric characters are used in several protocol elements.

    */

    var CHAR = '\\x00' + ABNF.CHAR;
    var LWS = ABNF.optional(ABNF.CRLF) + ABNF.repeat(ABNF.alternate(ABNF.SP, ABNF.HTAB), 1);
    var TEXT = ABNF.makeClass('\\x20-\\x7E\\x80-\\xFF') + ABNF.repeat(ABNF.optional(LWS) +
        ABNF.repeat('\\x20-\\x7E\\x80-\\xFF', 1));

    // HTTP specific repeatable stance with LWS coma intertwingled
    var hashRule = function(base) {
      return ABNF.repeat(LWS) + base +
          ABNF.repeat(ABNF.repeat(LWS) + ',' + ABNF.repeat(LWS) + base);
    };

    // Literals all are case-insensitive
    // Except where noted otherwise, linear white space (LWS) can be included
    // between any two adjacent words (token or quoted-string), and
    // between adjacent words and separators, without changing the
    // interpretation of a field. At least one delimiter (LWS and/or
    // separators) MUST exist between any two tokens (for the definition
    // of "token" below), since they would otherwise be interpreted as a
    // single token.


    /*
       token          = 1*<any CHAR except CTLs or separators>
       separators     = "(" | ")" | "<" | ">" | "@"
                      | "," | ";" | ":" | "\" | <">
                      | "/" | "[" | "]" | "?" | "="
                      | "{" | "}" | SP | HT

    */
    var separators = '[()<>@,;:\\\\"/\\[\\]?={}' + ABNF.SP + ABNF.HTAB + ']';
    var token = ABNF.repeat('\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2E\\x30-\\x39\\x41-\\x5A\\x5E-\\x7A\\x7C\\x7E', 1);

    /*
   Comments can be included in some HTTP header fields by surrounding
   the comment text with parentheses. Comments are only allowed in
   fields containing "comment" as part of their field value definition.
   In all other fields, parentheses are considered part of the field
   value.

       comment        = "(" *( ctext | quoted-pair | comment ) ")"
       ctext          = <any TEXT excluding "(" and ")">

   A string of text is parsed as a single word if it is quoted using
   double-quote marks.

    */

    // XXX implement me

    /*

       quoted-pair    = "\" CHAR
       qdtext         = <any TEXT except <">>
       quoted-string  = ( <"> *(qdtext | quoted-pair ) <"> )
    */

    var quotedPair = '\\\\' + ABNF.makeClass(CHAR);
    var qdtext = ABNF.makeClass('\\x20\\x21\\x23-\\x7E\\x80-\\xFF') + ABNF.repeat(ABNF.optional(LWS) +
        ABNF.repeat('\\x20\\x21\\x23-\\x7E\\x80-\\xFF', 1));
    var quotedString = '"' + ABNF.repeat(ABNF.alternate(qdtext, quotedPair)) + '"';


    /*
       HTTP-Version   = "HTTP" "/" 1*DIGIT "." 1*DIGIT
    */

    // var HTTPVersion = 'HTTP\\/' + ABNF.repeat(ABNF.DIGIT, 1) + '[.]' + ABNF.repeat(ABNF.DIGIT, 1);

    /*
       field-content  = <the OCTETs making up the field-value
                        and consisting of either *TEXT or combinations
                        of token, separators, and quoted-string>
       field-value    = *( field-content | LWS )
       field-name     = token
       message-header = field-name ":" [ field-value ]
    */

    var fieldContent = ABNF.alternate(TEXT, ABNF.repeat(ABNF.alternate(token, separators, quotedString)));
    var fieldValue = ABNF.repeat(ABNF.alternate(LWS, fieldContent));
    var fieldName = token;
    var messageHeader = '(' + fieldName + '):(' + fieldValue + ')';

    // A regexp matching headers
    var headersMatcher = new RegExp(messageHeader + ABNF.makeClass(ABNF.CRLF), 'g');
    // A folding regexp to clean-up values
    var unfold = new RegExp('(' + ABNF.repeat(LWS, 1) + ')', 'g');

    this.HTTP = new (function() {
      // This method is meant to parse headers
      this.parseHeaders = function(message) {
        var result, key, value, ret = [];
        while (headersMatcher.lastIndex < message.length && (result = headersMatcher.exec(message))) {
          value = result.pop();
          // Unfold value and strip
          // XXX Some values may support specific grammar processing - which is beyond scope for now
          value = value.replace(unfold, ' ').trim();
          key = result.pop().toLowerCase();
          ret.push({key: key, value: value});
        }
        headersMatcher.lastIndex = 0;
        return ret;
      };


      // Specific headers parsing
      // Digest
      // XXX rename to WWWAuthenticate
      this.digest = new (function() {
        this.ALGORITHM = {
          MD5: 'md5',
          MD5_SESS: 'md5-sess',
          UNKNOWN: token
        };
        this.QOP = {
          AUTH: 'auth',
          AUTH_INT: 'auth-int',
          UNKNOWN: token
        };

        var defAlgorithms = [laxCase(this.ALGORITHM.MD5), laxCase(this.ALGORITHM.MD5_SESS), this.ALGORITHM.UNKNOWN];
        var defQops = [laxCase(this.QOP.AUTH), laxCase(this.QOP.AUTH_INT), this.QOP.UNKNOWN];

        // Shortcut to match the string inside
        var inQuotedString = '"(' + ABNF.repeat(ABNF.alternate(qdtext, quotedPair)) + ')"';
        // Generic auth parameter
        var authParam = '(' + token + ')=' + ABNF.alternate('(' + token + ')', inQuotedString);

        // QOP (lax)
        var qopValue = ABNF.alternate.apply(ABNF, defQops);
        var qopOptions = '(' + laxCase('qop') + ')="(' + hashRule(qopValue) + ')"';

        // Algorithm (be lax, and use the definitions)
        var algorithmValue = ABNF.alternate.apply(ABNF, defAlgorithms);
        var algorithm = '(' + laxCase('algorithm') + ')=(?:(' + algorithmValue + ')|"(' + algorithmValue + ')")';

        // Stale (lax)
        var stale = '(' + laxCase('stale') + ')=' +
            ABNF.alternate(
            '(' + laxCase('true') + '|' + laxCase('false') + ')',
            '"(' + laxCase('true') + '|' + laxCase('false') + ')"'
            );
        // Opaque
        var opaque = '(' + laxCase('opaque') + ')=' + inQuotedString;
        // Nonce
        var nonce = '(' + laxCase('nonce') + ')=' + inQuotedString;
        // Domain
        var uri = ABNF.alternate(IRI.ABSOLUTE_IRI, IRI.ABSOLUTE_PATH);
        var domain = '(' + laxCase('domain') + ')="' + uri + ABNF.repeat(ABNF.repeat(ABNF.SP, 1), uri) + '"';
        // Realm
        var realm = '(' + laxCase('realm') + ')=' + inQuotedString + '"';

        //      ( *LWS element *( *LWS "," *LWS element ))

        var digestChallenge = ABNF.optional(LWS) + ABNF.alternate(opaque, nonce, stale, domain, realm, algorithm,
            qopOptions, authParam) + ABNF.optional(LWS);//);

        // Digest nonce="1322498516.563854:C914:065ab6443338bf38d97ce187c0b77579", realm="dev@roxee", algorithm="MD5",
        // opaque="313305622417105276632820270567935396659", qop="auth", stale="false"
        this.parse = function(message) {
          var ret = {
            stale: false,
            qop: '',
            algorithm: '',
            domain: null
          };

          var matcher = new RegExp('^Digest', 'g');

          var result = matcher.exec(message);
          if (result) {
            var s = matcher.lastIndex;
            // This is very lax parsing, which is pretty much OK
            matcher = new RegExp(digestChallenge + '(?:,)?', 'g');
            matcher.lastIndex = s;
            var key, value;
            while (matcher.lastIndex < message.length && (result = matcher.exec(message))) {
              value = key = null;
              do {
                value = result.pop();
              }while (!value);
              do {
                key = result.pop();
              }while (!key);
              ret[key.toLowerCase()] = value;
            }
            matcher.lastIndex = 0;
          }

          ret.stale = (ret.stale.toLowerCase() == 'true') ? true : false;
          ret.qop = ret.qop.toLowerCase();
          ret.algorithm = ret.algorithm.toLowerCase();
          ret.domain = ret.domain ? ret.domain.split(new RegExp(ABNF.repeat(ABNF.SP, 1))) : [];
          return ret;
        };

      })();
    })();
  }).apply(Mingus.grammar, [Mingus.grammar.ABNF, Mingus.grammar.IRI]);

})();

/*

4.5 General Header Fields

   There are a few header fields which have general applicability for
   both request and response messages, but which do not apply to the
   entity being transferred. These header fields apply only to the



Fielding, et al.            Standards Track                    [Page 34]

RFC 2616                        HTTP/1.1                       June 1999


   message being transmitted.

       general-header = Cache-Control            ; Section 14.9
                      | Connection               ; Section 14.10
                      | Date                     ; Section 14.18
                      | Pragma                   ; Section 14.32
                      | Trailer                  ; Section 14.40
                      | Transfer-Encoding        ; Section 14.41
                      | Upgrade                  ; Section 14.42
                      | Via                      ; Section 14.45
                      | Warning                  ; Section 14.46

   General-header field names can be extended reliably only in
   combination with a change in the protocol version. However, new or
   experimental header fields may be given the semantics of general
   header fields if all parties in the communication recognize them to
   be general-header fields. Unrecognized header fields are treated as
   entity-header fields.

*/


/*
6 Response
   After receiving and interpreting a request message, a server responds
   with an HTTP response message.

       Response      = Status-Line               ; Section 6.1
                       *(( general-header        ; Section 4.5
                        | response-header        ; Section 6.2
                        | entity-header ) CRLF)  ; Section 7.1
                       CRLF
                       [ message-body ]          ; Section 7.2

6.1 Status-Line
   The first line of a Response message is the Status-Line, consisting
   of the protocol version followed by a numeric status code and its
   associated textual phrase, with each element separated by SP
   characters. No CR or LF is allowed except in the final CRLF sequence.

       Status-Line = HTTP-Version SP Status-Code SP Reason-Phrase CRLF

6.1.1 Status Code and Reason Phrase
   The Status-Code element is a 3-digit integer result code of the
   attempt to understand and satisfy the request. These codes are fully
   defined in section 10. The Reason-Phrase is intended to give a short
   textual description of the Status-Code. The Status-Code is intended
   for use by automata and the Reason-Phrase is intended for the human
   user. The client is not required to examine or display the Reason-
   Phrase.

   The first digit of the Status-Code defines the class of response. The
   last two digits do not have any categorization role. There are 5
   values for the first digit:

      - 1xx: Informational - Request received, continuing process

      - 2xx: Success - The action was successfully received,
        understood, and accepted

      - 3xx: Redirection - Further action must be taken in order to
        complete the request

      - 4xx: Client Error - The request contains bad syntax or cannot
        be fulfilled

      - 5xx: Server Error - The server failed to fulfill an apparently
        valid request

   The individual values of the numeric status codes defined for
   HTTP/1.1, and an example set of corresponding Reason-Phrase's, are
   presented below. The reason phrases listed here are only
   recommendations -- they MAY be replaced by local equivalents without
   affecting the protocol.

      Status-Code    =
            "100"  ; Section 10.1.1: Continue
          | "101"  ; Section 10.1.2: Switching Protocols
          | "200"  ; Section 10.2.1: OK
          | "201"  ; Section 10.2.2: Created
          | "202"  ; Section 10.2.3: Accepted
          | "203"  ; Section 10.2.4: Non-Authoritative Information
          | "204"  ; Section 10.2.5: No Content
          | "205"  ; Section 10.2.6: Reset Content
          | "206"  ; Section 10.2.7: Partial Content
          | "300"  ; Section 10.3.1: Multiple Choices
          | "301"  ; Section 10.3.2: Moved Permanently
          | "302"  ; Section 10.3.3: Found
          | "303"  ; Section 10.3.4: See Other
          | "304"  ; Section 10.3.5: Not Modified
          | "305"  ; Section 10.3.6: Use Proxy
          | "307"  ; Section 10.3.8: Temporary Redirect
          | "400"  ; Section 10.4.1: Bad Request
          | "401"  ; Section 10.4.2: Unauthorized
          | "402"  ; Section 10.4.3: Payment Required
          | "403"  ; Section 10.4.4: Forbidden
          | "404"  ; Section 10.4.5: Not Found
          | "405"  ; Section 10.4.6: Method Not Allowed
          | "406"  ; Section 10.4.7: Not Acceptable
          | "407"  ; Section 10.4.8: Proxy Authentication Required
          | "408"  ; Section 10.4.9: Request Time-out
          | "409"  ; Section 10.4.10: Conflict
          | "410"  ; Section 10.4.11: Gone
          | "411"  ; Section 10.4.12: Length Required
          | "412"  ; Section 10.4.13: Precondition Failed
          | "413"  ; Section 10.4.14: Request Entity Too Large
          | "414"  ; Section 10.4.15: Request-URI Too Large
          | "415"  ; Section 10.4.16: Unsupported Media Type
          | "416"  ; Section 10.4.17: Requested range not satisfiable
          | "417"  ; Section 10.4.18: Expectation Failed
          | "500"  ; Section 10.5.1: Internal Server Error
          | "501"  ; Section 10.5.2: Not Implemented
          | "502"  ; Section 10.5.3: Bad Gateway
          | "503"  ; Section 10.5.4: Service Unavailable
          | "504"  ; Section 10.5.5: Gateway Time-out
          | "505"  ; Section 10.5.6: HTTP Version not supported
          | extension-code

      extension-code = 3DIGIT
      Reason-Phrase  = *<TEXT, excluding CR, LF>

   HTTP status codes are extensible. HTTP applications are not required
   to understand the meaning of all registered status codes, though such
   understanding is obviously desirable. However, applications MUST
   understand the class of any status code, as indicated by the first
   digit, and treat any unrecognized response as being equivalent to the
   x00 status code of that class, with the exception that an
   unrecognized response MUST NOT be cached. For example, if an
   unrecognized status code of 431 is received by the client, it can
   safely assume that there was something wrong with its request and
   treat the response as if it had received a 400 status code. In such
   cases, user agents SHOULD present to the user the entity returned
   with the response, since that entity is likely to include human-
   readable information which will explain the unusual status.

6.2 Response Header Fields

   The response-header fields allow the server to pass additional
   information about the response which cannot be placed in the Status-
   Line. These header fields give information about the server and about
   further access to the resource identified by the Request-URI.

       response-header = Accept-Ranges           ; Section 14.5
                       | Age                     ; Section 14.6
                       | ETag                    ; Section 14.19
                       | Location                ; Section 14.30
                       | Proxy-Authenticate      ; Section 14.33



Fielding, et al.            Standards Track                    [Page 41]

RFC 2616                        HTTP/1.1                       June 1999


                       | Retry-After             ; Section 14.37
                       | Server                  ; Section 14.38
                       | Vary                    ; Section 14.44
                       | WWW-Authenticate        ; Section 14.47

   Response-header field names can be extended reliably only in
   combination with a change in the protocol version. However, new or
   experimental header fields MAY be given the semantics of response-
   header fields if all parties in the communication recognize them to
   be response-header fields. Unrecognized header fields are treated as
   entity-header fields.

*/


/*

if(data){
            var result, name, content;
            while((parser.lastIndex < data.length) && (result = (parser.exec(data)))){
              content = result.pop();
              name = result.pop();
              console.debug('TPL > add', name);

              SC.TEMPLATES[name] = SC.Handlebars.compile(content);

            }

*/


/*


  var method = ABNF.alternate("OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT", token);
  var requestLine = method + ABNF.class(SP) + requestURI + ABNF.class(SP) + HTTPVersion + ABNF.class(CRLF);
  var startLine = ABNF.alternate(requestLine, statusLine);
  var genericMessage = startLine + ABNF.repeat(messageHeader + ABNF.class(CRLF)) + ABNF.class(CRLF) +
  ABNF.optional(messageBody);

*/

/*



       comment        = "(" *( ctext | quoted-pair | comment ) ")"
       ctext          = <any TEXT excluding "(" and ")">




      HTTP-Version   = "HTTP" "/" 1*DIGIT "." 1*DIGIT


Method         = "OPTIONS"                ; Section 9.2
                      | "GET"                    ; Section 9.3
                      | "HEAD"                   ; Section 9.4
                      | "POST"                   ; Section 9.5
                      | "PUT"                    ; Section 9.6
                      | "DELETE"                 ; Section 9.7
                      | "TRACE"                  ; Section 9.8
                      | "CONNECT"                ; Section 9.9
                      | extension-method
       extension-method = token

Request-URI    = "*" | absoluteURI | abs_path | authority
Request-Line   = Method SP Request-URI SP HTTP-Version CRLF
start-line      = Request-Line | Status-Line




        generic-message = start-line
                          *(message-header CRLF)
                          CRLF
                          [ message-body ]


*/




/**
 * Basic helper to add md5 capabilities to javascript.
 *
 * @file
 * @summary MD5 support.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/crypto/md5.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

(function() {
  /*jshint maxstatements:69*/
  /*global Mingus, unescape*/
  'use strict';

  var md5cycle = function(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

  };

  var cmn = function(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  };

  var ff = function(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  };

  var gg = function(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  };

  var hh = function(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  };

  var ii = function(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  };

  var md51 = function(s) {
    // XXX Crap patch necessary to have the stuff behave when dealing with utf8
    if (/[^\x00-\x79]/.test(s)) {
      s = unescape(encodeURI(s));
    }
    // XXX
    // var txt = '';
    var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  };

  /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
  var md5blk = function(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) +
          (s.charCodeAt(i + 1) << 8) +
          (s.charCodeAt(i + 2) << 16) +
          (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  };

  var hexChr = '0123456789abcdef'.split('');

  var rhex = function(n) {
    var s = '', j = 0;
    for (; j < 4; j++)
      s += hexChr[(n >> (j * 8 + 4)) & 0x0F] +
          hexChr[(n >> (j * 8)) & 0x0F];
    return s;
  };

  var hex = function(x) {
    for (var i = 0; i < x.length; i++)
      x[i] = rhex(x[i]);
    return x.join('');
  };

  /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */

  var add32 = function(a, b) {
    return (a + b) & 0xFFFFFFFF;
  };

  if (hex(md51('hello')) != '5d41402abc4b2a76b9719d911017c592') {
    add32 = function(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF),
          msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    };
  }

  /**
   * A simple singleton providing md5 functionality to javascript.
   * Note this is an almost unaltered rip of Myers (released under an unknown license). All credits go to him.
   *
   * @namespace
   * @name Mingus.crypto.md5
   * @see  http://www.myersdaily.org/joseph/javascript/md5-text.html
   */

  /**
   * Performs a md5 of a given string.
   * @function
   * @name Mingus.crypto.md5.crypt
   * @param {String} str A string to hash.
   * @returns {String} The md5 hash of the string.
   */

  Mingus.crypto.md5 = {
    crypt: function(str) {
      return hex(md51(str));
    }
  };

})();

/**
 * @file
 * @summary Basic helper class to help converting various entities to their utf conterparts.
 *
 * @author WebItUp
 * @version 0.3.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/converters/entity.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

(function() {
  /*global Mingus*/
  'use strict';

  var htmlEntityList = {
    nbsp: 160,
    iexcl: 161,
    cent: 162,
    pound: 163,
    curren: 164,
    yen: 165,
    brvbar: 166,
    sect: 167,
    uml: 168,
    copy: 169,
    ordf: 170,
    laquo: 171,
    not: 172,
    shy: 173,
    reg: 174,
    macr: 175,
    deg: 176,
    plusmn: 177,
    sup2: 178,
    sup3: 179,
    acute: 180,
    micro: 181,
    para: 182,
    middot: 183,
    cedil: 184,
    sup1: 185,
    ordm: 186,
    raquo: 187,
    frac14: 188,
    frac12: 189,
    frac34: 190,
    iquest: 191,
    Agrave: 192,
    Aacute: 193,
    Acirc: 194,
    Atilde: 195,
    Auml: 196,
    Aring: 197,
    AElig: 198,
    Ccedil: 199,
    Egrave: 200,
    Eacute: 201,
    Ecirc: 202,
    Euml: 203,
    Igrave: 204,
    Iacute: 205,
    Icirc: 206,
    Iuml: 207,
    ETH: 208,
    Ntilde: 209,
    Ograve: 210,
    Oacute: 211,
    Ocirc: 212,
    Otilde: 213,
    Ouml: 214,
    times: 215,
    Oslash: 216,
    Ugrave: 217,
    Uacute: 218,
    Ucirc: 219,
    Uuml: 220,
    Yacute: 221,
    THORN: 222,
    szlig: 223,
    agrave: 224,
    aacute: 225,
    acirc: 226,
    atilde: 227,
    auml: 228,
    aring: 229,
    aelig: 230,
    ccedil: 231,
    egrave: 232,
    eacute: 233,
    ecirc: 234,
    euml: 235,
    igrave: 236,
    iacute: 237,
    icirc: 238,
    iuml: 239,
    eth: 240,
    ntilde: 241,
    ograve: 242,
    oacute: 243,
    ocirc: 244,
    otilde: 245,
    ouml: 246,
    divide: 247,
    oslash: 248,
    ugrave: 249,
    uacute: 250,
    ucirc: 251,
    uuml: 252,
    yacute: 253,
    thorn: 254,
    yuml: 255,
    // Symbols: mathematical symbols and Greek letters
    // See the HTML4.0 spec for this list in it's DTD form
    fnof: 402,
    Alpha: 913,
    Beta: 914,
    Gamma: 915,
    Delta: 916,
    Epsilon: 917,
    Zeta: 918,
    Eta: 919,
    Theta: 920,
    Iota: 921,
    Kappa: 922,
    Lambda: 923,
    Mu: 924,
    Nu: 925,
    Xi: 926,
    Omicron: 927,
    Pi: 928,
    Rho: 929,
    Sigma: 931,
    Tau: 932,
    Upsilon: 933,
    Phi: 934,
    Chi: 935,
    Psi: 936,
    Omega: 937,
    alpha: 945,
    beta: 946,
    gamma: 947,
    delta: 948,
    epsilon: 949,
    zeta: 950,
    eta: 951,
    theta: 952,
    iota: 953,
    kappa: 954,
    lambda: 955,
    mu: 956,
    nu: 957,
    xi: 958,
    omicron: 959,
    pi: 960,
    rho: 961,
    sigmaf: 962,
    sigma: 963,
    tau: 964,
    upsilon: 965,
    phi: 966,
    chi: 967,
    psi: 968,
    omega: 969,
    thetasym: 977,
    upsih: 978,
    piv: 982,
    bull: 8226,
    hellip: 8230,
    prime: 8242,
    Prime: 8243,
    oline: 8254,
    frasl: 8260,
    weierp: 8472,
    image: 8465,
    real: 8476,
    trade: 8482,
    alefsym: 8501,
    larr: 8592,
    uarr: 8593,
    rarr: 8594,
    darr: 8595,
    harr: 8596,
    crarr: 8629,
    lArr: 8656,
    uArr: 8657,
    rArr: 8658,
    dArr: 8659,
    hArr: 8660,
    forall: 8704,
    part: 8706,
    exist: 8707,
    empty: 8709,
    nabla: 8711,
    isin: 8712,
    notin: 8713,
    ni: 8715,
    prod: 8719,
    sum: 8721,
    minus: 8722,
    lowast: 8727,
    radic: 8730,
    prop: 8733,
    infin: 8734,
    ang: 8736,
    and: 8743,
    or: 8744,
    cap: 8745,
    cup: 8746,
    'int': 8747,
    there4: 8756,
    sim: 8764,
    cong: 8773,
    asymp: 8776,
    ne: 8800,
    equiv: 8801,
    le: 8804,
    ge: 8805,
    sub: 8834,
    sup: 8835,
    nsub: 8836,
    sube: 8838,
    supe: 8839,
    oplus: 8853,
    otimes: 8855,
    perp: 8869,
    sdot: 8901,
    lceil: 8968,
    rceil: 8969,
    lfloor: 8970,
    rfloor: 8971,
    lang: 9001,
    rang: 9002,
    loz: 9674,
    spades: 9824,
    clubs: 9827,
    hearts: 9829,
    diams: 9830,
    // Markup-significant and internationalization characters
    // See the HTML4.0 spec for this list in it's DTD form
    quot: 34,
    amp: 38,
    lt: 60,
    gt: 62,
    OElig: 338,
    oelig: 339,
    Scaron: 352,
    scaron: 353,
    Yuml: 376,
    circ: 710,
    tilde: 732,
    ensp: 8194,
    emsp: 8195,
    thinsp: 8201,
    zwnj: 8204,
    zwj: 8205,
    lrm: 8206,
    rlm: 8207,
    ndash: 8211,
    mdash: 8212,
    lsquo: 8216,
    rsquo: 8217,
    sbquo: 8218,
    ldquo: 8220,
    rdquo: 8221,
    bdquo: 8222,
    dagger: 8224,
    Dagger: 8225,
    permil: 8240,
    lsaquo: 8249,
    rsaquo: 8250,
    euro: 8364,
    // Navigator entity extensions
    // This block of entities needs to be at the bottom of the list since it
    // contains duplicate Unicode codepoints. The codepoint to entity name
    // mapping

    // apos is from XML
    apos: 39,
    // The capitalized versions are required to handle non-standard input.
    AMP: 38,
    COPY: 169,
    GT: 62,
    LT: 60,
    QUOT: 34,
    REG: 174
  };

  var _killundec = false;

  var callBack = function(str, p1, p2, p3) {
    // Non recognized entities will just be ignored and returned
    var exit = _killundec ? '' : '&' + p1 + p2 + p3 + ';';
    if (p2 && parseInt(p3, 16)) {
      // Hexa
      exit = String.fromCharCode(parseInt(p3, 16));
    } else if (p1 && parseInt(p3, 10)) {
      // Dec
      exit = String.fromCharCode(p3);
    } else if (p3 in htmlEntityList) {
      exit = String.fromCharCode(htmlEntityList[p3]);
    }
    return exit;
  };

  Mingus.converters = Mingus.converters || {};

  /**
   * A couple methods meant to convert/escape/protect stuff.
   *
   * @namespace
   * @name Mingus.converters.entity
   */
  Mingus.converters.entity = {

    /**
     * Decode entity: a function to decode all html and unicode code points
     * entities in a string.
     * BEWARE it will decode escaped XML entities like < > & and quotes as well!
     * Thus, this might break
     *
     * @name Mingus.converters.entity.decodeEntities
     * @function
     * @param {String} entry A string to analyze.
     * @param {Boolean} [killOrphans=false] wether to leave unrecognized entities untouched or erase them.
     * @returns {String} the decoded string
     */
    decodeEntities: function(entry, killOrphans) {
      _killundec = killOrphans;
      // Replace all html, hex and dec unicode entities.
      return entry.replace(/&(?:(#)(x?))?([0-9a-z]+);/gi, callBack);
    },

    /**
     * Safe escape a string for xml consumption.
     *
     * @function
     * @name Mingus.converters.entity.safeXML
     * @param {String} string A string to protect.
     * @param {Boolean} [leaveapos=false] wether to explicitely leave single quotes alone (or not, which is default).
     * @returns {String} the protected string
     */
    safeXML: function(string, leaveapos) {
      string = string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      if (!leaveapos)
        string = string.replace(/'/g, '&apos;');
      return string;
    }
  };

})();

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file This is the "to be embeded" part that communicates postMessages to the frame. Mimicks a standard XHR.
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/ungate.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

/**#nocode+*/

// This is a wrapper for the frame CORS hack that expose a "kind-of" XHR object
// In a better world, that would be hidden behind the standard XHR.
// To do that, we need to wrap so that we can decide on open, and we would need to be
// blocking return function calls that are able to throw down in the frame (like open)

(function() {
  /*jshint browser:true*/
  /*global console, File, Mingus*/
  'use strict';
  Mingus.xhr.gateOpener = new (function() {

    // XXX bien joué Tony!
    // XXX - should implement a timeout to handle frame failure to load
    // This must be adjusted depending on the host...
    var bridgePath = null; // '/1.0/connect/gate/0.6/gate.html';

    var hosts = {};
    this.getBridge = function(host, path) {
      if (!(host in hosts))
        hosts[host] = new Bridger(host, path ? path : bridgePath);
      return new hosts[host]();
    };


    var Bridger = function(frameHost, framePath) {
      frameHost = location.protocol + '//' + frameHost;
      var id = 0;
      var isReady = false;
      var debt = [];
      var ongoing = [];
      var framy;

      // Hook-on
      var msgHook = function(e) {
        /*jshint regexp:false*/
        // Got a ready from the frame
        if (e.data == 'ready') {
          console.debug('                    |G| <- gate is ready');
          // Frame is ready - anby debt there?
          isReady = true;
          for (var x = 0; x < debt.length; x++) {
            debt[x].__postTrigger();
          }
          debt =  [];
          return;
        }

        // Now, this is a real request return
        var myX = ongoing[e.data.id];
        // console.log("Got something from", e.data.id);
        // console.log(myX);
        var ar, y, ti;
        for (var j in e.data) {
          if (j == 'responseHeaders') {
            // XXX need to parse that crap for real
            ar = e.data[j].split('\r\n');
            if (ar.length < 2)
              ar = e.data[j].split('\n');
            for (y = 0; y < ar.length; y++) {
              if (ar[y]) {
                ti = ar[y].match(/^([^:]+)[:]\s*(.+)/);
                ti.shift();
                myX.responseHeaders[ti.shift().toLowerCase()] = ti.shift();
              }
            }
          }else if (j != 'id') {
            myX[j] = e.data[j];
          }
        }
        console.debug('                    |G| <- request ', e.data.id, ' returned', myX);
        myX.onreadystatechange();
      };


      window.addEventListener('message', function(e) {
        if (e.origin != frameHost)
          return false;
        msgHook(e);
      }, false);

      framy = document.createElement('iframe');
      framy.setAttribute('id', '_roxee_frame_hack');
      framy.setAttribute('style', 'width: 0; height: 0; position: absolute; top: -1000px; left: -1000px;');
      framy.setAttribute('src', frameHost + framePath + '#' + document.location.href);

      // Register onload to embed the frame
      (function() {
        try {
          console.debug('                    |G| -> straight construction');
          document.body.appendChild(framy);
        }catch (e) {
          var x = window.onload;
          window.onload = function() {
            console.debug('                    |G| -> onload construction');
            if (x)
              x();
            document.body.appendChild(framy);
          };
        }
      })();

      // Custom "XHR"
      var xhr = function() {
        this.UNSENT = 0;
        this.OPENED = 1;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.DONE = 4;


        var head = {}, method, url;
        var i = ++id;

        this.open = function(m, u) {
          console.debug('                    |G| -> opening', m, u);
          method = m;
          url = u;
        };

        this.send = function(da) {
          // Need to read to an uri...
          if (!('File' in window) || !('Blob' in window)) {
            realSend.apply(this, [da]);
          }else if ((da instanceof File) || (da instanceof Blob)) {
            var _self = this;
            var t = new FileReader();
            t.readAsDataURL(da);
            t.onload = function(e) {
              // console.log("Asynchornous shit");
              realSend.apply(_self, [e.target.result]);
            };
          }else {
            realSend.apply(this, [da]);
          }
        };

        var realSend = function(da) {
          var s = {
            'id': i,
            'method': method,
            'url': url,
            'headers': head,
            'data': da
          };
          // console.log("Will send through the gate", this, s);
          if (isReady) {
            console.debug('                    |G| -> sending now', s);
            ongoing[i] = this;
            framy.contentWindow.postMessage(s, frameHost); // .replace(/^([^:]+:\/\/[^\/]+).*/, '$1')
            // simplePostMessage.postMessage(s, frameHost + framePath, framy.contentWindow);
          }else {
            console.debug('                    |G| -> defering send');
            this.__postTrigger = function() {
              console.debug('                    |G| -> sending after defer', s);
              ongoing[i] = this;
              framy.contentWindow.postMessage(s, frameHost);
              // simplePostMessage.postMessage(s, frameHost + framePath, framy.contentWindow);
            };
            debt.push(this);
          }
          // console.log("Sent through the fate");
        };

        this.setRequestHeader = function(name, value) {
          console.debug('                    |G| -> set header', name, value);
          head[name] = value;
        };

        // These will be altered by the crappy thingie from downstairs
        this.status = undefined;

        this.responseText = undefined;

        this.readyState = undefined;

        this.responseHeaders = {};

        this.getResponseHeader = function(name) {
          console.debug('                    |G| -> get header', name);
          name = name.toLowerCase();
          if (name in this.responseHeaders)
            return this.responseHeaders[name];
          return false;
        };

        this.onreadystatechange = function() {

        };

        this.abort = function() {
          console.debug('                    |G| -> abort');
          // XXX ahem fix that crap
          this.onreadystatechange = function() {};
        };
      };

      return xhr;
    };

  })();

})();


/**#nocode-*/

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file Provides an app key engine.
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/appkey.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */


(function() {
  /*global Mingus*/
  'use strict';

  /**
 * @kind enum
 * @name appKeyErrors
 * @memberof Mingus.xhr
 * @summary Errors spat by the app key manager
 * @type {Int}
 * @constant
 */
  Mingus.xhr.appKeyErrors = {
    /**
   * @description No key was registered for that host
   */
    UNREGISTERED_HOST: 1,
    /**
   * @description Provided date can't be parsed
   */
    UNPARSABLE_DATE: 2
  };


  /**
 * @kind namespace
 * @name appKeyEngine
 * @memberof Mingus.xhr
 * @summary App key engine
 * @description  Appkey engine public API
 * @requires Mingus.crypto.md5
 * @requires Mingus.xhr.appKeyErrors
 */
  Mingus.xhr.appKeyEngine = new (function(err, md5) {
    /**
   * @summary Contains the engine data
   * @description Allows the consumer to set/get all data of the engine and possibly have it persist somewhere.
   * Note there is no consistency check on setting. Up to you to trash the thing...
   * @static
   * @name data
   * @type {Object}
   * @member
   * @memberof Mingus.xhr.appKeyEngine
   */
    this.data = {};

    /**
   * @kind function
   * @name getSignature
   * @memberof Mingus.xhr.appKeyEngine
   * @summary Compute a signature.
   * @param {String} keyId The application keyId.
   * @param {String} secretKey The application secret.
   * @returns {undefined}
   */
    this.getSignature = function(host, path, method) {
      if (!(host in this.data))
        throw new Error(err.UNREGISTERED_HOST);
      var keyId = this.data[host].keyId;
      var secretKey = this.data[host].secretKey;
      var ts = Math.round(new Date().getTime() / 1000) - this.data[host].delta;
      var ha = md5.crypt([keyId, secretKey, ts].join(':'));
      var signature = md5.crypt([method, path, ha].join(':'));
      return 'access Timestamp="' + ts + '", ' +
          'Signature="' + signature + '", ' +
          'KeyId="' + keyId + '", ' +
          'Algorithm="md5"';
    };

    /**
   * @kind function
   * @name setAppKey
   * @memberof Mingus.xhr.appKeyEngine
   * @summary Allows to set the global appkey (no per-host support for now).
   * @param {String} keyId The application keyId.
   * @param {String} secretKey The application secret.
   * @returns {undefined}
   */
    this.setAppKey = function(host, keyId, secretKey) {
      if (!(host in this.data))
        this.data[host] = {delta: 0};
      this.data[host].keyId = keyId;
      this.data[host].secretKey = secretKey;
    };

    /**
   * @kind function
   * @name setAppKey
   * @memberof Mingus.xhr.appKeyEngine
   * @summary Allows to set an external time as to workaround (local) time shifts.
   * @param {String} host A hostname.
   * @param {String} serverDate A parsable date string.
   * @returns {undefined}
   */
    this.setTime = function(host, serverDate) {
      var ts = Date.parse(serverDate) / 1000;
      if (isNaN(ts))
        throw new Error(err.UNPARSABLE_DATE);
      if (!(host in this.data))
        this.data[host] = {};
      this.data[host].delta = Math.round(new Date().getTime() / 1000) - ts;
    };

  })(Mingus.xhr.appKeyErrors, Mingus.crypto.md5);

})();

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file Provides a digest engine.
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/digest.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */

/**
 * A factory to obtain a digest engine for a given host.
 * @kind namespace
 * @summary Digest factory
 * @name digest
 * @memberof Mingus.xhr
 * @requires Mingus.crypto.md5
 * @requires Mingus.grammar.http
 */

/**
 * @description  Allows XHR to get a module (see below)
 * @kind function
 * @static
 * @memberof Mingus.xhr.digest
 * @name getEngine
 * @param {String} host The hostname for which to obtain the module.
 * @returns {Mingus.xhr.digest.Engine} A persistent digest module instance for the given host.
 */

/**
 * @description  Allows the consumer to set/get all data of the engine and have it persist somewhere
 * @memberof Mingus.xhr.digest
 * @kind member
 * @static
 * @name data
 * @type Object
 */

/**
 * @summary A digest module for a given host.
 *
 * @description Allows to obtain a signature given properties - does recycle challenges.
 * Is obtained through the factory.
 *
 * @memberof Mingus.xhr.digest
 * @kind class
 * @name Engine
 * @returns {undefined} This class can't be instanciated directly. You need to call getEngine on the factory.
 * @requires Mingus.crypto.md5
 */

/**
 * @name login
 * @type String
 * @kind member
 * @memberof Mingus.xhr.digest.Engine
 */

/**
 * @summary You can only *set* that. Credentials can't be retrieved.
 * @name password
 * @type String
 * @kind member
 * @memberof Mingus.xhr.digest.Engine
 */

/**
 * @summary You can only *set* that. Credentials can't be retrieved.
 * @name ha1
 * @type String
 * @kind member
 * @memberof Mingus.xhr.digest.Engine
 */

/**
 * @name challenge
 * @type String
 * @kind member
 * @memberof Mingus.xhr.digest.Engine
 */

/**
 * @memberof Mingus.xhr.digest.Engine
 * @name getAuthenticationHeader
 * @kind function
 * @param {String} url The url for which to obtain auth header.
 * @param {String} method The HTTP method that will be used to access the url.
 * @returns {String} The authentication header value to use.
 */


/*global Mingus:true*/
(function(md5, http) {
  'use strict';
  // Private helpers

  // Private helper to build a client nonce
  var generateCnonce = function() {
    return md5.crypt('' + Math.floor(Math.random() * 1000000));
  };

  // Private helper to increment a nc
  var incrementNC = function(nc) {
    var l = nc.length, str = '' + (parseInt(nc, 10) + 1);
    while (str.length < l) {
      str = '0' + str;
    }
    return str;
  };

  // Private helper to generate a HA1
  var generateHA1 = function(log, pass, realm) {
    return md5.crypt(log + ':' + realm + ':' + pass);
  };

  // Private helper to generate a suitable answer string
  var generateResponse = function(ha1, nonce, nc, cnonce, qop, method, url) {
    var ha2 = md5.crypt(method.toUpperCase() + ':' + url);
    return md5.crypt(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2);
  };

  var DigestModule = function() {
    // Login and password accessors
    var _login, _password, _ha1;

    // Challenge accessor
    var _challenge = {};

    // Holding the client nounce - will be generated each time we reset the challenge
    var _cnonce;

    // NC (private)
    var _nc;

    Object.defineProperty(this, 'login', {
      get: function() {
        return _login;
      },
      set: function(log) {
        _login = log;
        // Login change means reseting HA1
        _ha1 = null;
      },
      enumerable: true
    });

    Object.defineProperty(this, 'realm', {
      get: function() {
        return _challenge.realm;
      },
      set: function(value) {
        _challenge.realm = value;
      },
      enumerable: true
    });

    Object.defineProperty(this, 'password', {
      set: function(pass) {
        _password = pass;
        // Password change means reseting HA1
        _ha1 = null;
      },
      enumerable: false
    });

    Object.defineProperty(this, 'ha1', {
      get: function() {
        return _ha1;
      },
      set: function(ha1) {
        _ha1 = ha1;
      },
      enumerable: false
    });

    Object.defineProperty(this, 'challenge', {
      get: function() {
        return _challenge;
      },

      set: function(header) {
        var oldrealm = (_challenge && 'realm' in _challenge) ? _challenge.realm : null;
        var t = http.digest.parse(header);
        // Aggregate onto last challenge info
        for (var i in t) {
          if (t.hasOwnProperty(i))
            _challenge[i] = t[i];
        }

        /*        var oldrealm = (_challenge && 'realm' in _challenge) ? _challenge.realm : null;
        header = header.replace(/^Digest\s?/, '').split(/\s?,\s?/);
        _challenge = {};
        for (var i = 0, ref; i < header.length; i++) {
          ref = header[i].split(/\s?=\s?/);
          _challenge[ref.shift()] = ref.shift().replace(/"/g, '');
        }
        */
        // And... reset the client nonce as well
        _cnonce = generateCnonce();
        // And the nonce count
        _nc = '00000000';
        // And maybe kill the HA1 if the realm actually changed... which obviously means the password will have
        // to be reentered again
        if (_challenge.realm != oldrealm) {
          _ha1 = null;
        }
      },
      enumerable: false
    });

    // And a method to get the answer string for a given url and method
    this.getAuthenticationHeader = function(url, method) {
      // If we don't have a HA1, then it's about time we build one
      if (!_ha1) {
        _ha1 = generateHA1(_login, _password, _challenge.realm);
        // Don't allow for passwords to be saved as soon as we know we won't need them anymore
        _password = null;
      }
      // Increment teh nonce count as well
      _nc = incrementNC(_nc);

      var auth = {
        uri: url,
        response: generateResponse(_ha1, _challenge.nonce, _nc, _cnonce, _challenge.qop, method, url),
        username: _login,
        cnonce: _cnonce,
        realm: _challenge.realm,
        nonce: _challenge.nonce,
        opaque: _challenge.opaque,
        algorithm: _challenge.algorithm,
        qop: _challenge.qop,
        nc: _nc
      };

      return 'Digest ' + Object.keys(auth).map(function(key) {
        return key + '="' + auth[key] + '"';
      }).join(', ');
    };
    /**#@-*/
  };

  this.digest = new (function() {
    // Modules per hosts
    var hosters = this.data = {};

    this.getEngine = function(host) {
      // For us, engine is port independant - authentication is hostname wide
      host = host.replace(/:[0-9]+$/, '');
      if (!(host in hosters))
        hosters[host] = new DigestModule();
      return hosters[host];
    };
    /*
    Object.defineProperty(this, 'data', {
      get: function() {
        return hosters;
      },
      set: function(data) {
        hosters = data;
      },
      enumerable: true
    });
    */

  })();


}).apply(Mingus.xhr, [Mingus.crypto.md5, Mingus.grammar.HTTP]);


/*
   * Allows to sink in some credentials, for a given host
   * @function
   * @param {String} login The user login.
   * @param {String} password The user password.
   * @param {String} host The host for these credentials.
   */
/*
  this.sinkCredentials = function(login, password, host) {
    if (!(host in hosters))
      hosters[host] = new module();
    hosters[host].login = login;
    hosters[host].password = password;
  };*/

/**
 * @version 0.3.0
 * @author WebItUp
 * @name jsboot.js
 * @homepage http://core.jsboot.com
 * @file Provides a digest+appkey enabled XHR, using the gate xhr backend
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/digest.js#66-ded0862374472fd32d2197f203e1984938eb1e1d
 */


/**
 * This class has the same signature as the native XMLHttpRequest, except obviously it supports authentication
 * @class
 * @name Mingus.xhr.XMLHttpRequest
 * @requires Mingus.xhr.appKeyEngine
 * @requires Mingus.xhr.digest
 * @type Object
 */

/**#nocode+*/

// XXX digest and key engine are used with host alone (no port) for now - which is somewhat wrong

/*global Mingus*/
(function(iri, ake, dig, transport) {
  'use strict';

  /*global console*/
  var hax = this.XMLHttpRequest = function() {

    // UA-like signature
    var _requestedWith = 'XMLHttpRequest';

    console.debug('          |X| constructing');

    // Store an original XHR
    var _xhr;

    // Self reference
    var self = this;

    // Hold-on the passed parameters as to be able to replay
    var _headers = {}, _method, _async, _data;

    // Privates holding parameters useful for "later-on" (eg: send) time-sensitive calculations
    var _iri, _url;

    // Read-only accessors that map directly to the original XHR
    ['readyState', 'status', 'statusText', 'responseText', 'responseXML', 'upload', 'UNSENT',
      'OPENED', 'HEADERS_RECEIVED', 'LOADING', 'DONE'].forEach(function(attrName) {
      Object.defineProperty(this, attrName, {
        get: function() { return _xhr[attrName]; },
        enumerable: true
      });
    }, this);

    // Read-write accessors that map directly to the original XHR
    ['timeout', 'asBlob', 'followRedirects', 'withCredentials'].forEach(function(attrName) {
      Object.defineProperty(this, attrName, {
        get: function() { return _xhr[attrName]; },
        set: function(value) { _xhr[attrName] = value; },
        enumerable: true
      });
    }, this);

    // Methods that map directly to the original XHR
    this.overrideMimeType = function(mime) {
      return _xhr.overrideMimeType(mime);
    };

    this.abort = function() {
      console.debug('          |X| abort');
      return _xhr.abort();
    };

    this.getResponseHeader = function(name) {
      console.debug('          |X| get response', name);
      if (name.toLowerCase() == 'www-authenticate')
        name = 'X-WWW-Authenticate';
      return _xhr.getResponseHeader(name);
    };

    this.getAllResponseHeaders = function() {
      return _xhr.getAllResponseHeaders().replace(/X-WWW-Authenticate/i, 'WWW-Authenticate');
    };

    this.onreadystatechange = function() {};

    this.setRequestHeader = function(name, value) {
      console.debug('          |X| set req head', name, value);
      _xhr.setRequestHeader(name, value);
      _headers[name] = value;
    };

    this.open = function(method, url, async/*, user, password*/) {
      console.debug('          |X| open', method, url, async);

      // First run, store
      if (!_method) {
        _iri = iri.parse(url);
        _method = method;
        _async = async;
        _url = url;
      }

      // Get a transport
      var i = _iri.host + (_iri.port ? (':' + _iri.port) : '');
      _xhr = transport(i, hax.gatePath);
      setupNative();

      // Open
      _xhr.open(_method, _url, _async);

      // If there is a login and challenge, it's likely we can and should authenticate
      var digestMod = dig.getEngine(_iri.host);
      var p = _iri.path + (_iri.query ? ('?' + _iri.query) : '');
      if (digestMod.login && ('nonce' in digestMod.challenge))
        _xhr.setRequestHeader('Authorization', digestMod.getAuthenticationHeader(p, _method));

      // And sign
      _xhr.setRequestHeader('X-Requested-With', _requestedWith);
    };

    this.send = function(data) {
      console.debug('          |X| send', data);
      // First start
      if (!_data)
        _data = data;

      // Got an AppKey? Then sign (about time)
      // try {
      // XXX rather use with query frag properly?
      // var p = _iri.path + (_iri.query ? ('?' + _iri.query) : '');
      _xhr.setRequestHeader('X-Signature', ake.getSignature(_iri.host, _iri.path, _method));
      // }catch (e) {
      //   console.error(e);
      // }

      _xhr.send(_data);
    };

    // Set-up the hook
    var setupNative = function() {
      _xhr.onreadystatechange = function() {
        // Got headers
        console.debug('          |X| state change!', _xhr.readyState);

        if ((_xhr.readyState == _xhr.HEADERS_RECEIVED) || (_xhr.readyState == _xhr.DONE)) {

          // Set the date clock eventually
          // XXX dirty partial fix for the cached-entries date shift snafoo
          if ((_xhr.status == 401) && _xhr.getResponseHeader('Date'))
            ake.setTime(_iri.host, _xhr.getResponseHeader('Date'));
          // XXX previous          _serverDate = _xhr.getResponseHeader('Date');
          // Possibly got a challenge - if so, set it for the host
          var digestMod = dig.getEngine(_iri.host);
          if (_xhr.getResponseHeader('X-WWW-Authenticate')) {
            digestMod.challenge = _xhr.getResponseHeader('X-WWW-Authenticate');
          }
          // And... is this a 401? Have a challenge? Then replay - otherwise, consider we are doomed
          if (('nonce' in digestMod.challenge) && _xhr.status == 401) {
            // Abort no matter
            _xhr.abort();
            // Re-open
            self.open();
            // Re-set headers
            for (var name in _headers) {
              if (_headers.hasOwnProperty(name))
                _xhr.setRequestHeader(name, _headers[name]);
            }
            // Don't end-up in a dead-loop
            _xhr.onreadystatechange = function() {
              self.onreadystatechange.call(self);
            };
            // Re-send
            self.send();
            // And return
            return;
          }
        }
        // Gizzz, pass-it up!
        self.onreadystatechange.call(self);
      };
    };
  };

  this.XMLHttpRequest.gatePath = undefined;
  // Allow to set the _gatePath manually
  // var _gatePath;

  // Object.defineProperty(_root_.XMLHttpRequest, 'gatePath', {
  //   get: function() {
  //     return _gatePath;
  //   },
  //   set: function(p) {
  //     gatePath = p;
  //   },
  //   enumerable: true
  // });


}).apply(Mingus.xhr, [Mingus.grammar.IRI, Mingus.xhr.appKeyEngine, Mingus.xhr.digest, Mingus.xhr.gateOpener.getBridge]);

/**#nocode-*/

