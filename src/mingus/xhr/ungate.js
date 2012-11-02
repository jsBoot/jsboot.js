/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file This is the "to be embeded" part that communicates postMessages to the frame. Mimicks a standard XHR.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/mingus/xhr/ungate.js{PUKE-PACKAGE-GIT-REV}
 */

/**#nocode+*/

// This is a wrapper for the frame CORS hack that expose a "kind-of" XHR object
// In a better world, that would be hidden behind the standard XHR.
// To do that, we need to wrap so that we can decide on open, and we would need to be
// blocking return function calls that are able to throw down in the frame (like open)

(function() {
  /*jshint browser:true*/
  /*global simplePostMessage, console, File, Mingus*/
  'use strict';
  Mingus.xhr.gateOpener = new (function() {

    // XXX bien joué Tony!
    // This must be adjusted depending on the host...
    var bridgePath = null; // '/1.0/connect/gate/0.6/gate.html';

    var hosts = {};
    this.getBridge = function(host, path) {
      if (!(host in hosts))
        hosts[host] = new Bridger(host, path ? path : bridgePath);
      return new hosts[host]();
    };


    var Bridger = function(frameHost, framePath) {
      frameHost = location.protocol + '//' + frameHost;
      var id = 0;
      var isReady = false;
      var debt = [];
      var ongoing = [];
      var framy;

      // Hook-on
      var msgHook = function(e) {
        /*jshint regexp:false*/
        // Got a ready from the frame
        if (e.data == 'ready') {
          console.debug('                    |G| <- gate is ready');
          // Frame is ready - anby debt there?
          isReady = true;
          for (var x = 0; x < debt.length; x++) {
            debt[x].__postTrigger();
          }
          debt =  [];
          return;
        }

        // Now, this is a real request return
        var myX = ongoing[e.data.id];
        // console.log("Got something from", e.data.id);
        // console.log(myX);
        var ar, y, ti;
        for (var j in e.data) {
          if (j == 'responseHeaders') {
            // XXX need to parse that crap for real
            ar = e.data[j].split('\r\n');
            if (ar.length < 2)
              ar = e.data[j].split('\n');
            for (y = 0; y < ar.length; y++) {
              if (ar[y]) {
                ti = ar[y].match(/^([^:]+)[:]\s*(.+)/);
                ti.shift();
                myX.responseHeaders[ti.shift().toLowerCase()] = ti.shift();
              }
            }
          }else if (j != 'id') {
            myX[j] = e.data[j];
          }
        }
        console.debug('                    |G| <- request ', e.data.id, ' returned', myX);
        myX.onreadystatechange();
      };

      simplePostMessage.receiveMessage(msgHook, function(source) {
        return source == frameHost;
      });


      framy = document.createElement('iframe');
      framy.setAttribute('id', '_roxee_frame_hack');
      framy.setAttribute('style', 'width: 0; height: 0; position: absolute; top: -1000px; left: -1000px;');
      framy.setAttribute('src', frameHost + framePath + '#' + document.location.href);

      // Register onload to embed the frame
      (function() {
        try {
          console.debug('                    |G| -> straight construction');
          document.body.appendChild(framy);
        }catch (e) {
          var x = window.onload;
          window.onload = function() {
            console.debug('                    |G| -> onload construction');
            if (x)
              x();
            document.body.appendChild(framy);
          };
        }
      })();

      // Custom "XHR"
      var xhr = function() {
        this.UNSENT = 0;
        this.OPENED = 1;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.DONE = 4;


        var head = {}, method, url;
        var i = ++id;

        this.open = function(m, u) {
          console.debug('                    |G| -> opening', m, u);
          method = m;
          url = u;
        };

        this.send = function(da) {
          // Need to read to an uri...
          if (!('File' in window) || !('Blob' in window)) {
            realSend.apply(this, [da]);
          }else if ((da instanceof File) || (da instanceof Blob)) {
            var _self = this;
            var t = new FileReader();
            t.readAsDataURL(da);
            t.onload = function(e) {
              // console.log("Asynchornous shit");
              realSend.apply(_self, [e.target.result]);
            };
          }else {
            realSend.apply(this, [da]);
          }
        };

        var realSend = function(da) {
          var s = {
            'id': i,
            'method': method,
            'url': url,
            'headers': head,
            'data': da
          };
          // console.log("Will send through the gate", this, s);
          if (isReady) {
            console.debug('                    |G| -> sending now', s);
            ongoing[i] = this;
            simplePostMessage.postMessage(s, frameHost + framePath, framy.contentWindow);
          }else {
            console.debug('                    |G| -> defering send');
            this.__postTrigger = function() {
              console.debug('                    |G| -> sending after defer', s);
              ongoing[i] = this;
              simplePostMessage.postMessage(s, frameHost + framePath, framy.contentWindow);
            };
            debt.push(this);
          }
          // console.log("Sent through the fate");
        };

        this.setRequestHeader = function(name, value) {
          console.debug('                    |G| -> set header', name, value);
          head[name] = value;
        };

        // These will be altered by the crappy thingie from downstairs
        this.status = undefined;

        this.responseText = undefined;

        this.readyState = undefined;

        this.responseHeaders = {};

        this.getResponseHeader = function(name) {
          console.debug('                    |G| -> get header', name);
          name = name.toLowerCase();
          if (name in this.responseHeaders)
            return this.responseHeaders[name];
          return false;
        };

        this.onreadystatechange = function() {

        };

        this.abort = function() {
          console.debug('                    |G| -> abort');
          // XXX ahem fix that crap
          this.onreadystatechange = function() {};
        };
      };

      return xhr;
    };

  })();

})();


/**#nocode-*/
