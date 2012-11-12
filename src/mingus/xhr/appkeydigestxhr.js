/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Provides a digest+appkey enabled XHR, using the gate xhr backend
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/mingus/xhr/digest.js{PUKE-PACKAGE-GIT-REV}
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

  /*global console, fixIE*/
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

  // IE crap take 2
  this.XMLHttpRequest = fixIE(this.XMLHttpRequest);

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
