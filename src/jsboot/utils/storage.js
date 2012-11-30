/**
 * Storage backend providing temporary and persistent spaces for both the app and the user.
 * Note that it proceeds by loading/saving entirely the objects.
 * This is a helper for reasonably sized objects, not an indexedDB for heavy manipulation
 * (stressing again: everything is loaded into RAM on boot / login, and saved on shutdown / flush).
 * Once booted, you can manipulate them as regular objects.
 *
 * @file
 * @summary Storage helper.
 *
 * @author {PUKE-RIGHTS-AUTHOR}
 * @version {PUKE-PACKAGE-VERSION}
 *
 * @license {PUKE-RIGHTS-LICENSE}.
 * @copyright {PUKE-RIGHTS-COPYRIGHT}
 * @name {PUKE-GIT-ROOT}/jsboot/utils/storage.js{PUKE-GIT-REVISION}
 */


// - encrypt private datastore?
// http://bitwiseshiftleft.github.com/sjcl/doc/symbols/sjcl.html
// http://www.matasano.com/articles/javascript-cryptography/


// - compress persistent store?
// - http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip
// - http://rosettacode.org/wiki/LZW_compression
// - http://rumkin.com/tools/compression/compress_huff.php
// - https://github.com/olle/lz77-kit/blob/master/src/main/js/lz77.js

// - use something else?
// http://brian.io/lawnchair/adapters/

// http://dev-test.nemikor.com/web-storage/support-test/

// Idb (XXX to be implemented)

/*jshint browser:true, devel:true*/
var IDB = {
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
  IDBTransaction: window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
  IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
};

jsBoot.add(IDB).as('IDB');

// Optional backends
jsBoot.add(window.openDatabase, true).as('openDatabase');
jsBoot.add(window.localStorage, true).as('localStorage');
// XXX IE8 doesn't support this - "class doesn't support automation" error deep inside gister
// XXX SessionStorage is useful for time limited caching - it's not shared accross tabs
jsBoot.add(window.sessionStorage, true).as('sessionStorage');
jsBoot.add(window.JSON).as('json');

