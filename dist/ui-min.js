'use strict';jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof moment?console.warn(" [jsBoot.ui]: moment is not loaded - date manipulation library not available"):this.date=moment});jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof $().uniform?console.warn(" [jsBoot.ui]: uniform is not loaded - stylable forms support disabled"):this.forms=function(a,b){return $(a).uniform(b)}});
jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof BigScreen?console.warn(" [jsBoot.ui]: Bigscreen is not loaded - portable fullscreen support disabled"):this.fullscreen=BigScreen});jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof History?console.warn(" [jsBoot.ui]: History is not loaded - portable history support disabled"):this.history=History});
jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof $().hoverIntent?console.warn(" [jsBoot.ui]: hoverIntent is not loaded - enhanced hover detection support disabled"):this.hover=function(a,b){return $(a).hoverIntent(b)}});jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof I18n?console.warn(" [jsBoot.ui]: I18n is not loaded - localization support disabled"):this.I18n=function(){return I18n}});
jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof KeyboardJS?console.warn(" [jsBoot.ui]: KeyboardJS is not loaded - keyboard support disabled - will try MouseTrap"):this.keyboard=KeyboardJS;"undefined"==typeof Mousetrap?console.warn(" [jsBoot.ui]: Mousetrap is not loaded - keyboard support disabled"):this.keyboard=Mousetrap});
jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof $.gritter?console.warn(" [jsBoot.ui]: Gritter is not loaded - growl like notifications support disabled"):this.notify=function(){return $.gritter}});jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof $().chosen?console.warn(" [jsBoot.ui]: Chosen is not loaded - enhanced form selects support disabled"):this.select=function(a,b){return $(a).chosen(b)}});
jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof $().dataTable?console.warn(" [jsBoot.ui]: dataTable is not loaded - enhanced tables support disabled"):this.table=function(a,b){return $(a).dataTable(b)}});jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof $().validate?console.warn(" [jsBoot.ui]: Validate is not loaded - form validation support disabled"):this.validate=function(a,b){return $(a).validate(b)}});
jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof Raphael?console.warn(" [jsBoot.ui]: Raphael is not loaded - nicy graphs support disabled"):this.Vector=function(){return Raphael}});jsBoot.pack("jsBoot.ui",function(){"undefined"==typeof $().redactor?console.warn(" [jsBoot.ui]: Redactor is not loaded - wysiwyg support disabled"):this.wysiwyg=function(a,b){return $(a).redactor(b)}});
