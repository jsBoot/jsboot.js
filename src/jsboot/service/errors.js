jsBoot.use('jsBoot.core.Error');

jsBoot.pack('jsBoot.service', function(api) {
  'use strict';
  this.Error = function(name, message, details) {
    api.Error.apply(this, arguments);
    this.details = details;
  };

  this.Error.prototype = Object.create(api.Error.prototype);

  ['OPENING_FAILED', 'SEND_FAILED', 'FAILED_UID', 'MEANINGLESS_DATA', 'BAD_REQUEST',
   'MISSING', 'BAD_REQUEST', 'UNAUTHORIZED', 'INVALID_SIGNATURE', 'WRONG_CREDENTIALS',
   'SHOULD_NOT_HAPPEN', 'SERVICE_UNAVAILABLE', 'UNAUTHORIZED', 'UNSPECIFIED'].
      forEach(function(item) {
        this[item] = this.prototype[item] = item;
      }, this.Error);

});
