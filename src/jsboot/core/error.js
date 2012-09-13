'use strict';

(function(scope) {
  scope.Error = function(name, message) {
    if ((this == window) || (this == undefined)) {
      console.warn('Google, please fix you shit. Error is a constructor damnit!', arguments);
      return;
    }
    this.Error.apply(this, [message]);
    this.name = name;
    if (!('stack' in this))
      this.stack = ('printStackTrace' in this) ? this.printStackTrace() : [];
  };

  for (var i in this.Error.prototype)
    scope.Error.prototype[i] = this.Error.prototype[i];


  scope.Error.prototype.toString = function() {
    return this.name + ': ' + this.message + '\nStack: ' +
        ((typeof this.stack == 'array') ? this.stack.join('\n') : this.stack);
  };

}).apply(this, [jsBoot.core]);