jsBoot.use('jsBoot.core.Error');
jsBoot.pack('jsBoot.utils', function(api) {
  'use strict';
  // XXX see IE8 error from above
  // api.sessionStorage = ('sessionStorage' in window) ? window.sessionStorage : null;

  var userKey;

  this.storage = new (function() {
    /**#@+
     * @memberOf Roxee.gist.dataStore
     */

    /**
     * An accessor to the persistent dataStore.
     * @property
     * @type String
     * @name persistent
     */
    this.persistent = {};

    /**
     * An accessor to the volatile (caching) dataStore.
     * @property
     * @type String
     * @name cache
     */
    this.cache = {};

    /**
     * An accessor to the caching private dataStore.
     * @property
     * @type String
     * @name userCache
     */

    this.userCache = {};

    /**
     * An accessor to the persistent private dataStore.
     * @property
     * @type String
     * @name userPersistent
     */

    this.userPersistent = {};

    // Actual API functions
    this.boot = function(appKey, oncomplete) {
      // Boot storage
      persistentAdapter.init(appKey);
      cacheAdapter.init(appKey);

      var boot = 0;

      var cbk = function(sub, d) {
        Object.keys(d).forEach(function(key) {
          sub[key] = d[key];
        });
        boot++;
        if ((boot > 1) && oncomplete)
          oncomplete();
      };

      persistentAdapter.read(null, cbk.bind(this, this.persistent));
      cacheAdapter.read(null, cbk.bind(this, this.cache));
    };

    this.login = function(uKey, oncomplete) {
      userKey = uKey;

      var boot = 0;

      var cbk = function(sub, d) {
        Object.keys(d).forEach(function(key) {
          sub[key] = d[key];
        });
        boot++;
        if ((boot > 1) && oncomplete)
          oncomplete();
      };

      persistentAdapter.read(userKey, cbk.bind({}, this.userPersistent));
      cacheAdapter.read(userKey, cbk.bind({}, this.userCache));
    };

    this.logout = function(oncomplete) {
      // Write user data
      if (userKey) {

        var boot = 0;

        var cbk = function(sub) {
          Object.keys(sub).forEach(function(key) {
            delete sub[key];
          });
          boot++;
          if ((boot > 1) && oncomplete)
            oncomplete();
        };

        persistentAdapter.write(userKey, this.userPersistent, cbk.bind({}, this.userPersistent));
        cacheAdapter.write(userKey, this.userCache, cbk.bind({}, this.userCache));
        userKey = undefined;
      }else
        setTimeout(oncomplete, 1);
    };

    this.flush = function() {
      if (userKey) {
        persistentAdapter.write(userKey, this.userPersistent);
        cacheAdapter.write(userKey, this.userCache);
      }
      persistentAdapter.write(null, this.persistent);
      cacheAdapter.write(null, this.cache);
    };

    this.shutdown = function(oncomplete) {
      this.logout(function() {
        var boot = 0;

        var cbk = function(sub) {
          Object.keys(sub).forEach(function(key) {
            delete sub[key];
          });
          boot++;
          if ((boot > 1) && oncomplete)
            oncomplete();
        };
        persistentAdapter.write(null, this.persistent, cbk.bind({}, this.persistent));
        cacheAdapter.write(null, this.cache, cbk.bind({}, this.cache));
      }.bind(this));
    };

  })();

  // XXX beware - this is buggy in webkit, and there is no way to be sure write are really commited
  var domAdapter = function(json, store) {
    var prefix;
    return {
      init: function(key) {
        console.info(' [ponyStorage] Using domStorage adapter', store);
        prefix = key;
      },
      read: function(key, callback) {
        key = prefix + '_' + (key || '');
        var ret, err;
        try {
          ret = json.parse(store.getItem(key) || '{}');
          if (!ret)
            throw 'whatever';
        }catch (e) {
          store.removeItem(key);
          ret = {};
          err = new api.Error('DATA_CORRUPTION',
              'Reading into the dataStore failed. This may be indicative of a possible data corruption.');
        }
        setTimeout(callback, 1, ret);
        if (err)
          throw err;
      },

      write: function(key, data, callback) {
        console.warn('jey writte!');
        key = prefix + '_' + (key || '');
        try {
          store.setItem(key, json.stringify(data));
          setTimeout(callback, 1, true);
        }catch (e) {
          store.removeItem(key);
          setTimeout(callback, 1, false);
          throw new api.Error('DATA_CORRUPTION',
              'Writing into the dataStore failed. This may be indicative of a possible data corruption.');
        }

      }
    };
  };


  var sqlAdapter = function(json, dbEngine) {
    var db;
    return {
      init: function(key) {
        console.info(' [ponyStorage] Using openDatabase adapter');
        var shortName = key;
        var version = '1.0.0';
        var displayName = key;
        var maxSize = 65536 * 65536 * 65536;
        db = dbEngine(shortName, version, displayName, maxSize);
        // Ensure the table exists
        this.exec(
            'create table if not exists main (id text(32,0) collate nocase unique primary key, ' +
            'data blob not null on conflict fail);',
            []
        );
      },

      read: function(key, callback) {
        key = key || '';
        this.exec(
            'select * from main where id=?;',
            ['ns_' + key],
            function(r) {
              callback((r.length && json.parse(r.item(0).data)) || {});
            }, function() {
              callback({});
            }
        );
      },

      write: function(key, data, callback) {
        key = key || '';
        data = json.stringify(data);
        this.exec(
            'insert or replace into main (id, data) VALUES ( ?, ? );',
            ['ns_' + key, data],
            callback
        );
      },

      /*
      dump: function(){
        this.exec('select * from main;', null, function(r){
          for(var x = 0; x < r.length; x++)
            console.warn(r.item(x));
        });
      },
  */

      exec: function(query, params, onsuccess, onerror) {
        db.transaction(
            function(transaction) {
              transaction.executeSql(query, params || [], function(transaction, results) {
                if (onsuccess)
                  onsuccess(results.rows);
              }, function(tr, err) {
                console.error(' [ponyStorage] transaction failure', tr, err, query, params);
                if (onerror)
                  onerror(err);
                throw new api.Error('DATA_CORRUPTION', 'Failed executing query');
              });
            }
        );
      }
    };
  };

  var bogusAdapter = function() {
    return {
      init: function() {
        console.warn(' [ponyStorage] Using bogus adapter!');
      },
      read: function() {return {};},
      write: function() {}
    };
  };

  /*
  var idbAdapter = function(n) {
    var indexedDB = n.indexedDB;
    var IDBTransaction = n.IDBTransaction;
    var IDBKeyRange = n.IDBKeyRange;

    var db;
    return {
      init: function(key) {
        var request = indexedDB.open(key, 1);
        request.onerror = function(e) {
          console.error(' [ponyStorage] idb request failure', e);
        };
        request.onsuccess = function() {
          db = request.result;
        };
      }
    };
  };
  */

  var persistentAdapter;
  var cacheAdapter;
  /*if(api.IDB.indexedDB){
    persistentAdapter = idbAdapter(api.IDB);
  }else*/ if (api.openDatabase)
    persistentAdapter = sqlAdapter(api.json, api.openDatabase);
  else if (api.localStorage)
    persistentAdapter = domAdapter(api.json, api.localStorage);
  else
    persistentAdapter = bogusAdapter();

  if (api.sessionStorage)
    cacheAdapter = domAdapter(api.json, api.sessionStorage);
  else if (api.localStorage)
    cacheAdapter = domAdapter(api.json, api.localStorage);
  else
    persistentAdapter = bogusAdapter();

});
// (type == CACHE) ? api.sessionStorage : api.localStorage;



