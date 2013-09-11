/*
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/ABNF.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/crypto/md5.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/converters/entity.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/appkey.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/crypto/md5.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/IMF.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/IRI.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @name https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/grammar/HTTP.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/ungate.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/digest.js#74-70c39446998be95596b03bc170b23bba337ce8b4
 <a href="http://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>.
 @copyright All rights reserved <a href="http://www.webitup.fr">copyright WebItUp</a>
 @location https://github.com/jsBoot/jsboot.js/blob/master/src/mingus/xhr/digest.js#74-70c39446998be95596b03bc170b23bba337ce8b4
*/
'use strict';(function(){var a=this.simplePostMessage={};"undefined"!=typeof window.opera&&9==parseInt(window.opera.version(),10)&&Event.prototype.__defineGetter__("origin",function(){return"http://"+this.domain});if("postMessage"in window){var b,k=function(a){"addEventListener"in window?window.removeEventListener("message",a,!1):window.detachEvent("onmessage",a)},h=function(a){"addEventListener"in window?window.addEventListener("message",a,!1):window.attachEvent("onmessage",a)};a.postMessage=function(a,
b,g){g.postMessage(a,b.replace(/^([^:]+:\/\/[^\/]+).*/,"$1"))};a.receiveMessage=function(a,r){b&&k(b);b=function(b){if("string"===typeof r&&b.origin!==r||"function"===typeof r&&!1===r(b.origin))return!1;a(b)};h(b)}}else{var m=/^#?\d+&/,l,p,q=1;a.postMessage=function(a,b,g){a="string"===typeof a?encodeURIComponent(a):encodeURIComponent(JSON.stringify(a));g.location=b.replace(/#.*$/,"")+"#"+ +new Date+q++ +"&"+a};a.receiveMessage=function(a){l&&(clearInterval(l),l=null);l=setInterval(function(){var b=
document.location.hash;b!==p&&m.test(b)&&(p=b,a({data:JSON.parse(b.replace(m,""))}))},100)}}}).apply(this);(function(){this.Mingus={grammar:{},crypto:{},xhr:{}}}).apply(window);
(function(){Mingus.grammar.ABNF=new function(){this.makeClass=function(a){return a&&!a.match(/\[/)?"["+a+"]":a};var a=function(a,k){if(!a)return a;var h=a.match(/\[/g);return h?!(1<h.length)&&a.match(/^\[[^\]]+\]$/)||k?a:"(?:"+a+")":"["+a+"]"};this.alternate=function(){return"(?:"+Array.prototype.slice.call(arguments).map(this.makeClass).join("|")+")"};this.repeat=function(b,k,h){b=a(b);return b+(h?k==h?1==k?"":"{"+k+"}":k?"{"+k+","+h+"}":1==h?"?":"{,"+h+"}":k?1==k?"+":"{"+k+",}":"*")};this.optional=
function(b){b=a(b);return b+"?"};this.ALPHA="\\x41-\\x5A\\x61-\\x7A";this.BIT="01";this.CHAR="\\x01-\\x7f";this.CR="\\x0D";this.LF="\\x0A";this.CTL="\\x00-\\x1F\\x7F";this.DIGIT="\\x30-\\x39";this.DQUOTE="\\x22";this.HEXDIG=this.DIGIT+"ABCDEFabcdef";this.HTAB="\\x09";this.SP="\\x20";this.WSP=this.SP+this.HTAB;this.OCTET="\\x00-\\xff";this.VCHAR="\\x21-\\x7E";this.CRLF=this.makeClass(this.CR)+this.makeClass(this.LF);this.LWSP=this.repeat(this.alternate(this.WSP,this.CRLF+this.makeClass(this.WSP)))}})();
(function(){(function(a){var b="\\\\"+a.makeClass("\\x00\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f"+a.LF+a.CR),k="\\\\"+a.makeClass(a.VCHAR+a.WSP),h=a.alternate(k,b),b=a.repeat(a.WSP,1)+a.repeat(a.CRLF+a.repeat(a.WSP,1)),b=a.alternate(a.optional(a.repeat(a.WSP)+a.CRLF)+a.repeat(a.WSP,1),b),k=a.alternate("\\x21-\\x27\\x2a-\\x5b\\x5d-\\x7e\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f",h),m="\\("+a.repeat(a.optional(b)+k)+a.optional(b)+"\\)",k=a.alternate("\\x21-\\x27\\x2a-\\x5b\\x5d-\\x7e\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f",
h,m),k=a.alternate(a.repeat(a.optional(b)+m,1)+a.optional(b),b),m=a.alternate("\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f\\x21\\x23-\\x5b\\x5d-\\x7e",h),m=a.optional(k)+a.makeClass(a.DQUOTE)+a.repeat(a.optional(b)+m)+a.optional(b)+a.makeClass(a.DQUOTE)+a.optional(k),l=a.ALPHA+a.DIGIT+"\\/=?^_`{|}~!#$%&'*+-",p=a.optional(k)+a.repeat(l,1)+a.optional(k),l=a.repeat(l,1)+a.repeat("[.]"+a.repeat(l,1)),l=a.optional(k)+l+a.optional(k),q=a.alternate(p,m),n=a.alternate("\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f",h),
h=p+a.repeat("[.]"+p),p=q+a.repeat("[.]"+q),q=a.alternate("\\x21-\\x5a\\x5e-\\x7e",n),b=a.optional(k)+"\\["+a.repeat(a.optional(b)+q)+a.optional(b)+"\\]"+a.optional(k);this.DOMAIN=a.alternate(l,b,h);this.LOCAL_PART=a.alternate(l,m,p);var r=RegExp("^("+this.LOCAL_PART+")@("+this.DOMAIN+")$");this.IMF={isValidAddress:function(a){if(320<a.length)return!1;var b;return a&&(b=a.match(r))&&64>=b[1].length&&255>=b[2].length}}}).apply(Mingus.grammar,[Mingus.grammar.ABNF])})();
(function(){(function(a){var b=a.alternate(a.DIGIT,"[1-9]"+a.makeClass(a.DIGIT),"1"+a.repeat(a.DIGIT,2),"2[0-4]"+a.makeClass(a.DIGIT),"25[0-5]"),k=b+"\\."+b+"\\."+b+"\\."+b,b=a.repeat(a.HEXDIG,1,4),h=a.alternate(b+"[:]"+b,k),b=a.alternate(a.repeat(b+"[:]",6,6)+h,"[:][:]"+a.repeat(b+"[:]",5,5)+h,a.optional(b)+"[:][:]"+a.repeat(b+"[:]",4,4)+h,a.optional(a.repeat(b+"[:]",0,1)+b)+"[:][:]"+a.repeat(b+"[:]",3,3)+h,a.optional(a.repeat(b+"[:]",0,2)+b)+"[:][:]"+a.repeat(b+"[:]",2,2)+h,a.optional(a.repeat(b+
"[:]",0,3)+b)+"[:][:]"+b+"[:]"+h,a.optional(a.repeat(b+"[:]",0,4)+b)+"[:][:]"+h,a.optional(a.repeat(b+"[:]",0,5)+b)+"[:][:]"+b,a.optional(a.repeat(b+"[:]",0,6)+b)+"[:][:]"),h=a.ALPHA+a.DIGIT+"\\-._~",h="v"+a.repeat(a.HEXDIG,1)+"[.]"+a.repeat(h+"!$&'()*+,;=:",1),m="\\["+a.alternate(b,h)+"\\]",b="%"+a.makeClass(a.HEXDIG)+a.makeClass(a.HEXDIG),h=a.ALPHA+a.DIGIT+"\\-._~\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF",l=a.repeat(a.alternate(h+"!$&'()*+,;=:",b)),p=a.repeat(a.alternate(h+"!$&'()*+,;=",b)),
k=a.alternate(m,k,p),m=a.repeat(a.makeClass(a.DIGIT)),q=a.optional("("+l+")@")+"("+k+")"+a.optional("[:]("+m+")"),n=a.makeClass(a.ALPHA)+a.repeat(a.ALPHA+a.DIGIT+"+.\\-"),m=a.alternate(h+"!$&'()*+,;=:@",b),r=a.repeat(a.alternate(m,"\\uE000-\\uF8FF\\/?")),k=a.repeat(a.alternate(m,"\\/?")),l=a.repeat(m),m=a.repeat(m,1),b=a.repeat(a.alternate(h+"!$&'()*+,;=@",b),1),g=a.repeat("\\/"+l),c="\\/"+a.optional(m+g),b=b+g,d=m+g,h=a.alternate("\\/\\/"+q+"("+g+")","("+c+")","("+d+")",""),f=a.alternate("\\/\\/"+
q+"("+g+")","("+c+")","("+b+")","")+a.optional("[?]("+r+")")+a.optional("#("+k+")"),e="("+n+")[:]"+h+"(?:[?]("+r+"))?(?:#("+k+"))?",t=RegExp("^"+a.alternate(e,f)+"$");this.IRI=new function(){this.ABSOLUTE_IRI=n+"[:]"+a.alternate("\\/\\/"+q+g,c,d,"")+"(?:[?]"+r+")?";this.ABSOLUTE_PATH=c;this.IRI_REFERENCE=a.alternate(e,f);this.parse=function(a){a=a.match(t);var e;a.shift();if(a){e={scheme:a.shift(),user:a.shift(),host:a.shift(),port:a.shift()};var b=a.shift(),c=a.shift(),d=a.shift();e.path=b?b:c?c:
d;e.query=a.shift();e.fragment=a.shift();e.scheme||(e.user=a.shift(),e.host=a.shift(),e.port=a.shift(),b=a.shift(),c=a.shift(),d=a.shift(),e.path=b?b:c?c:d,e.query=a.shift(),e.fragment=a.shift())}return e}}}).apply(Mingus.grammar,[Mingus.grammar.ABNF])})();
(function(){var a=function(a){for(var k="",h=0;h<a.length;h++)k=/[a-z]/i.test(a.charAt(h))?k+("["+a.charAt(h).toLowerCase()+a.charAt(h).toUpperCase()+"]"):k+a.charAt(h);return k};(function(b,k){var h="\\x00"+b.CHAR,m=b.optional(b.CRLF)+b.repeat(b.alternate(b.SP,b.HTAB),1),l=b.makeClass("\\x20-\\x7E\\x80-\\xFF")+b.repeat(b.optional(m)+b.repeat("\\x20-\\x7E\\x80-\\xFF",1)),p='[()<>@,;:\\\\"/\\[\\]?={}'+b.SP+b.HTAB+"]",q=b.repeat("\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2E\\x30-\\x39\\x41-\\x5A\\x5E-\\x7A\\x7C\\x7E",
1),n="\\\\"+b.makeClass(h),r=b.makeClass("\\x20\\x21\\x23-\\x7E\\x80-\\xFF")+b.repeat(b.optional(m)+b.repeat("\\x20\\x21\\x23-\\x7E\\x80-\\xFF",1)),h='"'+b.repeat(b.alternate(r,n))+'"',l=b.alternate(l,b.repeat(b.alternate(q,p,h))),l=b.repeat(b.alternate(m,l)),g=RegExp("("+q+"):("+l+")"+b.makeClass(b.CRLF),"g"),c=RegExp("("+b.repeat(m,1)+")","g");this.HTTP=new function(){this.parseHeaders=function(a){for(var b,e,k,h=[];g.lastIndex<a.length&&(b=g.exec(a));)k=b.pop(),k=k.replace(c," ").trim(),e=b.pop().toLowerCase(),
h.push({key:e,value:k});g.lastIndex=0;return h};this.digest=new function(){this.ALGORITHM={MD5:"md5",MD5_SESS:"md5-sess",UNKNOWN:q};this.QOP={AUTH:"auth",AUTH_INT:"auth-int",UNKNOWN:q};var c=[a(this.ALGORITHM.MD5),a(this.ALGORITHM.MD5_SESS),this.ALGORITHM.UNKNOWN],f=[a(this.QOP.AUTH),a(this.QOP.AUTH_INT),this.QOP.UNKNOWN],e='"('+b.repeat(b.alternate(r,n))+')"',g="("+q+")="+b.alternate("("+q+")",e),f=b.alternate.apply(b,f),f="("+a("qop")+')="('+(b.repeat(m)+f+b.repeat(b.repeat(m)+","+b.repeat(m)+f))+
')"',c=b.alternate.apply(b,c),c="("+a("algorithm")+")=(?:("+c+')|"('+c+')")',h="("+a("stale")+")="+b.alternate("("+a("true")+"|"+a("false")+")",'"('+a("true")+"|"+a("false")+')"'),l="("+a("opaque")+")="+e,p="("+a("nonce")+")="+e,s=b.alternate(k.ABSOLUTE_IRI,k.ABSOLUTE_PATH),s="("+a("domain")+')="'+s+b.repeat(b.repeat(b.SP,1),s)+'"',e="("+a("realm")+")="+e+'"',u=b.optional(m)+b.alternate(l,p,h,s,e,c,f,g)+b.optional(m);this.parse=function(a){var e={stale:!1,qop:"",algorithm:"",domain:null},c=/^Digest/g,
d=c.exec(a);if(d){var f=c.lastIndex,c=RegExp(u+"(?:,)?","g");c.lastIndex=f;for(var g;c.lastIndex<a.length&&(d=c.exec(a));){do g=d.pop();while(!g);do f=d.pop();while(!f);e[f.toLowerCase()]=g}c.lastIndex=0}e.stale="true"==e.stale.toLowerCase()?!0:!1;e.qop=e.qop.toLowerCase();e.algorithm=e.algorithm.toLowerCase();e.domain=e.domain?e.domain.split(RegExp(b.repeat(b.SP,1))):[];return e}}}}).apply(Mingus.grammar,[Mingus.grammar.ABNF,Mingus.grammar.IRI])})();
(function(){var a=function(a,g){var c=a[0],d=a[1],f=a[2],e=a[3],c=k(c,d,f,e,g[0],7,-680876936),e=k(e,c,d,f,g[1],12,-389564586),f=k(f,e,c,d,g[2],17,606105819),d=k(d,f,e,c,g[3],22,-1044525330),c=k(c,d,f,e,g[4],7,-176418897),e=k(e,c,d,f,g[5],12,1200080426),f=k(f,e,c,d,g[6],17,-1473231341),d=k(d,f,e,c,g[7],22,-45705983),c=k(c,d,f,e,g[8],7,1770035416),e=k(e,c,d,f,g[9],12,-1958414417),f=k(f,e,c,d,g[10],17,-42063),d=k(d,f,e,c,g[11],22,-1990404162),c=k(c,d,f,e,g[12],7,1804603682),e=k(e,c,d,f,g[13],12,-40341101),
f=k(f,e,c,d,g[14],17,-1502002290),d=k(d,f,e,c,g[15],22,1236535329),c=h(c,d,f,e,g[1],5,-165796510),e=h(e,c,d,f,g[6],9,-1069501632),f=h(f,e,c,d,g[11],14,643717713),d=h(d,f,e,c,g[0],20,-373897302),c=h(c,d,f,e,g[5],5,-701558691),e=h(e,c,d,f,g[10],9,38016083),f=h(f,e,c,d,g[15],14,-660478335),d=h(d,f,e,c,g[4],20,-405537848),c=h(c,d,f,e,g[9],5,568446438),e=h(e,c,d,f,g[14],9,-1019803690),f=h(f,e,c,d,g[3],14,-187363961),d=h(d,f,e,c,g[8],20,1163531501),c=h(c,d,f,e,g[13],5,-1444681467),e=h(e,c,d,f,g[2],9,-51403784),
f=h(f,e,c,d,g[7],14,1735328473),d=h(d,f,e,c,g[12],20,-1926607734),c=b(d^f^e,c,d,g[5],4,-378558),e=b(c^d^f,e,c,g[8],11,-2022574463),f=b(e^c^d,f,e,g[11],16,1839030562),d=b(f^e^c,d,f,g[14],23,-35309556),c=b(d^f^e,c,d,g[1],4,-1530992060),e=b(c^d^f,e,c,g[4],11,1272893353),f=b(e^c^d,f,e,g[7],16,-155497632),d=b(f^e^c,d,f,g[10],23,-1094730640),c=b(d^f^e,c,d,g[13],4,681279174),e=b(c^d^f,e,c,g[0],11,-358537222),f=b(e^c^d,f,e,g[3],16,-722521979),d=b(f^e^c,d,f,g[6],23,76029189),c=b(d^f^e,c,d,g[9],4,-640364487),
e=b(c^d^f,e,c,g[12],11,-421815835),f=b(e^c^d,f,e,g[15],16,530742520),d=b(f^e^c,d,f,g[2],23,-995338651),c=m(c,d,f,e,g[0],6,-198630844),e=m(e,c,d,f,g[7],10,1126891415),f=m(f,e,c,d,g[14],15,-1416354905),d=m(d,f,e,c,g[5],21,-57434055),c=m(c,d,f,e,g[12],6,1700485571),e=m(e,c,d,f,g[3],10,-1894986606),f=m(f,e,c,d,g[10],15,-1051523),d=m(d,f,e,c,g[1],21,-2054922799),c=m(c,d,f,e,g[8],6,1873313359),e=m(e,c,d,f,g[15],10,-30611744),f=m(f,e,c,d,g[6],15,-1560198380),d=m(d,f,e,c,g[13],21,1309151649),c=m(c,d,f,e,
g[4],6,-145523070),e=m(e,c,d,f,g[11],10,-1120210379),f=m(f,e,c,d,g[2],15,718787259),d=m(d,f,e,c,g[9],21,-343485551);a[0]=n(c,a[0]);a[1]=n(d,a[1]);a[2]=n(f,a[2]);a[3]=n(e,a[3])},b=function(a,b,c,d,f,e){b=n(n(b,a),n(d,e));return n(b<<f|b>>>32-f,c)},k=function(a,g,c,d,f,e,k){return b(g&c|~g&d,a,g,f,e,k)},h=function(a,g,c,d,f,e,k){return b(g&d|c&~d,a,g,f,e,k)},m=function(a,g,c,d,f,e,k){return b(c^(g|~d),a,g,f,e,k)},l=function(b){/[^\x00-\x79]/.test(b)&&(b=unescape(encodeURI(b)));var g=b.length,c=[1732584193,
-271733879,-1732584194,271733878],d;for(d=64;d<=b.length;d+=64){for(var f=c,e=b.substring(d-64,d),k=[],h=void 0,h=0;64>h;h+=4)k[h>>2]=e.charCodeAt(h)+(e.charCodeAt(h+1)<<8)+(e.charCodeAt(h+2)<<16)+(e.charCodeAt(h+3)<<24);a(f,k)}b=b.substring(d-64);f=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(d=0;d<b.length;d++)f[d>>2]|=b.charCodeAt(d)<<(d%4<<3);f[d>>2]|=128<<(d%4<<3);if(55<d)for(a(c,f),d=0;16>d;d++)f[d]=0;f[14]=8*g;a(c,f);return c},p="0123456789abcdef".split(""),q=function(a){for(var b=0;b<a.length;b++){for(var c=
a,d=b,f=a[b],e="",h=0;4>h;h++)e+=p[f>>8*h+4&15]+p[f>>8*h&15];c[d]=e}return a.join("")},n=function(a,b){return a+b&4294967295};"5d41402abc4b2a76b9719d911017c592"!=q(l("hello"))&&(n=function(a,b){var c=(a&65535)+(b&65535);return(a>>16)+(b>>16)+(c>>16)<<16|c&65535});Mingus.crypto.md5={crypt:function(a){return q(l(a))}}})();
(function(){var a={nbsp:160,iexcl:161,cent:162,pound:163,curren:164,yen:165,brvbar:166,sect:167,uml:168,copy:169,ordf:170,laquo:171,not:172,shy:173,reg:174,macr:175,deg:176,plusmn:177,sup2:178,sup3:179,acute:180,micro:181,para:182,middot:183,cedil:184,sup1:185,ordm:186,raquo:187,frac14:188,frac12:189,frac34:190,iquest:191,Agrave:192,Aacute:193,Acirc:194,Atilde:195,Auml:196,Aring:197,AElig:198,Ccedil:199,Egrave:200,Eacute:201,Ecirc:202,Euml:203,Igrave:204,Iacute:205,Icirc:206,Iuml:207,ETH:208,Ntilde:209,
Ograve:210,Oacute:211,Ocirc:212,Otilde:213,Ouml:214,times:215,Oslash:216,Ugrave:217,Uacute:218,Ucirc:219,Uuml:220,Yacute:221,THORN:222,szlig:223,agrave:224,aacute:225,acirc:226,atilde:227,auml:228,aring:229,aelig:230,ccedil:231,egrave:232,eacute:233,ecirc:234,euml:235,igrave:236,iacute:237,icirc:238,iuml:239,eth:240,ntilde:241,ograve:242,oacute:243,ocirc:244,otilde:245,ouml:246,divide:247,oslash:248,ugrave:249,uacute:250,ucirc:251,uuml:252,yacute:253,thorn:254,yuml:255,fnof:402,Alpha:913,Beta:914,
Gamma:915,Delta:916,Epsilon:917,Zeta:918,Eta:919,Theta:920,Iota:921,Kappa:922,Lambda:923,Mu:924,Nu:925,Xi:926,Omicron:927,Pi:928,Rho:929,Sigma:931,Tau:932,Upsilon:933,Phi:934,Chi:935,Psi:936,Omega:937,alpha:945,beta:946,gamma:947,delta:948,epsilon:949,zeta:950,eta:951,theta:952,iota:953,kappa:954,lambda:955,mu:956,nu:957,xi:958,omicron:959,pi:960,rho:961,sigmaf:962,sigma:963,tau:964,upsilon:965,phi:966,chi:967,psi:968,omega:969,thetasym:977,upsih:978,piv:982,bull:8226,hellip:8230,prime:8242,Prime:8243,
oline:8254,frasl:8260,weierp:8472,image:8465,real:8476,trade:8482,alefsym:8501,larr:8592,uarr:8593,rarr:8594,darr:8595,harr:8596,crarr:8629,lArr:8656,uArr:8657,rArr:8658,dArr:8659,hArr:8660,forall:8704,part:8706,exist:8707,empty:8709,nabla:8711,isin:8712,notin:8713,ni:8715,prod:8719,sum:8721,minus:8722,lowast:8727,radic:8730,prop:8733,infin:8734,ang:8736,and:8743,or:8744,cap:8745,cup:8746,"int":8747,there4:8756,sim:8764,cong:8773,asymp:8776,ne:8800,equiv:8801,le:8804,ge:8805,sub:8834,sup:8835,nsub:8836,
sube:8838,supe:8839,oplus:8853,otimes:8855,perp:8869,sdot:8901,lceil:8968,rceil:8969,lfloor:8970,rfloor:8971,lang:9001,rang:9002,loz:9674,spades:9824,clubs:9827,hearts:9829,diams:9830,quot:34,amp:38,lt:60,gt:62,OElig:338,oelig:339,Scaron:352,scaron:353,Yuml:376,circ:710,tilde:732,ensp:8194,emsp:8195,thinsp:8201,zwnj:8204,zwj:8205,lrm:8206,rlm:8207,ndash:8211,mdash:8212,lsquo:8216,rsquo:8217,sbquo:8218,ldquo:8220,rdquo:8221,bdquo:8222,dagger:8224,Dagger:8225,permil:8240,lsaquo:8249,rsaquo:8250,euro:8364,
apos:39,AMP:38,COPY:169,GT:62,LT:60,QUOT:34,REG:174},b=!1,k=function(h,k,l,p){h=b?"":"&"+k+l+p+";";l&&parseInt(p,16)?h=String.fromCharCode(parseInt(p,16)):k&&parseInt(p,10)?h=String.fromCharCode(p):p in a&&(h=String.fromCharCode(a[p]));return h};Mingus.converters=Mingus.converters||{};Mingus.converters.entity={decodeEntities:function(a,m){b=m;return a.replace(/&(?:(#)(x?))?([0-9a-z]+);/gi,k)},safeXML:function(a,b){a=a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
b||(a=a.replace(/'/g,"&apos;"));return a}}})();
(function(){Mingus.xhr.gateOpener=new function(){var a={};this.getBridge=function(k,h){k in a||(a[k]=new b(k,h?h:null));return new a[k]};var b=function(a,b){a=location.protocol+"//"+a;var m=0,l=!1,p=[],q=[],n;window.addEventListener("message",function(b){if(b.origin!=a)return!1;if("ready"==b.data){console.debug("                    |G| <- gate is ready");l=!0;for(b=0;b<p.length;b++)p[b].__postTrigger();p=[]}else{var g=q[b.data.id],c,d,f,e;for(e in b.data)if("responseHeaders"==e)for(c=b.data[e].split("\r\n"),
2>c.length&&(c=b.data[e].split("\n")),d=0;d<c.length;d++)c[d]&&(f=c[d].match(/^([^:]+)[:]\s*(.+)/),f.shift(),g.responseHeaders[f.shift().toLowerCase()]=f.shift());else"id"!=e&&(g[e]=b.data[e]);console.debug("                    |G| <- request ",b.data.id," returned",g);g.onreadystatechange()}},!1);n=document.createElement("iframe");n.setAttribute("id","_roxee_frame_hack");n.setAttribute("style","width: 0; height: 0; position: absolute; top: -1000px; left: -1000px;");n.setAttribute("src",a+b+"#"+document.location.href);
(function(){try{console.debug("                    |G| -> straight construction"),document.body.appendChild(n)}catch(a){var b=window.onload;window.onload=function(){console.debug("                    |G| -> onload construction");b&&b();document.body.appendChild(n)}}})();return function(){this.UNSENT=0;this.OPENED=1;this.HEADERS_RECEIVED=2;this.LOADING=3;this.DONE=4;var b={},g,c,d=++m;this.open=function(a,b){console.debug("                    |G| -> opening",a,b);g=a;c=b};this.send=function(a){if("File"in
window&&"Blob"in window)if(a instanceof File||a instanceof Blob){var b=this,c=new FileReader;c.readAsDataURL(a);c.onload=function(a){f.apply(b,[a.target.result])}}else f.apply(this,[a]);else f.apply(this,[a])};var f=function(e){var f={id:d,method:g,url:c,headers:b,data:e};l?(console.debug("                    |G| -> sending now",f),q[d]=this,n.contentWindow.postMessage(f,a)):(console.debug("                    |G| -> defering send"),this.__postTrigger=function(){console.debug("                    |G| -> sending after defer",
f);q[d]=this;n.contentWindow.postMessage(f,a)},p.push(this))};this.setRequestHeader=function(a,c){console.debug("                    |G| -> set header",a,c);b[a]=c};this.readyState=this.responseText=this.status=void 0;this.responseHeaders={};this.getResponseHeader=function(a){console.debug("                    |G| -> get header",a);a=a.toLowerCase();return a in this.responseHeaders?this.responseHeaders[a]:!1};this.onreadystatechange=function(){};this.abort=function(){console.debug("                    |G| -> abort");
this.onreadystatechange=function(){}}}}}})();
(function(){Mingus.xhr.appKeyErrors={UNREGISTERED_HOST:1,UNPARSABLE_DATE:2};Mingus.xhr.appKeyEngine=new function(a,b){this.data={};this.getSignature=function(k,h,m){if(!(k in this.data))throw Error(a.UNREGISTERED_HOST);var l=this.data[k].keyId,p=this.data[k].secretKey;k=Math.round((new Date).getTime()/1E3)-this.data[k].delta;p=b.crypt([l,p,k].join(":"));h=b.crypt([m,h,p].join(":"));return'access Timestamp="'+k+'", Signature="'+h+'", KeyId="'+l+'", Algorithm="md5"'};this.setAppKey=function(a,b,m){a in
this.data||(this.data[a]={delta:0});this.data[a].keyId=b;this.data[a].secretKey=m};this.setTime=function(b,h){var m=Date.parse(h)/1E3;if(isNaN(m))throw Error(a.UNPARSABLE_DATE);b in this.data||(this.data[b]={});this.data[b].delta=Math.round((new Date).getTime()/1E3)-m}}(Mingus.xhr.appKeyErrors,Mingus.crypto.md5)})();
(function(a,b){var k=function(a){var b=a.length;for(a=""+(parseInt(a,10)+1);a.length<b;)a="0"+a;return a},h=function(b,h,k,m,r,g,c){g=a.crypt(g.toUpperCase()+":"+c);return a.crypt(b+":"+h+":"+k+":"+m+":"+r+":"+g)},m=function(){var l,m,q,n={},r,g;Object.defineProperty(this,"login",{get:function(){return l},set:function(a){l=a;q=null},enumerable:!0});Object.defineProperty(this,"realm",{get:function(){return n.realm},set:function(a){n.realm=a},enumerable:!0});Object.defineProperty(this,"password",{set:function(a){m=
a;q=null},enumerable:!1});Object.defineProperty(this,"ha1",{get:function(){return q},set:function(a){q=a},enumerable:!1});Object.defineProperty(this,"challenge",{get:function(){return n},set:function(c){var d=n&&"realm"in n?n.realm:null;c=b.digest.parse(c);for(var f in c)c.hasOwnProperty(f)&&(n[f]=c[f]);r=a.crypt(""+Math.floor(1E6*Math.random()));g="00000000";n.realm!=d&&(q=null)},enumerable:!1});this.getAuthenticationHeader=function(b,d){q||(q=a.crypt(l+":"+n.realm+":"+m),m=null);g=k(g);var f={uri:b,
response:h(q,n.nonce,g,r,n.qop,d,b),username:l,cnonce:r,realm:n.realm,nonce:n.nonce,opaque:n.opaque,algorithm:n.algorithm,qop:n.qop,nc:g};return"Digest "+Object.keys(f).map(function(a){return a+'="'+f[a]+'"'}).join(", ")}};this.digest=new function(){var a=this.data={};this.getEngine=function(b){b=b.replace(/:[0-9]+$/,"");b in a||(a[b]=new m);return a[b]}}}).apply(Mingus.xhr,[Mingus.crypto.md5,Mingus.grammar.HTTP]);
(function(a,b,k,h){var m=this.XMLHttpRequest=function(){console.debug("          |X| constructing");var l,p=this,q={},n,r,g,c,d;"readyState status statusText responseText responseXML upload UNSENT OPENED HEADERS_RECEIVED LOADING DONE".split(" ").forEach(function(a){Object.defineProperty(this,a,{get:function(){return l[a]},enumerable:!0})},this);["timeout","asBlob","followRedirects","withCredentials"].forEach(function(a){Object.defineProperty(this,a,{get:function(){return l[a]},set:function(b){l[a]=
b},enumerable:!0})},this);this.overrideMimeType=function(a){return l.overrideMimeType(a)};this.abort=function(){console.debug("          |X| abort");return l.abort()};this.getResponseHeader=function(a){console.debug("          |X| get response",a);"www-authenticate"==a.toLowerCase()&&(a="X-WWW-Authenticate");return l.getResponseHeader(a)};this.getAllResponseHeaders=function(){return l.getAllResponseHeaders().replace(/X-WWW-Authenticate/i,"WWW-Authenticate")};this.onreadystatechange=function(){};this.setRequestHeader=
function(a,b){console.debug("          |X| set req head",a,b);l.setRequestHeader(a,b);q[a]=b};this.open=function(b,g,p){console.debug("          |X| open",b,g,p);n||(c=a.parse(g),n=b,r=p,d=g);l=h(c.host+(c.port?":"+c.port:""),m.gatePath);f();l.open(n,d,r);b=k.getEngine(c.host);g=c.path+(c.query?"?"+c.query:"");b.login&&"nonce"in b.challenge&&l.setRequestHeader("Authorization",b.getAuthenticationHeader(g,n));l.setRequestHeader("X-Requested-With","XMLHttpRequest")};this.send=function(a){console.debug("          |X| send",
a);g||(g=a);l.setRequestHeader("X-Signature",b.getSignature(c.host,c.path,n));l.send(g)};var f=function(){l.onreadystatechange=function(){console.debug("          |X| state change!",l.readyState);if(l.readyState==l.HEADERS_RECEIVED||l.readyState==l.DONE){401==l.status&&l.getResponseHeader("Date")&&b.setTime(c.host,l.getResponseHeader("Date"));var a=k.getEngine(c.host);l.getResponseHeader("X-WWW-Authenticate")&&(a.challenge=l.getResponseHeader("X-WWW-Authenticate"));if("nonce"in a.challenge&&401==
l.status){l.abort();p.open();for(var d in q)q.hasOwnProperty(d)&&l.setRequestHeader(d,q[d]);l.onreadystatechange=function(){p.onreadystatechange.call(p)};p.send();return}}p.onreadystatechange.call(p)}}};this.XMLHttpRequest.gatePath=void 0}).apply(Mingus.xhr,[Mingus.grammar.IRI,Mingus.xhr.appKeyEngine,Mingus.xhr.digest,Mingus.xhr.gateOpener.getBridge]);
