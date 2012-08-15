// This is a nutshell meant to be aggregated AFTER loader-lab.js and spitfire.js

(function(){

  var coreHost = '{PUKE-LIB-LINK}/{PUKE-PACKAGE-NAME}/{PUKE-PACKAGE-VERSION}';
  if(!('jsBootConfig' in window)){
    window.jsBootConfig = {
      extraShims: false,
      useMin: false
    };
  }

  var suffix = (jsBootConfig.useMin ? '-min.js' : '.js');

  if(jsBootConfig.extraShims)
    Spitfire.extraShims();

  var shims = Spitfire.boot(!jsBootConfig.useMin);

  for(var x = 0; x < shims.length; x++)
    jsBoot.core.loader.script('{PUKE-SPITFIRE-LINK}/' + shims[x]);

  // Gonna wait for the shims
  jsBoot.core.loader.wait();

  // jsBoot.core.loader.script('http://localhost:8080/target/target-script-min.js');


  // jsBoot.core.loader.script('https://getfirebug.com/firebug-lite.js');//#startOpened=false,overrideConsole=true,enablePersistent=true');
  // jsBoot.core.loader.wait(function(){
  //   alert("am waiting too!!!!");
  // });

  // Here, AMD could be really useful
  // XXX MUST wait for the shims one way or the other...

  var mods = {};

  jsBoot.core.loader.module = function(name){
    if(mods[name].blocking)
      this.wait();
    this.script(mods[name].uri);
  };

  // This should be aggregated with the main lib - this is dull and blocks loading for nothing
  mods.mingus = {uri: coreHost + '/mingus' + suffix, blocking: false};
  // though... all this is crappy
  mods.core = {uri: coreHost + '/ember-roxee' + suffix, blocking: true};


  // XXX firebuglite support
  // XXX should honor a debug setting of some sort in order to toggle up magically if there is no support
  // in the browser.
  jsBoot.core.debug = new (function(){
    this.preload = function(){
      // document.getElementsByTagName('html')[0].setAttribute('debug','true');
      jsBoot.core.loader.script('https://getfirebug.com/firebug-lite.js#startOpened=true,startInNewWindow=false,overrideConsole=true,enablePersistent=true');
    };

    this.open = function(){
      var max = 0;
      jsBoot.core.loader.script('https://getfirebug.com/firebug-lite.js#startOpened=true,startInNewWindow=false,overrideConsole=true,enablePersistent=true');
      var opener = function(){
        max++;
        console.warn("-> Firebug lite attempt at booting...");
        try{
          Firebug.chrome.open();
        }catch(e){
          console.error(e);
          if(max < 10)
            window.setTimeout(opener, 100);
          else
            console.error("Cant open... I give up");
        }
      };

      jsBoot.core.loader.wait(opener);
    };

    this.close = function(){
      Firebug.chrome.close();
    };
  });

  // jsBoot.core.debug.preload();

  // XXX fails in IE???
  // delete window.jsBootConfig;
})();
