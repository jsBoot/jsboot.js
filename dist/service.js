jsBoot.use('jsBoot.core.Error');

jsBoot.pack('jsBoot.service', function(api) {
  'use strict';
  this.Error = function(name, message, details) {
    api.Error.apply(this, arguments);
    this.details = details;
  };

  this.Error.prototype = Object.create(api.Error.prototype);

  ['OPENING_FAILED', 'SEND_FAILED', 'FAILED_UID', 'MEANINGLESS_DATA', 'BAD_REQUEST',
   'MISSING', 'BAD_REQUEST', 'UNAUTHORIZED', 'INVALID_SIGNATURE', 'WRONG_CREDENTIALS',
   'SHOULD_NOT_HAPPEN', 'SERVICE_UNAVAILABLE', 'UNSPECIFIED'].
      forEach(function(item) {
        this[item] = this.prototype[item] = item;
      }, this.Error);

});
/*global Mingus*/
jsBoot.add(Mingus.xhr.XMLHttpRequest).as('XMLHttpRequest');

jsBoot.use('jsBoot.service.Error');

jsBoot.pack('jsBoot.service', function(api) {
  /*global File, DOMParser, Blob*/
  'use strict';

  this.SimpleClient = function() {
  };

  var host;
  var port;
  var version;
  var userId;

  this.SimpleClient.configure = function(h, p, v) {
    this.host = host = h;
    this.port = port = p;
    this.version = version = v;
    userId = null;
  };

  Object.defineProperty(this.SimpleClient.prototype, 'userId', {
    get: function() {
      return userId;
    },
    set: function(v) {
      userId = v;
    }
  });

  Object.defineProperty(this.SimpleClient.prototype, 'hostPort', {
    get: function() {
      return host + (port ? ':' + port : '');
    }
  });

  Object.defineProperty(this.SimpleClient.prototype, 'version', {
    get: function() {
      return version;
    }
  });


  this.SimpleClient.prototype.url = function(options) {
    // XXX use an IRL object instead of that crap
    var url = '//' + host + (port ? ':' + port : '') + '/' + version;
    // Optional serviceName
    if (options.service)
      url += '/' + options.service;
    // Optional id
    if (options.id)
      url += '/' + encodeURIComponent(options.id);
    // Optional command
    if (options.command)
      url += '/' + options.command;
    // Opt parts
    if (options.additional)
      url += '/' + options.additional.map(encodeURIComponent).join('/');

    if (!options.params)
      options.params = {};

    // Build-up query string if any
    var query = [];
    if (options.params)
      Object.keys(options.params).forEach(function(i) {
        query.push(encodeURIComponent(i) + '=' + encodeURIComponent(options.params[i]));
      });

    if (query.length)
      url += '?' + query.join('&');

    return url;
  };

  var callback = function() {
    /*jshint maxcomplexity: 40*/
    // Free stuff
    var inner = this.inner;
    var failure = this.onfailure;
    var success = this.onsuccess;
    var restart = this.restart;

    if (inner.readyState == inner.FAILED_OPENING) {
      // options.error = new err(err.UNAUTHORIZED);
      // Clean-up
      this.onsuccess = this.onfailure = this.inner = this.restart = inner.onreadystatechange = null;
      this.error = new api.Error(api.Error.UNAUTHORIZED, 'Not authorized to access this', this);
      if (failure)
        failure(this.error);
      return;
    }

    // Ignore all-these
    if (inner.readyState != inner.DONE)
      return;

    // Clean-up now for good
    this.onsuccess = this.onfailure = this.inner = this.restart = inner.onreadystatechange = null;
    try {
      userId = inner.getResponseHeader('X-UID') || userId;
    }catch (e) {
      this.exception = e;
      throw new api.Error(api.Error.FAILED_UID, 'Cant read UID', this);
    }

    try {
      this.data = {};
      if (inner.responseText) {
        this.data = JSON.parse(inner.responseText);
      }
    }catch (e) {
      try {
        var parser = new DOMParser();
        this.data = parser.parseFromString(inner.responseText, 'application/xml');
      }catch (e2) {
        this.error = new api.Error(api.Error.MEANINGLESS_DATA, 'WHAT? ALBATROS?', this);
      }
      this.data.responseText = inner.responseText;
    }

    switch (inner.status) {
      case 200:
      case 201:
        break;
      case 308:
        this.id = null;
        this.params = {};
        this.url = inner.getResponseHeader('Location');
        restart.engine.query(restart.GET, this, restart.headers);
        return;
      case 400:
        this.error = new api.Error(api.Error.BAD_REQUEST, 'Bad request!', this);
        var errorInfo = {code: 100, error: 'GENERIC_ERROR'};
        try {
          errorInfo = JSON.parse(inner.responseText);
        }catch (e) {
        }
        this.data = errorInfo;
        break;
      case 401:
        if (inner.getResponseHeader('WWW-Authenticate')) {
          this.error = new api.Error(api.Error.WRONG_CREDENTIALS, 'Wrong street cred', this);
        }else {
          this.error = new api.Error(api.Error.INVALID_SIGNATURE, 'Invalid singing', this);
        }
        break;
      case 402:
      case 403:
      case 405:
      case 501:
        this.error = new api.Error(api.Error.UNAUTHORIZED, 'Not authorized to access this', this);
        break;
      case 404:
        this.error = new api.Error(api.Error.MISSING, 'Missing resource', this);
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
        this.error = new api.Error(api.Error.SHOULD_NOT_HAPPEN, 'Should never happen', this);
        break;
      case 500:
      case 503:
        this.error = new api.Error(api.Error.SERVICE_UNAVAILABLE, 'Server is down', this);
        break;

      case 0:
        this.error = new api.Error(api.Error.UNAUTHORIZED, 'Not authorized to access this', this);
        break;
      default:
        this.error = new api.Error(api.Error.UNSPECIFIED, 'WTF?', this);
        break;
    }

    if (success && !this.error)
      success(this.data);
    // XXX Roxee depends on this old API
    if (failure && this.error)
      failure(this.error, this.data, inner);
  };


  this.SimpleClient.prototype.query = function(method, options, headers) {
    /*jshint maxcomplexity: 12*/
    // Default method
    method = (method || this.GET);
    var url = options.url || this.url(options);

    // If no headers are provided, set Accept to app/json
    if (!headers)
      headers = {};
    headers.Accept = 'application/json';
    // Add our signature here - XXX shit
    headers['X-IID'] = 'web';

    // Inner XHR
    var inner = new api.XMLHttpRequest();
    // Reference the inner xhr and other useful objects to possibly restart
    options.inner = inner;

    // Set response fields
    options.error = null;
    options.data = null;

    // Attach our callback mech
    inner.onreadystatechange = callback.bind(options);

    try {
      inner.open(method, url, true);
    }catch (e) {
      options.exception = e.toString();
      throw new api.Error(api.Error.OPENING_FAILED, 'Failed opening likely bogus request', options);
    }

    // Prepare payload if any
    var payload = options.payload;

    if (method == this.POST) {
      if ((typeof File != 'undefined') && (typeof Blob != 'undefined') && ((payload instanceof File) ||
          (payload instanceof Blob))) {
        headers['Content-Type'] = payload.type;
      }else {
        try {
          if (!('Content-Type' in headers) || (headers['Content-Type'] == 'application/json')) {
            payload = JSON.stringify(payload);
            headers['Content-Type'] = 'application/json';
          }
        }catch (e) {
          if (!('Content-Type' in headers))
            headers['Content-Type'] = 'image/jpeg';
        }
      }
    }

    Object.keys(headers).forEach(function(i) {
      inner.setRequestHeader(i, headers[i]);
    });

    // For restarters
    options.restart = {
      engine: this,
      method: method,
      headers: headers
    };

    try {
      inner.send(payload);
    }catch (e) {
      options.exception = e;
      throw new api.Error(api.Error.SEND_FAILED, 'Failed sending. Bogus payload?', options);
    }
  };

  this.SimpleClient.HEAD = this.SimpleClient.prototype.HEAD = 'HEAD';
  this.SimpleClient.GET = this.SimpleClient.prototype.GET = 'GET';
  this.SimpleClient.POST = this.SimpleClient.prototype.POST = 'POST';
  this.SimpleClient.PATCH = this.SimpleClient.prototype.PATCH = 'PATCH';
  this.SimpleClient.PUT = this.SimpleClient.prototype.PUT = 'PUT';
  this.SimpleClient.DELETE = this.SimpleClient.prototype.DELETE = 'DELETE';

});
/*global Mingus*/
jsBoot.add(Mingus.xhr.XMLHttpRequest).as('XMLHttpRequest');
jsBoot.add(Mingus.xhr.digest).as('digest');
jsBoot.add(Mingus.xhr.appKeyEngine).as('appKeyEngine');

