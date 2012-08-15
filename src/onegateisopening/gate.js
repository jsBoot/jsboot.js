/**
 * @copyright {PUKE-PACKAGE-COPYRIGHT}
 * @name {PUKE-PACKAGE-NAME}
 * @homepage {PUKE-PACKAGE-HOME}
 * @version {PUKE-PACKAGE-VERSION}
 * @location {PUKE-PACKAGE-GIT-ROOT}/lib/onegateisopening/gate.js
 * @fileOverview Private class providing the "gate" to embed inside the iframe, and does the actual XHR communication
 * to the services in the frame mode.
 * @author {PUKE-PACKAGE-AUTHOR}
 */

/**#@+
 * @ignore
 */

(function(){
  /**
   * Shiming boot section
   */
  var shims = Spitfire.boot(!location.url.match(/#useMin/));

  for (var x = 0; x < shims.length; x++)
    jsBoot.core.loader.script('{PUKE-SPITFIRE-LINK}/' + shims[x]);


  /**
   * Actual gate implementation
   */
  jsBoot.core.loader.wait(function() {
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
        } catch (e) {
          bb = new MozBlobBuilder();
        }
      }

      bb.append(ab);
      return bb.getBlob(mimeString);
    };

    // A very simple xhr wrapper to handle the actual requests
    var _roxee_xhr = function(orsc, id, method, url, headers, data)
        {
      var _xhr = new XMLHttpRequest();
      _xhr.id = id;
      _xhr.onreadystatechange = orsc;
      // Open can fail in a number of circunstances
      try {
        _xhr.open(method, url, true);
        for (var i in headers)
          _xhr.setRequestHeader(i, headers[i]);
        // Chrome sets Origin, but Firefox does not - and neither allow it to be overriden
        // _xhr.setRequestHeader('Origin', document.location.protocol + '//' + document.location.host);
        _xhr.setRequestHeader('X-Gate-Origin', parent_url.match(/^(http[s]?:\/\/[^\/]+)/).pop());
        // Do we have a file by any chance?
        if (data && (typeof data == 'string') && (data.substr(0, 5) == 'data:'))
          data = dataURItoBlob(data);
        _xhr.send(data);
      }catch (e) {
        console.warn('Something very bad happened deep-down inside!', e);
        bouncer.apply(_xhr);
      }
    };

    // The "caller" url
    var parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''));

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
      simplePostMessage.postMessage(r, parent_url, parent);
    };

    // The message listener
    var receiver = function(e) {
      var d = e.data;
      if (('id' in d) && ('method' in d) && ('url' in d)) {
        new _roxee_xhr(bouncer, d.id, d.method, d.url, d.headers, d.data);
      }else {
        console.log('INVALID QUERY', d);
      }
    };

    // Anyone can use this gate - the server will just enforce origin restriction based on app key host declarations
    simplePostMessage.receiveMessage(receiver, function() {return true;});

    // Say we are ready
    simplePostMessage.postMessage(READY, parent_url, parent);

  });

})();

/**#@-*/
