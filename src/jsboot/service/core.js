'use strict';

(function(scope, xhr, ake, dig, err){

  // /X.Y(?:/name)?(?:/id)?(?:/command)?
  scope.Mondane = function(serviceHost, servicePort, serviceVersion, gatePath, keyId, keySecret) {
    // Service data
    var base = '//' + serviceHost + (servicePort ? (':' + servicePort) : '') + '/' + serviceVersion;

    // Init the underlying stack
    xhr.gatePath = '/' + serviceVersion + '/' + gatePath;
    ake.setAppKey(serviceHost, keyId, keySecret);

    this.login = function(login, password, HA1, realm){
      login = login.toLowerCase();
      var de = dig.getEngine(serviceHost);
      de.login = login;
      if (password)
        de.password = password;
      else {
        de.ha1 = HA1;
        de.realm = realm;
      }
    };

    this.logout = function(){
      var de = dig.getEngine(serviceHost);
      de.login = anonymous.login;
      de.password = anonymous.password;
    };

    this.query = function(options) {
      // Default method
      var method = (options.method || this.GET);

      var url = base;
      // Optional serviceName
      if (options.name)
        url += '/' + options.name;
      // Optional id
      if (options.id)
        url += '/' + options.id;
      // Optional command
      if (options.command)
        url += '/' + options.command;

      // Build-up query string if any
      var query = [];
      if (options.params)
        for (var i in options.params){
          query.push(encodeURIComponent(i) + '=' + encodeURIComponent(options.params[i]));
        }

      if (query.length)
        url += '?' + query.join('&');

      // If no headers are provided, set Accept to app/json
      if (!options.headers) {
        options.headers = {
          'Accept': 'application/json'
        };
      }

      var payload = options.payload;

      // XXX do something serious!!!!
      options.headers['X-IID'] = 'jsboot-untainted-id';

      // Prepare payload if any - think files
      if (method == this.POST)
        try {
          if ((typeof File != 'undefined') && (typeof Blob != 'undefined') &&
              ((payload instanceof File) || (payload instanceof Blob))) {
            options.headers['Content-Type'] = payload.type;
            throw 'File Payload';
          }
          if (!('Content-Type' in options.headers) || (options.headers['Content-Type'] == 'application/json'))
            payload = JSON.stringify(payload);
          if (!('Content-Type' in options.headers))
            options.headers['Content-Type'] = 'application/json';
        }catch (e) {
          for (var i in payload)
            console.warn(i, payload[i]);
          if (!('Content-Type' in options.headers))
            options.headers['Content-Type'] = 'image/jpeg';
          // XXX async call onFailure on malformed request instead?
          //          throw "Unable to serialize your freaxing data!";
        }





      /*

      // Add debugging informations to the objet eventually
      options.debug = {
        url: url,
        method: method,
        payload: payload
      };


      // Optional success
      var onSuccess = options.onSuccess;
      // Optional failure
      var onFailure = options.onFailure;
      // Optional payload
      var payload = options.payload;

      */






      // XXX doesn't work :/
      // inner.followRedirects = false;
      // XXX this is to beforwarded so that we can restart / replay
      /*      inner.portOptions = options;
      inner.portOptions.coreObject = this;*/


      // XXX implement timeouts properly
      var callback = function() {
        //if (inner.readyState == inner.DONE){
        // XXX Firefox 5 test fail
        if (inner.readyState == 4) {
          // XXX may not be the perfect place for that...
          options.data = {};
          try {
            if (inner.getResponseHeader('X-UID'))
              options.userId = inner.getResponseHeader('X-UID');
          }catch (e) {
            console.log('FAILED READING XUID');
          }

          // Errors might be driven by different conditions: 500+, 400+, XXX must test redirections
          // 400 -> bad request
          // 401 -> authent
          // 403 -> unauto
          // 404 -> pas de ressource
          // 405 -> bad request of some sort (method not allowed)
          // 500 -> Server error
          if (inner.status >= 400) {
            options.data.status = inner.status;
            // XXX pass the url as well
            switch (inner.status) {
              case 400:
                options.error = new err(err.BAD_REQUEST);
                var errorInfo = {code: 100, error: 'GENERIC_ERROR'};
                try {
                  errorInfo = JSON.parse(inner.responseText);
                }catch (e) {
                }
                options.data = errorInfo;
                break;
              case 401:
                if (inner.getResponseHeader('WWW-Authenticate')) {
                  options.error = new err(err.WRONG_CREDENTIALS);
                }else {
                  options.error = new err(err.INVALID_SIGNATURE);
                }
                // options.onFailure(_api_.errors.newError(_api_.errors.service.));
                break;
              case 402:
              case 403:
              case 405:
              case 501:
                options.error = new err(err.UNAUTHORIZED);
                break;
              case 404:
                options.error = new err(err.MISSING);
                break;
              case 406:
              // 407-410 are not likely to happen
              case 411:
              case 412:
              case 413:
              case 414:
              case 415:
              case 416:
              case 417:
                options.error = new err(err.SHOULD_NOT_HAPPEN);
                break;
              case 500:
              case 503:
                options.error = new err(err.SERVICE_UNAVAILABLE);
                break;
              default:
                options.error = new err(err.UNSPECIFIED);
                console.log('UNSPECIFIED', inner.status, inner.responseText);
                break;
            }
          //                options.data = {body: inner.responseText, status: inner.status};
          }else if (inner.status == 0) {
            options.error = new err(err.UNAUTHORIZED);
          }else {
            try {
              if (inner.responseText) {
                options.data = JSON.parse(inner.responseText);
              }
            }catch (e) {

              // function(err, data){
              //   console.log("HOOOOOOOOOO");
              //   console.warn(arguments);
              // },
              // XXX do proper content detection based on headers godamn it
              try {
                var parser = new DOMParser();
                options.data = parser.parseFromString(inner.responseText, 'application/xml');
              }catch (e) {
                options.error = new err(err.MEANINGLESS_DATA);
                options.data.payload = inner.responseText;
              }
            }

            // This is specific to the service (while the rest should be reusable)
            /*                options.onSuccess(data);
                switch(options.command){
                  case USER_CMD_AUTHENTICATE:
                    options.onSuccess({});
                  break;
                  default:
                  break;
                }*/
          }

          options.catcher(options);
        //            options.catcher(inner, options);
        }else if (inner.readyState == inner.FAILED_OPENING) {
          options.error = new err(err.UNAUTHORIZED);
          options.catcher(options);
        }else {
          // console.warn("->not happen", inner.readyState);
          // options.error = new err(err.SHOULD_NOT_HAPPEN);
          // options.catcher(options);
        }
      };

      // Inner XHR
      var inner = new xhr();

      inner.onreadystatechange = callback;
      // Set response fields
      options.error = null;
      options.data = null;
      // Reference the inner xhr
      options.inner = inner;

      try {
        inner.open(method, url, true);
      }catch (e) {
        console.error(url, options, e);
        throw 'Failed opening XHR request!';
      }

      for (var i in options.headers)
        inner.setRequestHeader(i, options.headers[i]);

      try {
        inner.send(payload);
      }catch (e) {
        console.error(url, options, e);
        throw 'Failed calling send on inner XHR request!';
      }

    };
  };

  scope.Mondane.POST = scope.Mondane.prototype.POST = 'POST';
  scope.Mondane.GET = scope.Mondane.prototype.GET = 'GET';
  scope.Mondane.DELETE = scope.Mondane.prototype.DELETE = 'DELETE';
  scope.Mondane.PUT = scope.Mondane.prototype.PUT = 'PUT';

}).apply(this, [jsBoot.core, Mingus.xhr.XMLHttpRequest, Mingus.xhr.appKeyEngine, Mingus.xhr.digest, jsBoot.core.ServiceError]);



