/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Utility class that provides regexp easing the parsing of IRIs.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/mingus/grammar/IRI.js{PUKE-PACKAGE-GIT-REV}
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
  /*global Mingus:true*/
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
