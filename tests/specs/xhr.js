(function() {
  /*global describe:false,it:false,expect:false,runs:false,waitsFor:false,xit:false,XMLHttpRequest:false,
  AnonXMLHttpRequest:false,InvalidAccessError:false*/
  'use strict';

  describe('Constructor', function() {
    /*jshint nonew:false,newcap:false*/
    it('Has XHR constructor', function() {
      new XMLHttpRequest();
    });
    it('Has AnonXHR constructor', function() {
      new AnonXMLHttpRequest();
    });
    it('Can\'t apply', function() {
      var client = {};
      try {
        XMLHttpRequest.apply(client);
        expect(false).toBe(true);
      }catch (e) {
        expect(true).toBe(true);
      }
    });
    it('Can\'t use as a function', function() {
      try {
        XMLHttpRequest();
        // expect(false).toBe(true);
      }catch (e) {
        expect(true).toBe(true);
      }
    });
  });

  describe('Instance basic properties', function() {
    var client = new XMLHttpRequest();
    it('XMLHttpRequestEventTarget: onloadstart', function() {
      expect('onloadstart' in client).toBe(true);
    });
    it('XMLHttpRequestEventTarget: onprogress', function() {
      expect('onprogress' in client).toBe(true);
    });
    it('XMLHttpRequestEventTarget: onerror', function() {
      expect('onabort' in client).toBe(true);
    });
    it('XMLHttpRequestEventTarget: onerror', function() {
      expect('onerror' in client).toBe(true);
    });
    it('XMLHttpRequestEventTarget: onload', function() {
      expect('onload' in client).toBe(true);
    });
    it('XMLHttpRequestEventTarget: ontimedout', function() {
      expect('ontimedout' in client).toBe(true);
    });
    it('XMLHttpRequestEventTarget: onloadend', function() {
      expect('onloadend' in client).toBe(true);
    });

    it('XMLHttpRequest onreadystatechange', function() {
      expect('onreadystatechange' in client).toBe(true);
    });
    it('XMLHttpRequest UNSENT', function() {
      expect('UNSENT' in client).toBe(true);
    });
    it('XMLHttpRequest OPENED', function() {
      expect('OPENED' in client).toBe(true);
    });
    it('XMLHttpRequest HEADERS_RECEIVED', function() {
      expect('HEADERS_RECEIVED' in client).toBe(true);
    });
    it('XMLHttpRequest LOADING', function() {
      expect('LOADING' in client).toBe(true);
    });
    it('XMLHttpRequest DONE', function() {
      expect('DONE' in client).toBe(true);
    });
    it('XMLHttpRequest readyState', function() {
      expect('readyState' in client).toBe(true);
    });
    it('XMLHttpRequest timeout', function() {
      expect('timeout' in client).toBe(true);
    });
    it('XMLHttpRequest withCredentials', function() {
      expect('withCredentials' in client).toBe(true);
    });
    it('XMLHttpRequest upload', function() {
      expect('upload' in client).toBe(true);
    });
    it('XMLHttpRequest status', function() {
      expect('status' in client).toBe(true);
    });
    it('XMLHttpRequest statusText', function() {
      expect('statusText' in client).toBe(true);
    });
    it('XMLHttpRequest responseType', function() {
      expect('responseType' in client).toBe(true);
    });
    it('XMLHttpRequest response', function() {
      expect('response' in client).toBe(true);
    });
    it('XMLHttpRequest responseText', function() {
      expect('responseText' in client).toBe(true);
    });
    it('XMLHttpRequest responseXML', function() {
      expect('responseXML' in client).toBe(true);
    });

    it('XMLHttpRequest setRequestHeader', function() {
      expect(typeof client.setRequestHeader).toBe('function');
    });
    it('XMLHttpRequest send', function() {
      expect(typeof client.send).toBe('function');
    });
    it('XMLHttpRequest abort', function() {
      expect(typeof client.abort).toBe('function');
    });
    it('XMLHttpRequest open', function() {
      expect(typeof client.open).toBe('function');
    });
    it('XMLHttpRequest getResponseHeader', function() {
      expect(typeof client.getResponseHeader).toBe('function');
    });
    it('XMLHttpRequest getAllResponseHeaders', function() {
      expect(typeof client.getAllResponseHeaders).toBe('function');
    });
    it('XMLHttpRequest overrideMimeType', function() {
      expect(typeof client.overrideMimeType).toBe('function');
    });
  });


  describe('The open method', function() {
    // XXX specification doesn't say if the url param MUST be set, and what happens when it is not


    // The open(method, url, async, user, password) method must run these steps (unless otherwise indicated):
    // If there is an associated XMLHttpRequest document run these substeps:
    // If the XMLHttpRequest document is not fully active, throw an "InvalidStateError" exception and terminate the
    // overall set of steps.
    // Let XMLHttpRequest base URL be the document base URL of the XMLHttpRequest document.
    // Let XMLHttpRequest origin be the origin of the XMLHttpRequest document and let it be a globally unique
    // identifier if the anonymous flag is set.

    it('If any code point in method is higher than U+00FF LATIN SMALL LETTER Y WITH DIAERESIS throw a "SyntaxError" ' +
       'exception and terminate these steps', function() {
         var client = new XMLHttpRequest();
         try {
           client.open('GETù', '#');
           expect(false).toBe(true);
         }catch (e) {
           expect(e.name).toEqual('SYNTAX_ERR');
         }
       });

    it('If after deflating method it does not match the Method token production,  throw a "SyntaxError" exception ' +
       'and terminate these steps', function() {
         var client = new XMLHttpRequest();
         try {
           client.open('GET GET', '#');
           expect(false).toBe(true);
         }catch (e) {
           expect(e.name).toEqual('SYNTAX_ERR');
         }
       });

    // If method is a case-insensitive match for CONNECT, DELETE, GET, HEAD, OPTIONS, POST, PUT, TRACE, or TRACK
    // subtract 0x20 from each byte in the range 0x61 (ASCII a) to 0x7A (ASCII z).
    // If it does not match any of the above, it is passed through literally, including in the final request.

    ['CoNNeCT', 'TRaCE', 'tRaCK'].forEach(function(meth) {
      it('If method is a case-sensitive match for ' + meth + ' throw a "SecurityError" exception and terminate ' +
         'these steps', function() {
           var client = new XMLHttpRequest();
           try {
             client.open(meth, '#');
             expect(false).toBe(true);
           }catch (e) {
             // console.warn(e);
             // Chrome throws a TypeError instead - and SecurityError is not defined in Chrome
             expect(e.name).toEqual('SECURITY_ERR');
           }
         });
    });
    // Allowing these methods poses a security risk. [HTTPVERBSEC]


    // Let url be a URL with character encoding UTF-8.
    // Resolve url relative to the XMLHttpRequest base URL. If the algorithm returns an error, throw a "SyntaxError"
    // exception and terminate these steps.
    // Drop <fragment> from url.
    // If the "user:password" format in the userinfo production is not supported for the relevant <scheme> and url
    // contains this format, throw a "SyntaxError" and terminate these steps.
    // If url contains the "user:password" format let temp user be the user part and temp password be the password
    // part.
    // If url just contains the "user" format let temp user be the user part.
    // Let async be the value of the async argument or true if it was omitted.
    // If async is false, there is an associated XMLHttpRequest document and either the timeout attribute value is not
    // zero, the withCredentials attribute value is true, or the responseType attribute value is not the empty string,
    // throw an "InvalidAccessError" exception and terminate these steps.
    // If the user argument was not omitted follow these sub steps:
    // If user is not null and the origin of url is not same origin with the XMLHttpRequest origin, throw an
    // "InvalidAccessError" exception and terminate the overall set of steps.
    // Let temp user be user.
    // These steps override anything that may have been set by the url argument.
    // If the password argument was not omitted follow these sub steps:
    // If password is not null and the origin of url is not same origin with the XMLHttpRequest origin, throw an
    // "InvalidAccessError" exception and terminate the overall set of steps.
    // Let temp password be password.
    // These steps override anything that may have been set by the url argument.
    // Terminate the abort() algorithm.
    // Terminate the send() algorithm.
    // The user agent should cancel any network activity for which the object is responsible.
    // If there are any tasks from the object's XMLHttpRequest task source in one of the task queues, then remove them.
    // Set variables associated with the object as follows:
    // Set the request method to method.
    // Set the request URL to url.
    // If async is false, set the synchronous flag.
    // Set the request username to temp user.
    // Set the request password to temp password.


    // Empty the list of author request headers.
    // Unset the send() flag.
    it('Set response entity body to null', function() {
      var client = new XMLHttpRequest();
      client.open('GET', '#');
      expect(client.response).toBe(null);
    });

    it('Change the state to OPENED.', function() {
      var client = new XMLHttpRequest();
      client.open('GET', '#');
      expect(client.readyState).toBe(client.OPENED);
    });

    it('Fire an event named readystatechange', function() {
      var hasFired = 0;
      var client = new XMLHttpRequest();
      runs(function() {
        client.onreadystatechange = function() {
          hasFired++;
        };
        client.open('GET', '#');
      });
      waitsFor(function() {
        return hasFired > 0;
      }, 'Open never fired', 100);
      runs(function() {
        expect(hasFired).toEqual(1);
      });
    });
  });


  describe('The setRequestHeader(header, value) method must run these steps', function() {
    it('If the state is not OPENED, throw an "InvalidStateError" exception and terminate these steps', function() {
      var client = new XMLHttpRequest();
      try {
        client.setRequestHeader('Foo', 'Bar');
        expect(false).toBe(true);
      }catch (e) {
        expect(e.name).toEqual('INVALID_STATE_ERR');
      }
    });

    // If the send() flag is set, throw an "InvalidStateError" exception and terminate these steps.

    it('If any code point in header is higher than U+00FF LATIN SMALL LETTER Y WITH DIAERESIS throw a "SyntaxError" ' +
       'exception and terminate these steps.', function() {
         var client = new XMLHttpRequest();
         client.open('GET', '#');
         try {
           client.setRequestHeader('Fooù', 'Bar');
           expect(false).toBe(true);
         }catch (e) {
           expect(e.name).toEqual('SYNTAX_ERR');
         }
       });

    it('If after deflating header it does not match the field-name production, throw a "SyntaxError" exception and ' +
       'terminate these steps.', function() {
         var client = new XMLHttpRequest();
         client.open('GET', '#');
         try {
           client.setRequestHeader('Foo Foo', 'Bar');
           expect(false).toBe(true);
         }catch (e) {
           expect(e.name).toEqual('SYNTAX_ERR');
         }
       });

    //  Otherwise let header be the result of deflating header.

    it('If any code point in value is higher than U+00FF LATIN SMALL LETTER Y WITH DIAERESIS throw a "SyntaxError" ' +
       'exception and terminate these steps.', function() {
         var client = new XMLHttpRequest();
         client.open('GET', '#');
         try {
           client.setRequestHeader('Foo', 'Barù');
           expect(false).toBe(true);
         }catch (e) {
           expect(e.name).toEqual('SYNTAX_ERR');
         }
       });

    it('If after deflating header value it does not match the field-value production, throw a "SyntaxError" ' +
       'exception and terminate these steps.', function() {
         var client = new XMLHttpRequest();
         client.open('GET', '#');
         try {
           client.setRequestHeader('Foo', 'Bar "');
           expect(false).toBe(true);
         }catch (e) {
           expect(e.name).toEqual('SYNTAX_ERR');
         }
       });

    it('The empty string is legal and represents the empty header value.', function() {
      var client = new XMLHttpRequest();
      client.open('GET', '#');
      client.setRequestHeader('Foo', '');
      client.setRequestHeader('Foo', null);
      client.setRequestHeader('Foo', false);
      client.setRequestHeader('Foo', undefined);
      expect(true).toBe(true);
    });

    [
      'accept-chArset', 'accept-encOding', 'access-cOntrol-request-headers', 'access-contrOl-request-method',
      'connectIon', 'contEnt-length', 'cOokie', 'cookiE2', 'content-trAnsfer-encoding', 'daTe', 'eXpect', 'hoSt',
      'keEp-alive', 'origIn', 'refErer', 'tE', 'trAiler', 'trAnsfer-encoding', 'uPgrade', 'useR-agent', 'viA'
    ].forEach(function(item) {
      it('Terminate these steps if header is a case-insensitive match for ' + item, function() {
        var client = new XMLHttpRequest();
        client.open('GET', '#');
        client.setRequestHeader(item, '');
      });

    });

    it('Terminate these steps if header is a case-insensitive match for Proxy- or Sec- ', function() {
      var client = new XMLHttpRequest();
      client.open('GET', '#');
      client.setRequestHeader('proXy-', '');
      client.setRequestHeader('seC-', '');
      client.setRequestHeader('proXy-Foo', '');
      client.setRequestHeader('seC-Foo', '');
    });
    // The above headers are controlled by the user agent to let it control those aspects of transport. This
    // guarantees data integrity to some extent. Header names starting with Sec- are not allowed to be set to allow
    // new headers to be minted that are guaranteed not to come from XMLHttpRequest.

  });

  // If header is not in the author request headers list append header with its associated value to the list and
  // terminate these steps.
  // If header is in the author request headers list either use multiple headers, combine the values or use a
  // combination of those (section 4.2, RFC 2616). [HTTP]
  // See also the send() method regarding user agent header handling for caching, authentication, proxies, and cookies.
  // Some simple code demonstrating what happens when setting the same header twice:


  describe('The timeout attribute', function() {
    // Setting the timeout attribute must run these steps:
    //
    //
    // This implies that the timeout attribute can be set while fetching is in progress. If that occurs it will still
    // be measured relative to the start of fetching.
    it('The timeout attribute must return its value. Initially its value must be zero.', function() {
      var client = new XMLHttpRequest();
      expect(client.timeout).toBe(0);
    });

    it('If there is an associated XMLHttpRequest document and the synchronous flag is set, throw an ' +
       '"InvalidAccessError" exception and terminate these steps.', function() {
         var client = new XMLHttpRequest();
         client.open('GET', '#', false);
         try {
           client.timeout = 10;
         }catch (e) {
           expect(e.constructor).toBe(InvalidAccessError);
         }
       });

    it('Set its value to the new value.', function() {
      var client = new XMLHttpRequest();
      client.open('GET', '#', true);
      client.timeout = 10;
      expect(client.timeout).toBe(10);
    });

  });


  describe('The withCredentials attribute', function() {
    // Setting the timeout attribute must run these steps:
    //
    //
    // This implies that the timeout attribute can be set while fetching is in progress. If that occurs it will
    // still be measured relative to the start of fetching.
    it('The withCredentials attribute must return its value. Initially its value must be false.', function() {
      var client = new XMLHttpRequest();
      expect(client.withCredentials).toBe(false);
    });

    it('If the state is not UNSENT or OPENED, throw an "InvalidStateError" exception and terminate these steps.',
       function() {
         var client = new XMLHttpRequest();
         client.open('GET', '#', false);
         client.send();
         try {
           client.withCredentials = true;
         }catch (e) {
           expect(e.name).toBe('INVALID_STATE_ERR');
         }
       });
    // If the send() flag is set, throw an "InvalidStateError" exception and terminate these steps.
    // If the anonymous flag is set, throw an "InvalidAccessError" exception and terminate these steps.

    // If there is an associated XMLHttpRequest document and the synchronous flag is set, throw an
    // "InvalidAccessError" exception and terminate these steps.
    it('Set its value to the new value.', function() {
      var client = new XMLHttpRequest();
      client.open('GET', '#', false);
      try {
        client.withCredentials = true;
      }catch (e) {
        expect(e.constructor).toBe(InvalidAccessError);
      }
    });

    it('Set the withCredentials attribute\'s value to the given value.', function() {
      var client = new XMLHttpRequest();
      client.open('GET', '#', true);
      client.withCredentials = true;
      expect(client.withCredentials).toBe(true);
    });
    // The withCredentials attribute has no effect when fetching same-origin resources.
  });





  describe('The send(data) method must run these steps (unless otherwise noted). This algorithm can be ' +
      'terminated by invoking the open() or abort() method. When it is terminated the user agent must terminate ' +
      'the algorithm after finishing the step it is on.', function() {
        // The send() algorithm can only be terminated if the synchronous flag is unset and only after the method
        // call has returned.

        it('If the state is not OPENED, throw an "InvalidStateError" exception and terminate these steps.', function() {
          var client = new XMLHttpRequest();
          try {
            client.send();
            expect(false).toBe(true);
          }catch (e) {
            expect(e.name).toEqual('INVALID_STATE_ERR');
          }
        });


        it('If the send() flag is set, throw an "InvalidStateError" exception and terminate these steps.', function() {
          var client = new XMLHttpRequest();
          client.open('GET', '#');
          try {
            client.send();
            client.send();
            expect(false).toBe(true);
          }catch (e) {
            expect(e.name).toEqual('INVALID_STATE_ERR');
          }
        });







        xit('Fire an event named readystatechange', function() {
          var hasFired = 0;
          var client = new XMLHttpRequest();
          runs(function() {
            client.onreadystatechange = function() {
              hasFired++;
            };
            client.open('GET', '#');
          });
          waitsFor(function() {
            return hasFired > 0;
          }, 'Open never fired', 100);
          runs(function() {
            expect(hasFired).toEqual(1);
          });
        });
      });

  // If the request method is a case-sensitive match for GET or HEAD act as if data is null.
  // If the data argument has been omitted or is null, do not include a request entity body and go to the next step.
  // Otherwise, let encoding be null, mime type be null, and then follow these rules:
  // If data is a ArrayBuffer
  // Let the request entity body be the raw data represented by data.
  // If data is a Blob
  // If the object's type attribute is not the empty string let mime type be its value.
  // Let the request entity body be the raw data represented by data.
  // If data is a Document
  // Let encoding be the preferred MIME name of the character encoding of data. If encoding is UTF-16 change it to
  // UTF-8.
  // Let mime type be "application/xml" or "text/html" if Document is an HTML document, followed by ";charset=",
  // followed by encoding.
  // Let the request entity body be the result of getting the innerHTML attribute on data converted to Unicode and
  // encoded as encoding. Re-throw any exception this throws.
  // In particular, if the document cannot be serialized an "InvalidStateError" exception is thrown.
  // Subsequent changes to the Document have no effect on what is transferred.
  // If data is a string
  // Let encoding be UTF-8.
  // Let mime type be "text/plain;charset=UTF-8".
  // Let the request entity body be data converted to Unicode and encoded as UTF-8.
  // If data is a FormData
  // Let the request entity body be the result of running the multipart/form-data encoding algorithm with data as
  // form data set and with UTF-8 as the explicit character encoding.
  // Let mime type be the concatenation of "multipart/form-data;", a U+0020 SPACE character, "boundary=", and the
  // multipart/form-data boundary string generated by the multipart/form-data encoding algorithm.
  // If a Content-Type header is in author request headers and its value is a valid MIME type that has a charset
  // parameter whose value is not a case-insensitive match for encoding, and encoding is not null, set all the
  // charset parameters of that Content-Type header to encoding.
  // If no Content-Type header is in author request headers and mime type is not null, append a Content-Type header
  // with value mime type to author request headers.
  // If the synchronous flag is set, release the storage mutex.
  // If the synchronous flag is unset and one or more event listeners are registered on the XMLHttpRequestUpload
  // object, set the upload events flag.
  // Unset the error flag.
  // Set the upload complete flag if there is no request entity body or if the request entity body is empty.
  // If the synchronous flag is unset, run these substeps:

  // Set the send() flag.
  // Fire an event named readystatechange.
  // The state does not change. The event is dispatched for historical reasons.
  // Fire a progress event named loadstart.
  // If the upload complete flag is unset, fire a progress event named loadstart on the XMLHttpRequestUpload object.
  // Return the send() method call, but continue running the steps in this algorithm.
  // If the XMLHttpRequest origin and the request URL are same origin
  // These are the same-origin request steps.
  // Fetch the request URL from origin XMLHttpRequest origin, with the synchronous flag set if the synchronous flag
  // is set, using HTTP method request method, user request username (if non-null) and password request password
  // (if non-null), taking into account the request entity body, list of author request headers and the rules listed
  // at the end of this section.
  // If the synchronous flag is set
  // While making the request also follow the same-origin request event rules.
  // The send() method call will now be returned by virtue of this algorithm ending.
  // If the synchronous flag is unset
  // Make upload progress notifications.
  // Make progress notifications.
  // While processing the request, as data becomes available and when the user interferes with the request, queue
  //  tasks to update the response entity body and follow the same-origin request event rules.
  // Otherwise
  // These are the cross-origin request steps.
  // Make a cross-origin request, passing these as parameters:
  // request URL
  // The request URL.
  // request method
  // The request method.
  // author request headers
  // The list of author request headers.
  // request entity body
  // The request entity body.
  // source origin
  // The XMLHttpRequest origin.
  // credentials flag
  // The withCredentials attribute's value.
  // force preflight flag
  // True if the upload events flag is set, or false otherwise.
  // Request username and request password are always ignored as part of a cross-origin request; including them would
  // allow a site to perform a distributed password search. However, user agents will include user credentials in the
  //  request (if the user has any and if withCredentials is true).

  // If the synchronous flag is set
  // While making the request also follow the cross-origin request event rules.

  // The send() method call will now be returned by virtue of this algorithm ending.

  // If the synchronous flag is unset
  // While processing the request, as data becomes available and when the end user interferes with the request,
  // queue tasks to update the response entity body and follow the cross-origin request event rules.

  // If the user agent allows the end user to configure a proxy it should modify the request appropriately; i.e.,
  // connect to the proxy host instead of the origin server, modify the Request-Line and send Proxy-Authorization
  // headers as specified.

  // If the user agent supports HTTP Authentication and Authorization is not in the list of author request headers,
  // it should consider requests originating from the XMLHttpRequest object to be part of the protection space that
  //  includes the accessed URIs and send Authorization headers and handle 401 Unauthorized requests appropriately.

  // If authentication fails, XMLHttpRequest origin and the request URL are same origin, Authorization is not in
  // the list of author request headers, request username is null, and request password is null, user agents should
  // prompt the end user for their username and password.

  // Otherwise, if authentication fails, user agents must not prompt the end user for their username and password.
  // [HTTPAUTH]

  // End users are not prompted for various cases so that authors can implement their own user interface.

  // If the user agent supports HTTP State Management it should persist, discard and send cookies (as received in
  // the Set-Cookie response header, and sent in the Cookie header) as applicable. [COOKIES]

  // If the user agent implements a HTTP cache it should respect Cache-Control headers in author request headers
  // e.g. Cache-Control: no-cache bypasses the cache). It must not send Cache-Control or Pragma request headers
  //  automatically unless the end user explicitly requests such behavior (e.g. by reloading the page).

  // For 304 Not Modified responses that are a result of a user agent generated conditional request the user agent
  // must act as if the server gave a 200 OK response with the appropriate content. The user agent must allow author
  // request headers to override automatic cache validation (e.g. If-None-Match or If-Modified-Since), in which case
  // 304 Not Modified responses must be passed through. [HTTP]

  // If the user agent implements server-driven content-negotiation it must follow these constraints for the Accept
  // and Accept-Language request headers:

  // Both headers must not be modified if they are in author request headers.

  // If not in author request headers, Accept-Language with an appropriate value should be appended to it.

  // If not in author request headers, Accept with value */* must be appended to it.

  // Responses must have the content-encodings automatically decoded. [HTTP]

  // Besides the author request headers, user agents should not include additional request headers other than those
  //  mentioned above or other than those authors are not allowed to set using setRequestHeader(). This ensures
  //   that authors have a predictable API.









})();