var keyid = 'TEST';
var keysecret = 'TEST';


var host = 'localhost';
var version = '1.0';
var port = 8081;
var gate = 'connect/gate/0.1/gate.html';

var t = new jsBoot.core.Mondane(host, port, version, gate, keyid, keysecret);

// Set the gate path
// xhr.gatePath = gate;
// ake.setAppKey(host, keyid, keysecret);


var login = 'anonymous';
var password = '860b9dbbda6ee5f71ddf3b44e54c469e';
login = 'void@webitup.fr';
password = 'toto42';


t.login(login, password);
t.query({
  method: t.POST,
  name: 'users',
  command: 'authenticate',
  catcher: function(result){
    console.warn("am hip", result);
  }
});

/*
Roxee.gister.openpublic('Roxee.gist');
Roxee.gister.use('Mingus.xhr.XMLHttpRequest');
Roxee.gister.use('Mingus.xhr.appKeyEngine');
Roxee.gister.use('Mingus.xhr.digest');

Roxee.gister.pack('services', function() {
  var _api_ = this;




  var service;
  var anonymous;
  var userId = 'anonymous';


  // Private helper to init a request object
  var createOptions = function(catcher, onSuccess, onFailure, method, params, id, command, payload, headers) {
    return {
      method: (method || GET),
      params: (params || {}),
      onSuccess: onSuccess,
      onFailure: onFailure,
      id: id,
      command: command,
      catcher: catcher,
      payload: payload,
      headers: headers
    };
  };




  this.gist = new (function() {
    /**#@+
     * @lends Roxee.gist.services#prototype
     */

    /**
     * Sets the application "credentials".
     *
     * Calling this *first* is mandatory. Failure to do so will result in systematic errors on any service call.
     * Note this function does no network operation, and doesn't perform credentials validation...
     * If you mess-up, you'll only know from subsequent requests.
     * Note that changing key will actually logout a logged-in user.
     *
     * @function
     * @param {Roxee.gist.services.types.complex.AppKey} keySet The application appkey.
     * @returns {Boolean} Always return true...
     */
