/**
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @version {PUKE-PACKAGE-VERSION}
 * @location {PUKE-PACKAGE-GIT-ROOT}/lib/com/wiu/mingus/xhr/digest.js
 * @fileOverview Provides a digest engine.
 * @author {PUKE-PACKAGE-AUTHOR}
 */

// XXX workaround jsdoctoolkit freaky broken parser

/**
 * A factory to obtain a digest engine for a given host.
 * @namespace Digest factory
 * @name Mingus.xhr.digest
 * @requires Mingus.crypto.md5
 * @requires Mingus.grammar.http
 * @extends Object
 */

/**#@+
 * @memberOf Mingus.xhr.digest
 */

/**
 * Allows XHR to get a module (see below)
 * @function
 * @static
 * @name getEngine
 * @param {String} host The hostname for which to obtain the module.
 * @returns {Mingus.xhr.digest.Engine} A persistent digest module instance for the given host.
 */

/**
 * Allows the consumer to set/get all data of the engine and have it persist somewhere
 * @property
 * @static
 * @name data
 * @type Object
 */

/**
 * A digest module for a given host.
 *
 * Allows to obtain a signature given properties - does recycle challenges.
 * Is obtained through the factory.
 *
 * @class
 * @name Engine
 * @extends Object
 * @returns {undefined} This class can't be instanciated directly. You need to call getEngine on the factory.
 * @requires Mingus.crypto.md5
 */

/**#@-*/

/**#@+
 * @memberOf Mingus.xhr.digest.Engine
 */

/**
 * @name login
 * @type String
 * @property
 */

/**
 * You can only *set* that. Credentials can't be retrieved.
 * @name password
 * @type String
 * @property
 */

/**
 * You can only *set* that. Credentials can't be retrieved.
 * @name ha1
 * @type String
 * @property
 */
/**
 * @name challenge
 * @type String
 * @property
 */

/**
 * @name getAuthenticationHeader
 * @function
 * @param {String} url The url for which to obtain auth header.
 * @param {String} method The HTTP method that will be used to access the url.
 * @returns {String} The authentication header value to use.
 */

/**#@-*/

/**#@+
 * @ignore
 */


(function(_root_, md5, http) {
  // Private helpers

  // Private helper to build a client nonce
  var generateCnonce = function() {
    return md5.crypt('' + Math.floor(Math.random() * 1000000));
  };

  // Private helper to increment a nc
  var incrementNC = function(nc) {
    var l = nc.length, n = parseInt(nc, 10), str = '' + (n + 1);
    while (str.length < l) {
      str = '0' + str;
    }
    return str;
  };

  // Private helper to generate a HA1
  var generateHA1 = function(log, pass, realm) {
    console.debug('    |DE| Generating HA1 for ', log, pass, realm, md5.crypt(log + ':' + realm + ':' + pass));
    return md5.crypt(log + ':' + realm + ':' + pass);
  };

  // Private helper to generate a suitable answer string
  var generateResponse = function(ha1, nonce, nc, cnonce, qop, method, url) {
    console.debug('    |DE| Generating response for ', ha1, nonce, nc, cnonce, qop, method, url);
    var ha2 = md5.crypt(method.toUpperCase() + ':' + url);
    return md5.crypt(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2);
  };

  // Internal lock helper
  var locker = function() {};


  var digestModule = function(lock) {
    if (!(lock instanceof locker) && (lock != 'dirtyTrix')) {
      throw "You can't instanciate a DigestModule directly. Call Mingus.xhr.digestFactory.getDigest(host) instead.";
    }

    console.debug('    |DE| constructed module');
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
        console.debug('    |DE| setting login', log);
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
      enumerable: false
    });

    Object.defineProperty(this, 'password', {
      set: function(pass) {
        console.debug('    |DE| setting password', pass);
        _password = pass;
        // Password change means reseting HA1
        _ha1 = null;
      },
      enumerable: true
    });

    Object.defineProperty(this, 'ha1', {
      get: function() {
        return _ha1;
      },
      set: function(ha1) {
        console.debug('    |DE| setting ha1', ha1);
        _ha1 = ha1;
      },
      enumerable: false
    });

    Object.defineProperty(this, 'challenge', {
      get: function() {
        console.debug('    |DE| getting challenge', _challenge);
        return _challenge;
      },

      set: function(header) {
        var oldrealm = (_challenge && 'realm' in _challenge) ? _challenge.realm : null;
        var t = http.digest.parse(header);
        console.debug('    |DE| parsing challenge', header, 'resulting in', t);
        // Aggregate onto last challenge info
        for (var i in t)
          _challenge[i] = t[i];

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
      enumerable: true
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

      var authArray = [];
      for (var key in auth)
        authArray.push(key + '="' + auth[key] + '"');
      console.debug('    |DE| generate response with', _challenge, authArray.join(', '));
      return 'Digest ' + authArray.join(', ');
    };
    /**#@-*/
  };

  // IE crap
  digestModule = fixIE(digestModule);


  _root_.digest = new (function() {
    // Modules per hosts
    var hosters = {};

    this.getEngine = function(host) {
      if (!(host in hosters))
        hosters[host] = new digestModule(new locker());
      console.debug('    |DE| got module for host', host);
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
    // XXX prevent too much acrobatic stunts with IE
    this.data = hosters;

  })();


})(Mingus.xhr, Mingus.crypto.md5, Mingus.grammar.HTTP);


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
