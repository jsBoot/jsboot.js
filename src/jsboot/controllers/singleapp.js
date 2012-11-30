/**
 * Single app helper.
 *
 * @file
 * @summary Single app helper.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/controllers/singleapp.js{PUKE-GIT-REVISION}
 */

/*jshint browser:true*/
jsBoot.add(window.localStorage).as('localStorage');
jsBoot.add(window.sessionStorage).as('sessionStorage');
// Lifetime of a (stale) lock, before aquiring
jsBoot.add(1000).as('lifeLength');

jsBoot.use('jsBoot.types.EventDispatcher');
jsBoot.use('jsBoot.core.Error');

jsBoot.pack('jsBoot.controllers', function(api) {
  'use strict';

  // Trivial low level helpers
  var getId = function(name) {
    var id;
    // No session storage means we won't persist over reloads
    if (api.sessionStorage)
      id = api.sessionStorage.getItem('_jsbootsingleapp_' + name + '_instanceId');
    if (!id) {
      id = Date.now() + '-' + Math.random(1000);
      if (api.sessionStorage)
        api.sessionStorage.setItem('_jsbootsingleapp_' + name + '_instanceId', id);
    }
    return id;
  };

  var read = function(name) {
    return (api.localStorage.getItem('_jsbootsingleapp_' + name + '_lockname') || '').split('_');
  };

  var write = function(name, d) {
    api.localStorage.setItem('_jsbootsingleapp_' + name + '_lockname', d);
  };

  var kill = function(name) {
    api.localStorage.removeItem('_jsbootsingleapp_' + name + '_lockname');
  };

  var lockOwner;
  var isOwned = false;
  var saidFail = false;

  var ticker = function(appKey, instanceId, success, failure) {
    // Decide whether to acquire lock or not
    var currentOwner = read(appKey);
    // The lock is already there. Is it ours? Is it still valid?
    if ((currentOwner.pop() != instanceId) && ((Date.now() - currentOwner.shift()) < api.lifeLength)) {
      // If we previously owned it, or haven't spoken yet, scream!!!
      if (isOwned || !saidFail) {
        isOwned = false;
        saidFail = true;
        failure();
      }
      return;
    }

    // Otherwise, confirm / acquire lock
    if (!isOwned) {
      isOwned = true;
      saidFail = false;
      success();
    }
    // We do this after in order to resist porn mode conditions making the setItem call fail
    write(appKey, Date.now() + '_' + instanceId);
  };

  var free = function(appKey, instanceId) {
    // Clear timeout
    if (lockOwner) {
      window.clearInterval(lockOwner);
      lockOwner = undefined;
    }
    // Clean the lock if we own it
    if (read(appKey).pop() == instanceId)
      kill(appKey);
    // Reset
    isOwned = false;
    saidFail = false;
  };

  var own = function(key, id, ticktime, success, failure) {
    lockOwner = window.setInterval(ticker, ticktime, key, id, success, failure);
  };

  var ACQUIRED = 'acquired';
  var WAITING = 'waiting';
  var status;

  var success = function() {
    status = ACQUIRED;
    this.dispatchEvent(this.STATE_CHANGED);
  };

  var failure = function() {
    status = WAITING;
    this.dispatchEvent(this.STATE_CHANGED);
    throw new api.Error('ALREADY_LOCKED',
        'Another instance of the app is already running.', true);
  };

  var SingleApp = function() {
    api.EventDispatcher.apply(this);

    Object.defineProperty(this, 'status', {
      enumerable: true,
      get: function() {
        return status;
      }
    });

    var akey;
    var iid;

    this.boot = function(appKey, length) {
      if (length)
        api.lifeLength = length * 1000;
      status = WAITING;
      akey = appKey;
      iid = getId(akey);
      // Do good measure: cleanup shit if we were there before
      free(akey, iid);
      own(akey, iid, api.lifeLength / 2, success.bind(this), failure.bind(this));
    };

    this.shutdown = function() {
      this.destroy();
      free(akey, iid);
      akey = iid = null;
    };
  };

  SingleApp.prototype = Object.create(api.EventDispatcher.prototype);
  SingleApp.prototype.ACQUIRED = ACQUIRED;
  SingleApp.prototype.WAITING = WAITING;
  SingleApp.prototype.STATE_CHANGED = 'state_changed';

  this.singleApp = new SingleApp();

});

