/*global tiojs:false,require:false,jasmine*/
tiojs.wait(function() {
  /*jshint browser:true*/
  'use strict';
  var noShims = !!location.href.match(/use-unpatched/);

  if (typeof require != 'undefined')
    require(['jsBoot/loader'], function(jbc) {
      jbc.boot();
      jbc.wait();
      jbc.use('All.js');
    });
  else {
    if (!noShims)
      jsBoot.loader.use(jsBoot.loader.SHIMS);
    jsBoot.loader.wait();
    jsBoot.loader.use(jsBoot.loader.MINGUS);
    jsBoot.loader.use(jsBoot.loader.TOOLING_STACK);
    jsBoot.loader.wait();
    // jsBoot.loader.use('specs/http.js');
    jsBoot.loader.use('specs/xhr.js');
    jsBoot.loader.wait(function() {
      var jasmineEnv = jasmine.getEnv();
      jasmineEnv.updateInterval = 1000;
      var trivialReporter = new jasmine.TrivialReporter();
      jasmineEnv.addReporter(trivialReporter);
      jasmineEnv.specFilter = function(spec) {
        return trivialReporter.specFilter(spec);
      };
      jasmineEnv.execute();
    });

  }
});
