/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-RIGHTS-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOMEPAGE}
 * @file Basic utility class providing regexp atoms for the address part of the internet message format RFC.
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @location {PUKE-GIT-ROOT}/mingus/grammar/IMF.js{PUKE-GIT-REVISION}
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