/*    this.initialize = function(keySet, ser, anon) {
      // XXX dirty
      anonymous = anon;
      service = ser;
      service.hostPort = service.host + (service.port ? (':' + service.port) : '');
      // Set the gate path
      _api_.XMLHttpRequest.gatePath = service.gatePath;
      _api_.appKeyEngine.setAppKey(service.host, keySet.id, keySet.secret);
      this.logout();
      return true;
    };



    this.user = new (function() {
      /**
       * A simple way to "loose" the user credentials.
       *
       * Being stateless, this performs no server action at all, and returns synchronously...
       *
       * @function
       * @returns {Boolean} Always return true...
       * @see Roxee.gist.services.login
       */
/*      this.logout = function() {
        userId = 'anonymous';
        var m = _api_.digest.getEngine(service.hostPort);
        m.login = anonymous.login;
        m.password = anonymous.password;
        return true;
      };

      /**
       * Checks if the user is logged-in.
       *
       * This is not a network function, and the service being stateless (stress that), doesn't mean the authent tokens
       * are *still* any good, or even that the user account is *still* valid.
       * It barely states that the last time we logged-in, it was successful.
       *
       * @function
       * @returns {Boolean} Returns true is the last login attempt was successful, or false if we are still anonymous.
       * @see Roxee.gist.services.login
       * @see Roxee.gist.services.logout
       */
/*      // XXX should an accessor, getter only
      this.isLogged = function() {
        return userId != 'anonymous';
      };


      /**
       * Allows to "login".
       *
       * Technically, as we are (almost) stateless, this does nothing more than checking that the provided user
       * credentials are valid.
       * App developers are strongly encouraged to call this as session start.
       * Unlogged access to the service API, while possible for parts of it, is discouraged.
       * Note that there is no way to dig-out the password once this method has been called.
       *
       * @function
       * @param {Roxee.gist.services.types.callbacks.Success} onSuccess Callback to be called on success (asynchronous).
       * @param {Roxee.gist.services.types.callbacks.Failure} onFailure Callback to be called on failure (asynchronous).
       * @param {Roxee.gist.services.types.UserEmail} login The main user email. Beware! Logins are case-insensitive!
       * @param {Roxee.gist.services.types.UserPassword} password The user password.
       * @returns {undefined} This function is asynchronous.
       * @see Roxee.gist.services.logout
       */
/*      this.login = function(onSuccess, onFailure, login, password, HA1, realm) {
        // Don't leak uid on successive login calls...
        userId = 'anonymous';
        // Roxee service is case-insensitive and suppose that the login are lowercase
        login = login.toLowerCase();
        // XXX we have some problems on the service with unicode in logins
        // value = encodeURIComponent(value).replace(/%/g, "\\x");

        var de = _api_.digest.getEngine(service.hostPort);
        de.login = login;
        if (password)
          de.password = password;
        else {
          de.ha1 = HA1;
          de.realm = realm;
        }

        // Base pattern
        var req = new coreObject(USER);
        var options = createOptions(catcher, onSuccess, onFailure, GET, {}, null, USER_CMD_AUTHENTICATE, {});
        req.doQuery(options);
      };


      /**
       * Creates a new user account.
       *
       * The error callback might receive: XXX DOCUMENT
       *
       * @param {Roxee.gist.services.types.callbacks.Success} onSuccess Callback to be called on success (asynchronous).
       * @param {Roxee.gist.services.types.callbacks.Failure} onFailure Callback to be called on failure (asynchronous).
       * @param {Roxee.gist.services.types.basic.UserName} username The username to use.
       * @param {Roxee.gist.services.types.basic.UserEmail} email The email to use (case-insensitive).
       * @param {Roxee.gist.services.types.basic.UserPassword} password The password to use.
       * @returns {undefined} This function is asynchronous.
       * @see Roxee.gist.services.account.validate
       */
/*      this.create = function(onSuccess, onFailure, username, email, password, gender, birthdate, beta) {
        var payload = {
          username: username,
          email: email.toLowerCase(),
          password: password,
          birthdate: birthdate,
          gender: gender,
          beta: beta
        };
        var options = createOptions(catcher, onSuccess, onFailure, POST, {}, null, USER_CMD_NEW, payload);
        req.doQuery(options);
      };
    })();
  }();
});
*/