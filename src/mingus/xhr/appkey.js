/**
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @version {PUKE-PACKAGE-VERSION}
 * @location {PUKE-PACKAGE-GIT-ROOT}/lib/com/wiu/mingus/xhr/appkey.js
 * @fileOverview Provides an app key engine.
 * @author {PUKE-PACKAGE-AUTHOR}
 */


/**
 * @namespace Errors spat by the app key manager
 */
Mingus.xhr.appKeyErrors = {
  /**#@+
   * @constant
   * @type Roxee.gist.services.types.basic.Error
   */
  /**
   * No key was registered for that host
   */
  UNREGISTERED_HOST: 1,
  /**
   * Provided date can't be parsed
   */
  UNPARSABLE_DATE: 2
  /**#@-**/
};


/**
 * Appkey engine public API
 * @namespace App key engine
 * @requires Mingus.crypto.md5
 */
Mingus.xhr.appKeyEngine = new (function(err, md5) {
  /**#@+
   * @function
   * @lends Mingus.xhr.appKeyEngine#prototype
   */

  /**
   * Allows the consumer to set/get all data of the engine and possibly have it persist somewhere.
   * Note there is no consistency check on setting. Up to you to trash the thing...
   * @static
   * @type {Object}
   * @property
   */
  this.data = {};

  /**
   * Compute a signature.
   * @function
   * @static
   * @param {String} keyId The application keyId.
   * @param {String} secretKey The application secret.
   * @returns {undefined}
   */
  this.getSignature = function(host, path, method) {
    console.debug('    |AE| get signature for', host, path, method);
    try {
      keyId = this.data[host].keyId;
      secretKey = this.data[host].secretKey;
    }catch (e) {
      throw new Error(err.UNREGISTERED_HOST);
    }
    var ts = Math.round(new Date().getTime() / 1000) - this.data[host].delta;
    var ha = md5.crypt([keyId, secretKey, ts].join(':'));
    var signature = md5.crypt([method, path, ha].join(':'));
    return 'access Timestamp="' + ts + '", ' +
        'Signature="' + signature + '", ' +
        'KeyId="' + keyId + '", ' +
        'Algorithm="md5"';
  };

  /**
   * Allows to set the global appkey (no per-host support for now)
   * @function
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
   * Allows to set an external time as to workaround (local) time shifts
   * @function
   * @param {String} host A hostname.
   * @param {String} serverDate A parsable date string.
   * @returns {undefined}
   */
  this.setTime = function(host, serverDate) {
    console.debug('    |AE| set time for', host, serverDate);
    var ts = Date.parse(serverDate) / 1000;
    if (ts == NaN)
      throw new Error(err.UNPARSABLE_DATE);
    if (!(host in this.data))
      this.data[host] = {};
    this.data[host].delta = Math.round(new Date().getTime() / 1000) - ts;
  };

  /**#@-*/

})(Mingus.xhr.appKeyErrors, Mingus.crypto.md5);