jsBoot.use('jsBoot.service.SimpleClient');
jsBoot.use('jsBoot.service.Error');

jsBoot.pack('jsBoot.service', function(api) {
  'use strict';

  var anonymous;

  var USER = 'users';
  var USER_CMD_AUTHENTICATE = 'authenticate';

  this.core = new (function() {


    /**
     * This singleton provides access to the ponyxpress services.
     *
     * It sports a couple of simple methods to authenticate / set the application identity, and expose a number of other
     * namespaces specifically providing access to different types of datas (accounts, user, friends, collections, etc).
     * By default, the services is not authenticated, and has no app key set.
     * It is the responsibility of the embedder to obtain a service key, use it, and login appropriately.
     * Unauthenticated users can't do much as far as user accounts are concerned obviously,
     * though parts of the API are still usable.
     *
     * @namespace The services namespace
     * @requires Mingus.appKeyEngine
     * @requires Mingus.digestEngine
     * @requires Mingus.XMLHttpRequest
     * @requires Roxee.gist.services.errors
     * @type {Object}
     *
     */

    this.requestor = new api.SimpleClient();

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
    this.initialize = function(keySet, service, anon) {
      anonymous = anon;

      // Set the gate path
      var shortversion = '0.4.0'.split('.');
      api.XMLHttpRequest.gatePath = '/' + service.version + '/connect/gate/' + shortversion.shift() +
          '.' + shortversion.shift() + '/gate.html';
      // And the requestor end-point
      api.SimpleClient.configure(service.host, service.port, service.version);
      // And the app key
      api.appKeyEngine.setAppKey(service.host, keySet.id, keySet.secret);
      // Logout for good measure
      this.logout();
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
    this.authenticate = function(onSuccess, onFailure, login, password, HA1, realm) {
      // Don't leak uid on successive login calls...
      this.requestor.userId = anonymous.id;
      var digestEngine = api.digest.getEngine(this.requestor.hostPort);
      // Roxee service is case-insensitive and suppose that the login are lowercase
      // XXX we have some problems on the service with unicode in logins
      // value = encodeURIComponent(value).replace(/%/g, "\\x");
      digestEngine.login = login.toLowerCase();
      if (password)
        digestEngine.password = password;
      else {
        digestEngine.ha1 = HA1;
        digestEngine.realm = realm;
      }

      // Base pattern - XXX Roxee still uses GET for authenticate prolly
      this.requestor.query(this.requestor.POST, {
        service: USER,
        onsuccess: onSuccess,
        onfailure: onFailure,
        command: USER_CMD_AUTHENTICATE,
        // XXX because of Varnish pendantric attitude, need a payload
        payload: {}
      });
    };


    /**
     * A simple way to "loose" the user credentials.
     *
     * Being stateless, this performs no server action at all, and returns synchronously...
     *
     * @function
     * @returns {Boolean} Always return true...
     * @see Roxee.gist.services.login
     */
    this.logout = function() {
      this.requestor.userId = anonymous.id;
      var digestEngine = api.digest.getEngine(this.requestor.hostPort);
      digestEngine.login = anonymous.login;
      digestEngine.password = anonymous.password;
      return true;
    };

    Object.defineProperty(this, 'login', {
      get: function() {
        return api.digest.getEngine(this.requestor.hostPort).login;
      }
    });

    Object.defineProperty(this, 'id', {
      get: function() {
        return this.requestor.userId;
      }
    });

  })();
});

/*global Mingus*/
jsBoot.add(Mingus.xhr.digest).as('digest');

jsBoot.use('jsBoot.service.core');

jsBoot.pack('jsBoot.service', function(api) {
  'use strict';
  var requestor = api.core.requestor;

  var USER = 'users';
  var USER_CMD_SUPPRESS = '';
  var USER_CMD_ACTIVATE = 'activate';
  var USER_CMD_DEACTIVATE = 'deactivate';
  var USER_CMD_VALIDATE = 'validate';

  //- Account
  // [POST] /1.0/users/new
  //username (min=6, max=25)
  //email (min=6, max=35)
  //password (min=6, max=25)
  // [POST] /1.0/users/validate
  //email
  //code
  // [POST] /1.0/users/authenticate
  // [WIP] [POST] /1.0/users/37a749d808e46495a8da1e5352d03cae/activate
  // [WIP] [POST] /1.0/users/37a749d808e46495a8da1e5352d03cae/deactivate
  // [WIP] [DELETE] /1.0/users/37a749d808e46495a8da1e5352d03cae/?

  /**
   * This service is meant to manipulate the user account *states*.
   *
   * It manages all the creation steps, and can deactivate/activate/destroy a user account.
   * Obviously, only the owner can manipulate its account, and only the anonymous user can create a new account.
   * BIG FAT WARNING: this it NOT open to third-party applications. Only the roxee application can do that.
   *
   * @namespace The "account" service manager
   * @name Roxee.gist.services.account
   * @requires  Roxee.gist.services
   * @type {Object}
   */
  this.account = new (function() {
    /**#@+
     * @function
     * @lends Roxee.gist.services.account#prototype
     */

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
    this.create = function(onSuccess, onFailure, username, email, password, payload) {
      requestor.query(requestor.POST, {
        service: USER,
        onsuccess: onSuccess,
        onfailure: onFailure,
        // XXX Dirty trick while manu fixes his internal redirects lacking trailing slash
        command: '#',
        payload: {
          username: username,
          email: email.toLowerCase(),
          password: password,
          extra: payload || {}
        }
      });
    };


    /**
     * Validate a newly created user account.
     *
     * The error callback might receive: XXX DOCUMENT
     *
     * @param {Roxee.gist.services.types.callbacks.Success} onSuccess Callback to be called on success (asynchronous).
     * @param {Roxee.gist.services.types.callbacks.Failure} onFailure Callback to be called on failure (asynchronous).
     * @param {Roxee.gist.services.types.basic.UserEmail} email The email to use.
     * @param {Roxee.gist.services.types.basic.ValidationCode} code The code that the user received by email.
     * @returns {undefined} This function is asynchronous.
     * @see Roxee.gist.services.account.create
     */
    this.validate = function(onSuccess, onFailure, email, code) {
      var payload = {
        code: code,
        email: email
      };
      requestor.query(requestor.POST, {
        service: USER,
        onsuccess: onSuccess,
        onfailure: onFailure,
        command: USER_CMD_VALIDATE,
        payload: payload
      });
    };

    /**
     * A method to "re-activate" a de-activated user account.
     *
     * De-activated user accounts are not usable anymore by the owner, though other users may still
     * interact with them.
     * De-activated accounts have suspended payment.
     * Activating a de-activated user account makes payment ongoing again.
     * Obviously only the owner can activate/deactivate its account.
     *
     * @see Roxee.gist.services.account.deactivate
     * @param {Roxee.gist.services.types.callbacks.Success} onSuccess Callback to be called on success (asynchronous).
     * @param {Roxee.gist.services.types.callbacks.Failure} onFailure Callback to be called on failure (asynchronous).
     * @returns {undefined} This function is asynchronous.
     */
    this.activate = function(onSuccess, onFailure) {
      requestor.query(requestor.POST, {
        service: USER,
        onsuccess: onSuccess,
        onfailure: onFailure,
        id: (arguments.length == 3) ? arguments[2] : api.core.id,
        command: USER_CMD_ACTIVATE
      });
    };

    /**
     * A method to "de-activate" an active user account.
     *
     * @see Roxee.gist.services.account.activate
     * @param {Roxee.gist.services.types.callbacks.Success} onSuccess Callback to be called on success (asynchronous).
     * @param {Roxee.gist.services.types.callbacks.Failure} onFailure Callback to be called on failure (asynchronous).
     * @returns {undefined} This function is asynchronous.
     */
    this.deactivate = function(onSuccess, onFailure) {
      requestor.query(requestor.POST, {
        service: USER,
        onsuccess: onSuccess,
        onfailure: onFailure,
        id: (arguments.length == 3) ? arguments[2] : api.core.id,
        command: USER_CMD_DEACTIVATE
      });
    };

    /**
     * A method to permanently delete a user account.
     *
     * Deleted user accounts can't be retrieved, can't be interacted with, can't be consulted.
     * This is *freaking* permanent.
     * Only the Roxee application can use this method.
     *
     * @param {Roxee.gist.services.types.callbacks.Success} onSuccess Callback to be called on success (asynchronous).
     * @param {Roxee.gist.services.types.callbacks.Failure} onFailure Callback to be called on failure (asynchronous).
     * @returns {undefined} This function is asynchronous.
     */
    this.destroy = function(onSuccess, onFailure) {
      requestor.query(requestor.DELETE, {
        service: USER,
        onsuccess: onSuccess,
        onfailure: onFailure,
        id: (arguments.length == 3) ? arguments[2] : api.core.id,
        command: USER_CMD_SUPPRESS
      });
    };

    /**#@-*/

    /*
     this.confirmSuppress= function(onSuccess, onFailure, id, token){
     req.POST(id, "confirmSuppress", null, null, onSuccess, onFailure);
     };
     */
  })();
});
/**
 * Sample application controller.
 *
 * @file
 * @summary Single app helper.
 *
 * @author WebItUp
 * @version 0.4.0
 *
 * @license <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 * @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 * @name https://github.com/jsBoot/jsboot.js/blob/master/src/jsboot/controllers/singleapp.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 */

// Time to fail on asynchronous initialization of stuff

/*global Mingus*/
jsBoot.add(5000).as('failureGrace');
jsBoot.add(Mingus.xhr.digest).as('digest');
jsBoot.use('jsBoot.core.Error');
jsBoot.use('jsBoot.types.Mutable');
jsBoot.use('jsBoot.service.core').as('service');
jsBoot.use('jsBoot.utils.storage');
jsBoot.use('jsBoot.controllers.singleApp');
jsBoot.use('jsBoot.controllers.userActivity');

jsBoot.pack('jsBoot.controllers', function(api) {
  /*jshint browser:true*/
  'use strict';

  var Application = function() {
    // We are an event dispatcher
    api.Mutable.apply(this);

    this.NOT_INITED = 'not';
    this.LOCKED_OUT = 'fail';
    this.USER_OUT = 'uout';
    this.SHUTDOWN = 'end';
    var INITIALIZED = this.INITIALIZED = 'inited';
    var USER_READY = this.USER_READY = 'uready';
    var USER_FAIL = this.USER_FAIL = 'ufail';

    this.status = this.NOT_INITED;

    Object.defineProperty(this, 'userIdentifier', {
      configurable: true,
      enumerable: true,
      get: function() {
        return api.service.id;
      }
    });

    var currentDelay = {};
    var delayers = {};
    var delayExec = {};
    var currentlyLocked;

    this.delay = function(phase, callback) {
      if (!(phase in delayers)) {
        delayers[phase] = 0;
        currentDelay[phase] = 0;
        delayExec[phase] = [];
      }
      delayExec[phase].push(callback);
      delayers[phase]++;
      currentDelay[phase]++;
    };

    var tout;
    // Unfortunately, very late delayers can still kick-in here...
    var unlock = function(phase) {
      if (currentlyLocked != phase)
        throw new api.Error('FAILURE_DELAYER', 'A very late delayer returned. Ignored.');
      currentDelay[phase]--;
      if (!currentDelay[phase]) {
        window.clearTimeout(tout);
        currentDelay[phase] = delayers[phase];
        currentlyLocked = null;
        this.set('status', phase);
      }
    };

    var cautiousStatus = (function(phase) {
      if (!(phase in delayers) || !currentDelay[phase])
        this.set('status', phase);
      else {
        currentlyLocked = phase;
        if (tout)
          window.clearTimeout(tout);
        tout = window.setTimeout((function() {
          currentDelay[phase] = delayers[phase];
          currentlyLocked = null;
          this.set('status', phase);
          throw new api.Error('FAILURE_DELAYER', 'Something delayer you did failed. Bitch, please!');
        }.bind(this)), api.failureGrace);
        // Now, call everybody
        var d = unlock.bind(this, phase);
        delayExec[phase].forEach(function(cbk) {
          cbk(d);
          // try{
          // }catch(e){
          //   console.error(e);
          //   throw new api.Error('STRAIGHT_FAILURE', 'What you do is killing kittens, sir.');
          // }
        });
      }
    }.bind(this));


    var autologin = {};
    var wantAuto = false;
    var onloginupdate = function(login, ha1, realm) {
      autologin.login = login;
      autologin.ha1 = ha1;
      autologin.realm = realm;
      api.storage.commit();
    };

    // Autocommit magic
    var needCommit = true;
    var commitonstale = function() {
      api.userActivity.addEventListener(api.userActivity.STATE_CHANGED, function() {
        if (api.userActivity.staled && needCommit) {
          needCommit = false;
          api.storage.commit();
        }
        if (api.userActivity.status == api.userActivity.ACTIVE)
          needCommit = true;
      });
    };

    this.boot = function(appKeyStore, serviceConfig) {
      if (this.status != this.NOT_INITED)
        throw new api.Error('ALREADY_BOOTED', 'You cant boot twice darling');
      // This is a singled app - don't boot anything unless acquiring the lock
      api.singleApp.addEventListener(api.singleApp.STATE_CHANGED, function() {
        // Wait until the lock is owned - but notify everyone still
        if (api.singleApp.status == api.singleApp.WAITING) {
          this.set('status', this.LOCKED_OUT);
          return;
        }
        // Boot the storage if we can own the lock
        api.storage.boot(appKeyStore, function() {
          // Init the storage space for autologin
          if (!('autologin' in api.storage.persistent))
            api.storage.persistent.autologin = {
              login: null,
              ha1: null,
              realm: null
            };
          // Hook ourselves onto that
          autologin = api.storage.persistent.autologin;
          // Register listeners so we commit on stale
          commitonstale();
          cautiousStatus(INITIALIZED);
        });
      }, this);

      api.userActivity.boot();
      api.singleApp.boot(appKeyStore);
      if (serviceConfig)
        api.service.initialize(serviceConfig.key, serviceConfig.server, serviceConfig.anonymous);
    };

    this.login = function(login, password, wantAutoLogin, ha1, realm) {
      if (this.status != this.INITIALIZED)
        throw new api.Error('NOT_READY', 'You must init the app before you can login');

      wantAuto = wantAutoLogin;
      api.service.authenticate(function() {
        // Save credentials if we want autologin
        if (wantAuto) {
          var d = api.digest.getEngine(api.service.requestor.hostPort);
          onloginupdate(
              login,
              d.ha1,
              d.realm,
              wantAutoLogin
          );
        }

        // Boot user-storage as well
        api.storage.login(api.service.id, function() {
          cautiousStatus(USER_READY);
        });
      }, function() {
        cautiousStatus(USER_FAIL);
      }, login, password, ha1, realm);
    };

    this.logout = function() {
      // Let delayers do their deed
      cautiousStatus(this.USER_OUT);
    };

    // XXX that just works randomly if already in a unload routine...
    this.shutdown = function() {
      if (this.status != this.NOT_INITED)
        cautiousStatus(this.SHUTDOWN);
    };

    this.addEventListener(this.AFTER_MUTATION, function() {
      switch (this.status) {
        case this.INITIALIZED:
          // If we hold credentials, try them directly
          if (autologin.login)
            this.login(autologin.login, null, true, autologin.ha1, autologin.realm);
          break;
        case this.USER_FAIL:
          // Reset any stored property on failure
          onloginupdate(null, null, null);
          // Go back to initialize without pre-hooks (?)
          this.set('status', this.INITIALIZED);
          // cautiousStatus(this.INITIALIZED);
          break;
        case this.USER_OUT:
          // Explicit logout should destroy stored properties
          onloginupdate(null, null, null);
          // Logout of the service
          api.service.logout();
          // Logout of the storage, and say initialized cautiously then
          api.storage.logout(function() {
            cautiousStatus(INITIALIZED);
          });
          break;
        case this.SHUTDOWN:
          // Shutdown storage
          api.storage.shutdown(function() {
            // Shutdown single app
            api.singleApp.shutdown();
            // Shutdown user activity watcher
            api.userActivity.shutdown();
          });
          break;
        default:
          break;
      }
    }, this);

  };

  Application.prototype = Object.create(api.Mutable.prototype);

  this.application = new Application();

  // This will just NOT work
  window.onbeforeunload = (function(/*e*/) {
    this.shutdown();
  }.bind(this.application));
});
