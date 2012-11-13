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
   * @extends Object
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
      payload = payload || {};
      payload.username = username;
      payload.email = email.toLowerCase();
      payload.password = password;
      requestor.query(requestor.POST, {
        service: USER,
        onsuccess: onSuccess,
        onfailure: onFailure,
        // Dirty trick while manu fixes his internal redirects lacking trailing slash
        command: '#', //   var USER_CMD_NEW = 'new';
        payload: payload
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
