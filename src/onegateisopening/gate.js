/**
 * @version {PUKE-PACKAGE-VERSION}
 * @author {PUKE-PACKAGE-AUTHOR}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @file Private class providing the "gate" to embed inside the iframe, and does the actual XHR communication
 * to the services in the frame mode.
 * @license {PUKE-PACKAGE-LICENSE}.
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @location {PUKE-PACKAGE-GIT-ROOT}/onegateisopening/gate.js
 */

/**#@+
 * @ignore
 */

(function() {
  /*jshint browser:true*/
  /*global Spitfire:true, simplePostMessage:true, console:true, BlobBuilder:true, WebKitBlobBuilder:true,
  MozBlobBuilder:true*/
  'use strict';

  /**
 * Shiming boot section
 */
  var shims = Spitfire.boot(location.href.match(/jsboot-debug/));

  // XXX remove SpitBoot and use runtime path detection
  for (var x = 0; x < shims.length; x++)
    Spitfire.loader.script('{SPIT-BASE}/' + shims[x]);

  /**
 * Actual gate implementation
 */
  Spitfire.loader.wait(function() {
    // Name of the signal sent up for whenever we say we are ready
    var READY = 'ready';

    // A helper to convert the shit back from data/url to native file objects
    var dataURItoBlob = function(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var bb;
      try {
        bb = new BlobBuilder();
      } catch (e) {
        try {
          bb = new WebKitBlobBuilder();
        } catch (e2) {
          bb = new MozBlobBuilder();
        }
      }

      bb.append(ab);
      return bb.getBlob(mimeString);
    };

    // The "caller" url
    var parentUrl = decodeURIComponent(document.location.hash.replace(/^#/, ''));

    // A very simple xhr wrapper to handle the actual requests
    var roxeeXhr = function(orsc, id, method, url, headers, data)
        {
      var _xhr = new XMLHttpRequest();
      _xhr.id = id;
      _xhr.onreadystatechange = orsc;
      // Open can fail in a number of circunstances
      try {
        _xhr.open(method, url, true);
        for (var i in headers) {
          if (headers.hasOwnProperty(i))
            _xhr.setRequestHeader(i, headers[i]);
        }
        // Chrome sets Origin on POST, but not GET, and Firefox does not
        // - and neither allow it to be overriden
        // _xhr.setRequestHeader('Origin', document.location.protocol + '//' + document.location.host);
        _xhr.setRequestHeader('X-Gate-Origin', parentUrl.match(/^(http[s]?:\/\/[^\/]+)/).pop());
        // Do we have a file by any chance?
        if (data && (typeof data == 'string') && (data.substr(0, 5) == 'data:'))
          data = dataURItoBlob(data);
        _xhr.send(data);
      }catch (e) {
        console.warn('Something very bad happened deep-down inside!', e);
        bouncer.apply(_xhr);
      }
    };

    // The callback that handles XHR answers
    var bouncer = function() {
      var r = {
        id: this.id,
        readyState: this.readyState
      };
      try {
        r.status = this.status;
      }catch (e) {
      }
      try {
        r.responseText = this.responseText;
      }catch (e) {
      }
      try {
        r.responseHeaders = this.getAllResponseHeaders();
      }catch (e) {
      }
      simplePostMessage.postMessage(r, parentUrl, parent);
    };

    // The message listener
    var receiver = function(e) {
      var d = e.data;
      if (('id' in d) && ('method' in d) && ('url' in d)) {
        roxeeXhr(bouncer, d.id, d.method, d.url, d.headers, d.data);
      }else {
        console.log('INVALID QUERY', d);
      }
    };

    // Anyone can use this gate - the server will just enforce origin restriction based on app key host declarations
    simplePostMessage.receiveMessage(receiver, function() {return true;});

    // Say we are ready
    simplePostMessage.postMessage(READY, parentUrl, parent);

  });

})();

/**#@-*/
