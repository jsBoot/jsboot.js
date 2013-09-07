var whole = 'Host:  dev.api.roxee.net       \r\n' +
    'Connection:  keep-alive   \r\n' +
    'User-Agent:  Talk to the hand      \r\n' +
    'Accept:  image/png,image/*;q=0.8,*/*;q=0.5        \r\n' +
    'Accept-Language: fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3      \r\n' +
    'Accept-Encoding: gzip, deflate      \r\n' +
    'Accept-Charset:  ISO-8859-1,utf-8;q=0.7,*;q=0.7      \r\n' +
    'Referer: http://dev.api.roxee.net/~dmp/roxeestyle/deploy/gristaupe/org/wiu/gristaupe/taupale.css    \r\n' +
    'Cookie:  __utma=1.1587142726.1321535101.1322447424.1322490297.35; __utmz=1.1321535101.1.1.utmcsr=(direct)| \r\n' +
    '  utmccn=(direct)|utmcmd=(none); __utmc=1; __utmb=1.1.10.1322490297    \r\n' +
    'If-Modified-Since: Wed, 09 Nov 2011 12:50:28 GMT   \r\n' +
    'If-None-Match: "248bfab-5af-4b14cbb7ced00"      \r\n' +
    'Cache-Control: max-age=0     \r\n heyyyyy\r\n';

// var keys = ['host', 'connection', 'user-agent', 'accept', 'accept-language', 'accept-encoding', 'accept-charset'];


describe('Basic http parsing', function() {
  it('Simple line', function() {
    var candidate = 'Key: Value\r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value'}]);
  });

  it('Repetitive line', function() {
    var candidate = 'Key: Value\r\nKey: Value\r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value'}, {key: 'key',
      value: 'Value'}]);
  });

  it('Sloppy value, to be trimmed', function() {
    var candidate = 'Key:   Value  \r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value'}]);
  });
});

describe('Key validation', function() {
  it('Empty key', function() {
    var candidate = ': Value\r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([]);
  });

  it('Key validation: anything < 128, except CTLs and separators', function() {
    var needle = ': Value\r\n';
    var c;
    var sep = ['(', ')', '<', '>', '@', ',', ';', ':', '\\', '"', '/', '[', ']', '?', '=', '{', '}', ' ', '\t'];
    for (var x = 0; x < 128; x++) {
      c = String.fromCharCode(x);
      if ((x < 32) || (x == 127) || (sep.indexOf(c) != -1))
        expect(Mingus.grammar.HTTP.parseHeaders(c + needle)).toEqual([]);
      else
        expect(Mingus.grammar.HTTP.parseHeaders(c + needle)).toEqual([{key: c.toLowerCase(), value: 'Value'}]);
    }
  });

  it('Key validation: no key point > 128', function() {
    var needle = ': Value\r\n';
    var c;
    for (var x = 128; x < 10000; x++) {
      c = String.fromCharCode(x);
      expect(Mingus.grammar.HTTP.parseHeaders(c + needle)).toEqual([]);
    }
  });
});

describe('Value validation', function() {
  /*
    var quotedPair = '\\\\' + ABNF.makeClass(CHAR);
    var qdtext = ABNF.makeClass('\\x20\\x21\\x23-\\x7E\\x80-\\xFF') + ABNF.repeat(ABNF.optional(LWS) +
        ABNF.repeat('\\x20\\x21\\x23-\\x7E\\x80-\\xFF', 1));
    var quotedString = '"' + ABNF.repeat(ABNF.alternate(qdtext, quotedPair)) + '"';
    var fieldContent = ABNF.alternate(TEXT, ABNF.repeat(ABNF.alternate(token, separators, quotedString)));
    var fieldValue = ABNF.repeat(ABNF.alternate(LWS, fieldContent));
  */
  it('Single value, with semi', function() {
    var candidate = 'Key:   Value: revalue  \r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value: revalue'}]);
  });

  it('With LWS (space)', function() {
    var candidate = 'Key:   Value\r\n Suite  \r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value Suite'}]);
  });

  it('With LWS (tab)', function() {
    var candidate = 'Key:   Value\r\n\tSuite  \r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value Suite'}]);
  });

  it('With LWS (collapse)', function() {
    var candidate = 'Key:   Value\r\n \t \t Suite  \r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value Suite'}]);
  });

  it('With LWS (multi, collapse)', function() {
    var candidate = 'Key:   Value\r\n \t \t Suite\t\r\n\t Suite  \r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: 'Value Suite Suite'}]);
  });

  it('Solo LWS', function() {
    var candidate = 'Key: \r\n \t \t \t\r\n\t \r\n';
    expect(Mingus.grammar.HTTP.parseHeaders(candidate)).toEqual([{key: 'key', value: ''}]);
  });

  it('Anything but CTLs minus LWS', function() {
    var needle = 'Key';
    var c;
    // var sep = ['(', ')', '<', '>', '@', ',', ';', ':', '\\', '"', '/', '[', ']', '?', '=', '{', '}', ' ', '\t'];
    for (var x = 0; x < 256; x++) {
      c = String.fromCharCode(x);
      if ((x < 32) || (x == 127))
        expect(Mingus.grammar.HTTP.parseHeaders(needle + x + ':' + c + '\r\n')).toEqual([]);
      else
        expect(Mingus.grammar.HTTP.parseHeaders(needle + x + ':' + c + '\r\n')).toEqual([{key: 'key' + x, value:
              c.trim()}]);
    }
  });

  it('Value validation: no key point > 256', function() {
    var c;
    for (var x = 256; x < 10000; x++) {
      c = String.fromCharCode(x);
      expect(Mingus.grammar.HTTP.parseHeaders('Key:' + c + '\r\n')).toEqual([]);
    }
  });

  it('Value validation: escaped chars inside quoted strings', function() {
    var c;
    for (var x = 0; x < 256; x++) {
      c = String.fromCharCode(x);
      expect(Mingus.grammar.HTTP.parseHeaders('Key' + x + ':  "\\' + c + '"\r\n')).toEqual([{key: 'key' + x,
        value: '"\\' + c + '"'}]);
    }
  });

  it('Value validation: comment', function() {
    expect(Mingus.grammar.HTTP.parseHeaders('Key: (comment)')).toEqual([{key: 'key', value: '(comment)'}]);
  });

  // token          = 1*<any CHAR except CTLs or separators>
  //   separators     = "(" | ")" | "<" | ">" | "@"
  //                  | "," | ";" | ":" | "\" | <">
  //                  | "/" | "[" | "]" | "?" | "="
  //                  | "{" | "}" | SP | HT

  //   CTL            = <any US-ASCII control character
  //                    (octets 0 - 31) and DEL (127)>


  // it('Blank', function(){
  //   runs(function(){
  //     var result = Mingus.grammar.HTTP.parseHeaders(whole);
  //     // expect(Object.keys(result)).toEqual(keys);
  //   });
  // });
});
