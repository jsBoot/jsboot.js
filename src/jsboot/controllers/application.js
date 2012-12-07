/**
 * Sample application controller.
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
