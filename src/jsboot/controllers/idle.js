/**
 * User activity controller that dispatch changes (blur, idle, active).
 *
 * @file
 * @summary User activity helper.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/controllers/idle.js{PUKE-GIT-REVISION}
 */

/*jshint browser:true*/
jsBoot.use('jsBoot.types.EventDispatcher');
jsBoot.add(500).as('idleTime');
jsBoot.add(20000).as('staleTime');
jsBoot.pack('jsBoot.controllers', function(api) {
  'use strict';

  var STATE_CHANGED = 'STATE_CHANGED';
  var ACTIVE = 'ACTIVE';
  var IDLE = 'IDLE';
  var BLURRED = 'BLURRED';

  var UserActivityController = function() {
    // We are an event dispatcher
    api.EventDispatcher.apply(this);

    var idleInterval;
    var lastActive = Date.now();
    var lastState = IDLE;
    var staled = false;

    Object.defineProperty(this, 'status', {
      get: function() {
        return lastState;
      }
    });

    Object.defineProperty(this, 'staled', {
      get: function() {
        return staled;
      }
    });

    var checkState = (function() {
      if (lastState == ACTIVE) {
        if ((Date.now() - lastActive) > api.idleTime) {
          lastState = IDLE;
          this.dispatchEvent(STATE_CHANGED);
        }
      }else if (!staled) {
        if ((Date.now() - lastActive) > api.staleTime) {
          staled = true;
          this.dispatchEvent(STATE_CHANGED);
        }
      }
    }.bind(this));

    var isActive = (function() {
      if (lastState == BLURRED)
        return;
      lastActive = Date.now();
      if (lastState == IDLE) {
        lastState = ACTIVE;
        staled = false;
        this.dispatchEvent(STATE_CHANGED);
      }
    }.bind(this));

    var isBlur = (function() {
      lastState = BLURRED;
      this.dispatchEvent(STATE_CHANGED);
    }.bind(this));

    var isFocus = (function() {
      lastActive = Date.now();
      lastState = ACTIVE;
      staled = false;
      this.dispatchEvent(STATE_CHANGED);
    }.bind(this));

    this.boot = function(time, staleTime) {
      // Allow override of the default time
      if (time)
        api.idleTime = time * 1000;
      if (staleTime)
        api.staleTime = staleTime * 1000;
      // Idling support
      document.addEventListener('mousemove', isActive, true);
      document.addEventListener('click', isActive, true);
      document.addEventListener('dblclick', isActive, true);
      window.addEventListener('keypress', isActive, true);
      window.addEventListener('blur', isBlur, true);
      window.addEventListener('focus', isFocus, true);

      idleInterval = setInterval(checkState, api.idleTime / 2);
    };

    this.shutdown = function() {
      // Kill all refs to listeners
      this.destroy();
      clearInterval(idleInterval);
      // Idling support
      document.removeEventListener('mousemove', isActive, true);
      document.removeEventListener('click', isActive, true);
      document.removeEventListener('dblclick', isActive, true);
      window.removeEventListener('keypress', isActive, true);
      window.removeEventListener('blur', isBlur, true);
      window.removeEventListener('focus', isFocus, true);
    };
  };

  UserActivityController.prototype = Object.create(api.EventDispatcher.prototype, {
    STATE_CHANGED: {value: STATE_CHANGED, writable: false, enumerable: true},
    ACTIVE: {value: ACTIVE, writable: false, enumerable: true},
    IDLE: {value: IDLE, writable: false, enumerable: true},
    BLURRED: {value: BLURRED, writable: false, enumerable: true}
  });

  this.userActivity = new UserActivityController();
});
