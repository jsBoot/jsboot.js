'use strict';(function(){if(!Math.acosh)Math.acosh=function(a){return Math.log(a+Math.sqrt(a*a-1))};if(!Math.asinh)Math.asinh=function(a){return Math.log(a+Math.sqrt(a*a+1))};if(!Math.atanh)Math.atanh=function(a){return 0.5*Math.log((1+a)/(1-a))};if(!Math.cosh)Math.cosh=function(a){a<0&&(a=-a);return a>21?Math.exp(a)/2:(Math.exp(a)+Math.exp(-a))/2};if(!Math.sinh)Math.sinh=function(a){return(Math.exp(a)-Math.exp(-a))/2};if(!Math.tanh)Math.tanh=function(a){return(Math.exp(a)-Math.exp(-a))/(Math.exp(a)+
Math.exp(-a))};if(!Math.expm1)Math.expm1=function(a){for(var c=0,b=1;b<50;b++){for(var f=Math.pow(a,b),e=1,d=2;d<=b;d++)e*=d;c+=f/e}return c};if(!Math.hypot)Math.hypot=function(a,c){return Math.sqrt(a*a+c*c)||0};if(!Math.log2)Math.log2=function(a){return Math.log(a)*(1/Math.LN2)};if(!Math.log10)Math.log10=function(a){return Math.log(a)*(1/Math.LN10)};if(!Math.log1p)Math.log1p=function(a){var c=0;if(a<=-1)return-Infinity;if(a<0||a>1)return Math.log(1+a);for(var b=1;b<50;b++)b%2===0?c-=Math.pow(a,b)/
b:c+=Math.pow(a,b)/b;return c};if(!Math.sign)Math.sign=function(a){a=+a;return a===0?a:Object.is(a,NaN)?a:a<0?-1:1};if(!Math.trunc)Math.trunc=function(a){return~~a}})();