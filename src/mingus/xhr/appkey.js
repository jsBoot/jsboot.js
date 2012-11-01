/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Provides an app key engine.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/mingus/xhr/appkey.js{PUKE-PACKAGE-GIT-REV}
 */


(function() {
  /*global Mingus, console*/
  'use strict';

  /**
 * @kind enum
 * @name appKeyErrors
 * @memberof Mingus.xhr
 * @summary Errors spat by the app key manager
 * @type {Int}
 * @constant
 */
  Mingus.xhr.appKeyErrors = {
    /**
   * @description No key was registered for that host
   */
    UNREGISTERED_HOST: 1,
    /**
   * @description Provided date can't be parsed
   */
    UNPARSABLE_DATE: 2
  };


  /**
 * @kind namespace
 * @name appKeyEngine
 * @memberof Mingus.xhr
 * @summary App key engine
 * @description  Appkey engine public API
 * @requires Mingus.crypto.md5
 * @requires Mingus.xhr.appKeyErrors
 */
  Mingus.xhr.appKeyEngine = new (function(err, md5) {
    /**
   * @summary Contains the engine data
   * @description Allows the consumer to set/get all data of the engine and possibly have it persist somewhere.
   * Note there is no consistency check on setting. Up to you to trash the thing...
   * @static
   * @name data
   * @type {Object}
   * @member
   * @memberof Mingus.xhr.appKeyEngine
   */
    this.data = {};

    /**
   * @kind function
   * @name getSignature
   * @memberof Mingus.xhr.appKeyEngine
   * @summary Compute a signature.
   * @param {String} keyId The application keyId.
   * @param {String} secretKey The application secret.
   * @returns {undefined}
   */
    this.getSignature = function(host, path, method) {
      console.debug('    |AE| get signature for', host, path, method);
      if (!(host in this.data))
        throw new Error(err.UNREGISTERED_HOST);
      var keyId = this.data[host].keyId;
      var secretKey = this.data[host].secretKey;
      var ts = Math.round(new Date().getTime() / 1000) - this.data[host].delta;
      var ha = md5.crypt([keyId, secretKey, ts].join(':'));
      var signature = md5.crypt([method, path, ha].join(':'));
      return 'access Timestamp="' + ts + '", ' +
          'Signature="' + signature + '", ' +
          'KeyId="' + keyId + '", ' +
          'Algorithm="md5"';
    };

    /**
   * @kind function
   * @name setAppKey
   * @memberof Mingus.xhr.appKeyEngine
   * @summary Allows to set the global appkey (no per-host support for now).
   * @param {String} keyId The application keyId.
   * @param {String} secretKey The application secret.
   * @returns {undefined}
   */
    this.setAppKey = function(host, keyId, secretKey) {
      console.debug('    |AE| set key for', host, keyId, secretKey);
      if (!(host in this.data))
        this.data[host] = {keyId: keyId, secretKey: secretKey, delta: 0};
      else {
        this.data[host].keyId = keyId;
        this.data[host].secretKey = secretKey;
      }
    };

    /**
   * @kind function
   * @name setAppKey
   * @memberof Mingus.xhr.appKeyEngine
   * @summary Allows to set an external time as to workaround (local) time shifts.
   * @param {String} host A hostname.
   * @param {String} serverDate A parsable date string.
   * @returns {undefined}
   */
    this.setTime = function(host, serverDate) {
      console.debug('    |AE| set time for', host, serverDate);
      var ts = Date.parse(serverDate) / 1000;
      if (isNaN(ts))
        throw new Error(err.UNPARSABLE_DATE);
      if (!(host in this.data))
        this.data[host] = {};
      this.data[host].delta = Math.round(new Date().getTime() / 1000) - ts;
    };

  })(Mingus.xhr.appKeyErrors, Mingus.crypto.md5);

})();
