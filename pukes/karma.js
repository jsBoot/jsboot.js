// Karma configuration
// Generated on Mon Sep 02 2013 12:27:16 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'dist/burnscars.js',
      'dist/tests/specs/String.js',
      'dist/tests/specs/Object.js'
    ],

    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    browserStack: {
      username: 'olivier@webitup.fr',
      accessKey: '5TV8Z0CWyrGcRaw5BeSd'
    },

    // define browsers
    customLaunchers: {

      bs_firefox_old_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '10.0',
        os: 'OS X',
        os_version: 'Snow Leopard'
      },
      bs_firefox_esr_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '17.0',
        os: 'OS X',
        os_version: 'Snow Leopard'
      },
      bs_firefox_stable_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Snow Leopard'
      },


      /*Safaris*/
      bs_safari_4_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '4.0',
        os: 'OS X',
        os_version: 'Snow Leopard'
      },

      bs_safari_5_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '5.0',
        os: 'OS X',
        os_version: 'Snow Leopard'
      },

      bs_safari_51_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '5.1',
        os: 'OS X',
        os_version: 'Snow Leopard'
      },

      bs_safari_6_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '6.0',
        os: 'OS X',
        os_version: 'Mountain Lion'
      },

      /*IEs*/
      bs_ie_6: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '6.0',
        os: 'Windows',
        os_version: 'XP'
      },
      bs_ie_7: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '7.0',
        os: 'Windows',
        os_version: 'XP'
      },
      bs_ie_8: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '8.0',
        os: 'Windows',
        os_version: '7'
      },
      bs_ie_9: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
      },
      bs_ie_10: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '7'
      }
      /*,
      bs_iphone5: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '6.0'
      }*/
    },

/*    browsers: [
      'ChromeCanary',
      'bs_firefox_stable_mac',
      'bs_firefox_esr_mac',
      'bs_firefox_old_mac'
    ],*/

    // ['bs_firefox_old_mac', 'bs_firefox_esr_mac', 'bs_firefox_stable_mac'],
// , 'bs_iphone5'],


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // browsers: ['BrowserStack'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
