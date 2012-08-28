/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Basic utility class providing regexp atoms for http (headers).
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/mingus/grammar/HTTP.js
 */

/**
 * @kind namespace
 * @summary Provides basic regexps to parse http. Read <a href="http://tools.ietf.org/html/rfc2616">RFC</a>.
 * @requires Mingus.grammar.ABNF
 * @requires Mingus.grammar.IRI
 * @name HTTP
 * @memberof Mingus.grammar
 */


/**
 * A simple method to get an object from a block of HTTP headers
 * @memberof Mingus.grammar.HTTP
 * @name parseHeaders
 * @kind function
 * @param {String} message The string to be parsed.
 * @returns {Object} The parsed headers
 */

/**
 * @kind namespace
 * @summary A subclass to handle the parsing of digest headers.
 * @memberof Mingus.grammar.HTTP
 * @name digest
 */

/**
 * @summary A method to parse wwwauthenticate headers
 * @kind function
 * @memberof Mingus.grammar.HTTP.digest
 * @name parse
 * @param  {String} message The header value to be parsed.
 * @returns {Object} The parsed result
 */

(function(_root_, ABNF, IRI) {
  _root_.HTTP = new (function() {
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
    var separators = '[\(\)<>@,;:\\"/\[\]?={}' + ABNF.SP + ABNF.HTAB + ']';
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

    var HTTPVersion = 'HTTP\\/' + ABNF.repeat(ABNF.DIGIT, 1) + '[.]' + ABNF.repeat(ABNF.DIGIT, 1);

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

        if (result = matcher.exec(message)) {
          var s = matcher.lastIndex;
          // This is very lax parsing, which is pretty much OK
          matcher = new RegExp(digestChallenge + '(?:,)?', 'g');
          matcher.lastIndex = s;
          var result, key, value;
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
})(Mingus.grammar, Mingus.grammar.ABNF, Mingus.grammar.IRI);

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



