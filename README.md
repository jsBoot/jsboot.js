jsboot.js
=========

Core js library of jsboot.

The onegateisopening folder consists of basic wrapping, including Spitfire (shim enforcer), and the *basic* elements to build a working
pipe between a html nutshell, the service its hosted on, and a parent frame equipped to handle postMessages communication.
It should have zero dependency, and is supposed to run on ANY browser known to man (well... yeah, sure.).

The mingus folder consists of variously involved, *generic* "extensions" to javascript, that are not of jsboot (typically, uri grammar,
digest-auth enabled xmlhttprequest, etc).
Mingus should have only one dependency: an ES5-ready browser - by hook or by shims.

The jsboot folder is the framework itself, including various high-level generic classes (package manager, etc).
JsBoot depends on a fully patched browser, and on Mingus.