// Roxee.gister.use('Roxee.gist.types.utils').as('utils');
// Roxee.gister.use('Roxee.gist.types.EventDispatcher').as('dispatcher');
// Roxee.gister.use('Roxee.gist.types.Mutable').as('mutable');
// Roxee.gister.use('Roxee.gist.types.Lock').as('lockType');


// (function(_root_, err, lifecycle, loc, ses, delay, lifetime) {
// XXX: todo
// - have a scheduler write to the datastore regularly to minimize impact of crash?
// XXX have an activity observer, possibly in the lifecycle, with an USER_IDLE event



// this.gist = new (function() {
//   // Try check if the storage is working - if not, scream





/**
     * A method to forcefully save to the datastore
     * @function
     * @name save
     */
/*
    // One application booting, boot ourselves
    lifecycle.addEventListener(lifecycle.BOOT, function() {
      // if(!sanity())
      //   return;
      // Try to get an exclusive access to the storage (not for the runner, though)
      if(!noLocking)
        ownLock();
      // Boot persistent storage
      this.persistent = readPersistent(applicationKey);
      //      say(this.INITIALIZED);
    }, this);

    lifecycle.addEventListener(lifecycle.USER_READY, function(e) {
      // if(!sanity())
      //   return;
      uid = e.details.id;
      this.persistentPrivate = readPersistent(applicationKey + '_' + e.details.id);
    }, this);

    lifecycle.addEventListener(lifecycle.USER_OUT, function(e) {
      // if(!sanity())
      //   return;
      writePersistent(applicationKey + '_' + e.details.id, this.persistentPrivate);
      uid = null;
    }, this);

    // Write shit on shutdown
    lifecycle.addEventListener(lifecycle.SHUTDOWN, function() {
      // if(!sanity())
      //   return;
      this.save();
      if(!noLocking)
        freeLock();
    }, this);


  });
*/

// });


// })(Roxee.core, !!Roxee.runner, Roxee.gist.errors, Roxee.controller.lifecycle, window.localStorage,
// window.sessionStorage, 500, 2000);




//    var cbks = [];

/*    this.NOT_INITIALIZED = 0;
    this.INITIALIZED = 1;
    this.FLUSHED = 2;

    this.status = this.NOT_INITIALIZED;*/
/*

    this.listen = function(ctx, meth) {
      cbks.push({ctx: ctx, meth: meth});
    };

    var say = function(value) {
      this.status = value;
      for (var i = 0; i < cbks.length; i++)
        try {
          cbks[i].meth.apply(cbks[i].ctx);
        }catch (e) {
          // XXX complain in case of error
        }
    };
    */


/*    this.setTemp = function(key, value) {
      try {
        ses.setItem(key, JSON.stringify(value));
      }catch (e) {
        err.newError(err.dataStore.DATA_CORRUPTION, 'Impossible to write data to volatile dataStore.
        Possibly memory limit reached.');
      }
    };

    this.getTemp = function(key) {
      try {
        var t = JSON.parse(ses.getItem(key));
        return t;
      }catch (e) {
        err.newError(err.dataStore.DATA_CORRUPTION, 'Impossible to read the requested data from volatile dataStore
        (' + key + '). Possible data corruption. Removing entry.');
        ses.removeItem(key);
      }
    };*/

/*
    var readTemporary = function(key){
      this.temporary = {};
      for(var x = 0, key; x < ses.length, key = ses.key(x); x++){
        try{
          this.temporary[key] = JSON.parse(ses.getItem(key));
        }catch(e){
          // XXX broadcast error
        }
      }
    };

    var writeTemporary = function(){
      ses.clear();
      for(var i in this.temporary){
        try{
          ses.setItem(i, JSON.stringify(this.temporary[i]));
        }catch(e){
          // XXX broadcast error
        }
      }
    };
    */

// this.store = function(key, object, store){
//   // Get or set something in the temporary store
//   // If storing, mark the object as persistent, and will also store in the local store
// };

// this.retrieve = function(key, store){
//   // Get from the store
// };

// // Flushes all persistent data. NOT to be used with a light heart.
// var destroy = function(){
//   loc.clear();
// };

// // Flushes the session storage
// var flush = function(){
//   ses.clear();
// };


