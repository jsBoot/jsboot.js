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
jsBoot.add(5000).as('failureGrace');
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
    this.INITIALIZED = 'inited';
    var USER_READY = this.USER_READY = 'uready';
    this.USER_FAIL = 'ufail';
    this.USER_OUT = 'uout';
    this.SHUTDOWN = 'end';
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


    this.boot = function(appKeyStore, serviceConfig) {
      // This is a singled app - don't boot anything unless acquiring the lock
      api.singleApp.addEventListener(api.singleApp.STATE_CHANGED, function() {
        // Wait until the lock is owned - but notify everyone still
        if (api.singleApp.status == api.singleApp.WAITING) {
          this.set('status', this.LOCKED_OUT);
          return;
        }
        // Boot the storage - but allow
        api.storage.boot(appKeyStore, (function() {
          cautiousStatus(this.INITIALIZED);
        }.bind(this)));
      }, this);

      api.userActivity.boot();
      api.singleApp.boot(appKeyStore);
      if (serviceConfig)
        api.service.initialize(serviceConfig.key, serviceConfig.server, serviceConfig.anonymous);
    };

    this.login = function(login, password) {
      if (this.status != this.INITIALIZED && this.status != this.USER_FAIL)
        throw new api.Error('NOT_READY', 'You must init the app before you can login');

      api.service.authenticate(function() {
        // Boot storage as well
        api.storage.login(api.service.id, function() {
          cautiousStatus(USER_READY);
        });
      }, (function() {
        this.set('status', this.USER_FAIL);
        this.set('status', this.INITIALIZED);
      }.bind(this)), login, password);
    };

    this.logout = function() {
      // Let delayers do their deed
      cautiousStatus(this.USER_OUT);
    };

    this.shutdown = function() {
      cautiousStatus(this.SHUTDOWN);
    };

    this.addEventListener(this.AFTER_MUTATION, function() {
      switch (this.status) {
        case this.USER_OUT:
          api.service.logout();
          api.storage.logout((function() {
            cautiousStatus(this.INITIALIZED);
          }.bind(this)));
          break;
        case this.SHUTDOWN:
          api.storage.shutdown(function() {
            api.singleApp.shutdown();
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

  window.onbeforeunload = (function(/*e*/) {
    this.shutdown();
  }.bind(this.application));
});
