// A way to extract as much client navigator informations as possible
/*
  var safeStringify = function(data, depth) {
    if (typeof data == 'object') {
      var res = [];
      if (depth)
        for (var i in data) {
          res.push('"' + i + '":' + safeStringify(data[i], depth - 1));
        }
        res = '{' + res.join(',') + '}';
      return res;
    }
    return data.toString();
  };

  var navigatorDump = '';
  try {
    // Dump navigator informations
    if ('navigator' in window) {
      for (var i in navigator) {
        try {
          // Stoopid Safari hangs on this, instead of throwing politely
          // if((i != 'mimeTypes') && (i != 'plugins') && (i != 'geolocation'))
          navigatorDump += i + ': ' + safeStringify(navigator[i], 2) + '\n';
        }catch (e) {
        }
      }
    }
  }catch (e) {
    console.warn('Failed to build a navigator dump...', e);
  }
*/
