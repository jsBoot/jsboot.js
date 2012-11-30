jsBoot.pack('jsBoot.utils', function() {
  /*jshint browser:true*/
  'use strict';

  this.Tween = function(obj, descriptor, steps, duration, easer, oncomplete) {
    var delay = duration * 1000 / steps;
    var current = 0;
    var tout;

    var keys = Object.keys(descriptor);
    keys.forEach(function(key) {
      descriptor[key].range = descriptor[key].end - descriptor[key].start;
      descriptor[key].unit = descriptor[key].unit || '';
    });

    var eacher = function(key) {
      obj[key] = (descriptor[key].start + easer(descriptor[key].range, current, steps)) +
          descriptor[key].unit;
    };

    var stepper = function() {
      current++;
      if (current >= steps) {
        clearInterval(tout);
        oncomplete();
      }
      keys.forEach(eacher);
    };

    tout = setInterval(stepper, delay);
    // tout = setTimeout(stepper, delay);
  };

  this.Tween.EASE_IN = function(range, current, steps) {
    return Math.sqrt(current / steps) * range;
  };

  this.Tween.EASE_OUT = function(range, current, steps) {
    return Math.pow(current / steps, 2) * range;
  };

  this.Tween.LINEAR = function(range, current, steps) {
    return (current / steps) * range;
  };
});
