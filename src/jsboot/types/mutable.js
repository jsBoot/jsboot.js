jsBoot.use('jsBoot.types.EventDispatcher').as('dispatcher');

// An object that when mutating (eg: via a call to the change method) will dispatch a change event
jsBoot.pack('jsBoot.types', function(api) {
  /*global Ember*/
  'use strict';

  // XXX clarify this shit
  // XXX What's wrong with Ember.Object.prototype?
  this.Mutable = function() {
    if (typeof Ember != 'undefined') {
      var em = new Ember.Object();
      for (var i in em) {
        if (i != 'constructor' && i != 'set')
          this[i] = em[i];
      }
    }
    api.dispatcher.apply(this);
  };

  this.Mutable.prototype = Object.create(api.dispatcher.prototype);

  // XXX The persistence of "change" is only here for Roxee backward compat
  this.Mutable.prototype.set = this.Mutable.prototype.change = function(key, value) {
    var ov = (typeof Ember != 'undefined') ? this.get(key) : this[key];
    if (value == ov)
      return;
    this.dispatchEvent(this.CHANGE, {key: key, oldValue: ov, newValue: value});
    if (typeof Ember != 'undefined') {
      Ember.set(this, key, value);
    }else {
      this[key] = value;
    }
  };


  // Should not be constructed before the store is ready
  /*
  this.StoreMutable = function(storeObject){
    this.Mutable.apply(this);

    Object.keys(storeObject).forEach(function(key){
      // XXX miss typage instanciation
      this[key] = storeObject[key];
    }, this);

    // Should save on user-idle, or on logout / shutdown
    this.addEventListener(this.AFTER_MUTATION, function(){
      // Reset / repopulate store object
      Object.keys(storeObject).forEach(function(key){
        // XXX miss typage serialization
        if(key in this)
          storeObject[key] = this[key];
        else
          delete storeObject[key];
      });
    }, this);
  };

  StoreMutable.prototype = Object.create(Mutable.prototype);
  */

});



/*
  var des = function(valuesHolder){
  };
  return {
    toto: {
      enumerable: true,
      configurable: false,
      writable: true,
      value: 'whatever'
    },
    titi: {
      enumerable: true,
      configurable: false,
      value: 'toto',
      parse: function(value){
        return 'parse: ' + value;
      },
      serialize: function(value){
        return 'serialize: ' + value;
      }
    }
  };

  var TypedMutable = function(descriptor){
    var proxy = Object.create({}, descriptor);
    Object.keys(descriptor).forEach(function(key){
      Object.defineProperty(this, key, {
        enumerable: descriptor[key].enumerable,
        configurable: true,
        get: function(){
          if(descriptor[key].parse){
            return descriptor[key].parse(proxy[key]);
          return proxy[key];
        },
        set: descriptor[key].writable ? function(value){
          if(descriptor[key].serialize){
            proxy[key] = descriptor[key].serialize(value);
            return;
          }
          switch(typeof descriptor[key].value){
            case 'number':
              proxy[key] = parseInt(value, 10);
              break;
            case 'boolean':
              proxy[key] = !!value;
              break;
            case 'string':
              proxy[key] = '' + value;
              break;
            case 'object':
            // XXX code injection risk?
              proxy[key] = value; // Object.create({}, value);
              break;
            case 'function':
              // Custom filtering method
          }
        } : undefined
      });
    }, this);
  };

  var a1 = new TypedMutable(des);
  var a2 = new TypedMutable(des);
  // throw "toto"
*/

/*
jsBoot.use('jsBoot.types.Mutable');
jsBoot.pack('jsBoot.types', function(api) {
  'use strict';

  this.TypedMutable = function(descriptor, initialMesh) {
    api.Mutable.apply(this);

    this.isTyped = true;

    var privatePool = {};
    var lastMesh = {};

    Object.keys(descriptor).forEach(function(i) {
      var item = descriptor[i];
      switch (typeof item) {
        case 'number':
          this[i] = parseInt(item, 10);
          break;
        case 'boolean':
          this[i] = (item == 'true');
          break;
        case 'string':
          this[i] = '' + item;
          break;
        case 'object':
          // May be null, an array, or an object-object
          this[i] = item;
          break;
        case 'function':
          Object.defineProperty(this, i, {
            enumerable: true,
            configurable: true,
            get: function() {
              // XXX super dirty and dangerous - cause of the bind
              // Verify this in IE and other non-bindable browsers
              if (item.isDirty || item.constructor != Function)
                return item(lastMesh[i]);
              else {
                if (typeof privatePool[i] == 'undefined') {
                  privatePool[i] = new item(lastMesh[i] || null);
                }
                return privatePool[i];
              }
            },
            set: function(value) {
              privatePool[i] = value;
              // XXX dirty trix to let polymorph descriptors do whatever job need be be done
              if (item.isDirty)
                privatePool[i] = item(value);
            }
          });
          break;
      }
    }, this);

    this.free = function() {
      privatePool = {};
    };

    this.toObject = function() {
      var ret = {};
      Object.keys(descriptor).forEach(function(i) {
        ret[i] = (!!this[i] && (typeof this[i] == 'object') && ('toObject' in this[i])) ? this[i].toObject() : this[i];
      }, this);
      return ret;
    };

    this.fromObject = function(networkMesh) {
      if (typeof networkMesh != 'object')
        networkMesh = {id: networkMesh};
      Object.keys(networkMesh).forEach(function(i) {
        if (!(i in descriptor))
          return;
        var item = networkMesh[i];
        switch (typeof descriptor[i]) {
          case 'number':
            this.set(i, parseInt(item, 10));
            break;
          case 'boolean':
            this.set(i, (item == 'true'));
            break;
          case 'string':
            this.set(i, '' + item);
            break;
          case 'object':
            // May be null, an array, or an object-object
            this.set(i, item);
            break;
          case 'function':
            if (typeof privatePool[i] != 'undefined') {
              if (descriptor[i].constructor == Function) {
                if (!!privatePool[i]) {
                  privatePool[i].fromObject(networkMesh[i]);
                }else {
                  lastMesh[i] = networkMesh[i];
                }
              }else
                this.set(i, descriptor[i](networkMesh[i]));
            }else
              // Merge and override lastMesh otherwise, to be used for later construction
              lastMesh[i] = networkMesh[i];


            // if(typeof privatePool[i] != 'undefined')
            //   if('fromObject' in privatePool[i])
            //     privatePool[i].fromObject(networkMesh[i]);
            //   else
            //     this.set(i, descriptor[i](networkMesh[i]));
            // else
            //   // Merge and override lastMesh otherwise, to be used for later construction
            //   lastMesh[i] = networkMesh[i];
            break;
          default:
            this.set(i, item);
            throw new Error('UNTYPED_MESH', 'Mesh is not typed properly ' + i + ' ' + descriptor[i] + ' ' + item);
        }
      }, this);
    };

    if (initialMesh)
      this.fromObject(initialMesh);
  };

});

*/
