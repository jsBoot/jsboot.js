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
      var shortversion = '{PUKE-PACKAGE-VERSION}'.split('.');
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

