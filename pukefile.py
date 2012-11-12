#!/usr/bin/env puke
# -*- coding: utf8 -*-

global PH
import helpers as PH
import re
import json

@task("Default task")
def default():
  # Cache.clean()
  executeTask("build")
  executeTask("tests")
  executeTask("deploy")

@task("All")
def all():
  # Cache.clean()
  executeTask("lint")
  executeTask("hint")
  executeTask("build")
  executeTask("tests")
  executeTask("mint")
  executeTask("deploy")
  executeTask("doc")
  executeTask("stats")


@task("Wash the taupe!")
def clean():
  PH.cleaner()

@task("jsDocking")
def doc():
  list = FileList(Yak.build_root)
  # jsdoc3(list, Yak.doc_root + "/jsdoc3.json")
  d = FileSystem.abspath(Yak.doc_root)
  jsdoc3(list, "%s/gristaupe.json" % d)
  jsdoc3(list, "%s/html" % d, template = "templates/default")


@task("Lint")
def lint():
  PH.linter("src", excluding = "*tests*")

@task("Hint")
def hint():
  PH.hinter("src", excluding = "*tests*")

@task("Flint")
def flint():
  PH.flinter("src")

@task("Deploy package")
def deploy():
  PH.deployer(True)

@task("Minting")
def mint():
  # Yahoo and yep don't support strict
  PH.minter(Yak.build_root, filter = "*yahoo.js,*yepnope.js", strict = False)
  PH.minter(Yak.build_root, excluding = "*yahoo*,*yepnope*")

@task("Stats report deploy")
def stats():
  PH.stater(Yak.build_root)

@task("Tests building")
def tests():
  sed = Sed()
  PH.replacer(sed)
  list = FileList("src/tests", filter="*.js,*.html", exclude="*xxx*")
  deepcopy(list, Yak.build_root + '/tests', replace=sed)


@task("Build package")
def build():
    
    sed = Sed()
    PH.replacer(sed)

    spitman = PH.getmanifest('spitfire')

    spitbase = spitman['spitfire'].split('/')
    spitbase.pop()
    spitbase = '/'.join(spitbase)

    sed.add('{SPIT-BASE}', spitbase.encode('latin-1'))
    # Our own internal boot path to resolve modules against... - XXX unlikely to work properly due to deploy root variations?
    # sed.add('{SPIT-BOOT}', Yak.links['self']['url'] + "/"+ Yak.package['name'] + "/" + Yak.package['version'])
    # Tricky!
    sed.add("'{SPIT-STATICS}'", json.dumps(PH.getstaticmanifest('*')))

    # ================================
    # Tests
    # ================================

    list = FileList("tests", filter="*.js,*.html")
    deepcopy(list, Yak.build_root + '/tests', replace=sed)

    # ================================
    # Spitfire loader, in many variants
    # ================================

    # Mini-loader
    combine([spitman['gulliver'], 'src/onegateisopening/b.js'], Yak.build_root + "/t.i.o.j.js", replace=sed)

    # Bootstrappers - we use lab by default
    spitfireList = [
      spitman['spitfire-lab'],
      'src/onegateisopening/boot.js',
    ]




    # print open('.pukecache/34825187585a6d8cd0794b79d0381a9904633e2d4ef5b23a4cc0b0b608514c07').encoding
    # print open('src/onegateisopening/boot.js').encoding

    # d = FileSystem.readfile('.pukecache/34825187585a6d8cd0794b79d0381a9904633e2d4ef5b23a4cc0b0b608514c07')
    # e = FileSystem.readfile('src/onegateisopening/boot.js')
    # d += e
    # print "coucou"
    # print "------------------------- %s" % d

    combine(spitfireList, Yak.build_root + "/there.is.only.jsboot.js", replace=sed)

    spitfireList = [
      spitman['spitfire'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.build_root + "/there.is.only.jsboot.vanilla.js", replace=sed)

    spitfireList = [
      spitman['spitfire-require'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.build_root + "/there.is.only.jsboot.require.js", replace=sed)

    spitfireList = [
      spitman['spitfire-head'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.build_root + "/there.is.only.jsboot.head.js", replace=sed)

    # These two don't support strict mode - the hell with them!
    spitfireList = [
      spitman['spitfire-yahoo'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.build_root + "/there.is.only.jsboot.yahoo.js", replace=sed)

    spitfireList = [
      spitman['spitfire-yepnope'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.build_root + "/there.is.only.jsboot.yepnope.js", replace=sed)

    # XXX Have unified XHR bundled to be safe (?)
    # spitman['xhr'],


    # ================================
    # Monolithic ember stack test
    # ================================
    # f = [
    #   PH.getstaticmanifest('jquery'),
    #   PH.getstaticmanifest('handlebars'),
    #   PH.getstaticmanifest('ember'),
    #   PH.getstaticmanifest('i18n')
    # ]
    # combine(f, Yak.build_root + "/stack.ember.js", replace=sed)


    # ================================
    # Css normalizer
    # ================================
    cssnorm = PH.getstaticmanifest('normalize', Yak.istrunk)
    combine([cssnorm], Yak.build_root + "/there.is.only.jsboot.css", replace=sed)

    # ================================
    # Build-up the gate framy
    # ================================
    # XXX this must die and be replaced by a proper postmessage shim
    postmessageshim = PH.getstaticmanifest('postmessage', Yak.istrunk)
    postmessageshim = 'src/mingus/postmessage.js';

    gateList = [
      spitman['loader-lab'],
      spitman['spitfire'],
      postmessageshim,
      'src/onegateisopening/gate.js'
    ]

    combine(gateList, Yak.build_root + '/toobsj.ylno.si.ereht.js', replace=sed)
    # FileSystem.copyfile(Yak.build_root + '/gates/gate-frame.js', Yak.build_root + '/gates/gate-frame-min.js')

    shortversion = Yak.package['version'].split('-').pop(0).split('.')
    shortversion = shortversion[0] + "." + shortversion[1]

    # Build-up the frame to deploy connect to
    # XXX whether this works is undefined... because of shortversion and selectable versioned deploy
    sed.add('{PUKE-GATE-OPENER}', Yak.links['self']['url'] + "/"+ Yak.package['name'] + "/" + shortversion + "/toobsj.ylno.si.ereht.js")
    combine('src/onegateisopening/gate.html', Yak.build_root + '/gate.html', replace=sed)



    # ================================
    # Standalone mingus
    # ================================

    mingusList = [
      "src/strict.js",
      # Have postmessage shit
      postmessageshim,
    # Better safe than sorry - always include that
      # "src/lib/com/wiu/mingus/shim-plus/console.js",
      # "src/lib/com/wiu/mingus/shim-plus/cookies.js",
      # "src/lib/com/wiu/mingus/shim-plus/string.js",
      # "src/lib/com/wiu/mingus/shim-plus/iegetset.js",
#      "src/lib/com/wiu/mingus/shim/postmessage.js",
    # Mingus NS
      "src/mingus/namespace.js",
    # Base dep
      "src/mingus/grammar/ABNF.js",
      # "src/lib/com/wiu/mingus/converters/entity.js",
      # "src/lib/com/wiu/mingus/converters/bencoder.js",
      # "src/lib/com/wiu/mingus/converters/wikimedia.js",
    # And parsers / grammars
      "src/mingus/grammar/IMF.js",
      "src/mingus/grammar/IRI.js",
      "src/mingus/grammar/HTTP.js",

    # Then md5 dep
      "src/mingus/crypto/md5.js",


    # Not necessary per-se, but darn useful
      "src/mingus/converters/entity.js",

    # Then bases
      "src/mingus/xhr/ungate.js",
      "src/mingus/xhr/appkey.js",
      "src/mingus/xhr/digest.js",
    # Then the final XHR
      "src/mingus/xhr/appkeydigestxhr.js"
    ]

    # Shimmy yeah
    combine(mingusList, Yak.build_root + "/mingus.js", replace=sed)


    # ================================
    # jsBoot modules
    # ================================

    list = FileList('src/jsboot/debug', filter = '*.js', exclude = '*xxx*');
    combine(list, Yak.build_root + "/debug.js", replace=sed)

    list = FileList('src/jsboot/gister', filter = '*.js', exclude = '*xxx*')
    list.merge(FileList('src/jsboot/core', filter = '*.js', exclude = '*xxx*'));
    # list.merge(FileList('src/jsboot/gister', filter = '*.js', exclude = '*xxx*'));
    list.merge(['src/jsboot/types/eventdispatcher.js'])
    combine(list, Yak.build_root + "/core.js", replace=sed)

    list = [
      'src/jsboot/service/errors.js',
      'src/jsboot/service/client.js',
      'src/jsboot/service/core.js',
      'src/jsboot/service/flaves/account.js'
    ]

    combine(list, Yak.build_root + "/service.js", replace=sed)

    list = FileList('src/jsboot/ui', filter = '*.js', exclude = '*xxx*');
    combine(list, Yak.build_root + "/ui.js", replace=sed)




    spitroot = Yak.package['name'] + "/" + shortversion

    description = {}
    description["mingus"] = "%s/mingus.js" % spitroot
    description["jsbootstrap"] = "%s/there.is.only.jsboot.js" % spitroot
    description["gate"] = "%s/gate.html" % spitroot
    description["cssbootstrap"] = "%s/there.is.only.jsboot.css" % spitroot

    # Link the yaml stuff

    # yamu = FileSystem.join(Yak.deploy_root, "jsboot.yaml")
    # description = yaml.load('\n'.join(description))
    # if FileSystem.exists(yamu):
    #   mama = yaml.load(FileSystem.readfile(yamu))
    #   mama[Yak.package['version']] = description
    # else:
    #   mama = {Yak.package['version']: description}

    # # Straight to service root instead - kind of hackish...
    # FileSystem.writefile(yamu, yaml.dump(mama))



    PH.describe(shortversion, "jsboot", description)








# @task("Minting")
# def mint():
    # list = FileList(Yak.DEPLOY_ROOT + '/gates', filter = "*.js", exclude = "*-min.js")
    # for burne in list.get():
    #     minify(burne, burne.replace(".js", "-min.js"))

    # list = [
    #   { 'file' : Yak.DEPLOY_ROOT + '/there.is.only.jsboot.js', 'strict': True},
    #   { 'file' : Yak.DEPLOY_ROOT + '/mingus.js', 'strict': True},
    #   { 'file' : Yak.DEPLOY_ROOT + '/noshit-roxee.js', 'strict' : True},
    #   { 'file' : Yak.DEPLOY_ROOT + '/ember-roxee.js', 'strict' : True},
    #   { 'file' : Yak.DEPLOY_ROOT + '/toobsj.ylno.si.ereht.js', 'strict' : True}
    #   # XXX broken right now
    #   # { 'file' : Yak.DEPLOY_ROOT + '/partner-api.js', 'strict' : True},
    #   # { 'file' : Yak.DEPLOY_ROOT + '/partner-roxee.js', 'strict' : True},
    # ]

    # for burne in list:
    #     minify(burne['file'], re.sub(r"(.*).js$", r"\1-min.js", burne['file']), strict=burne['strict'] if 'strict' in burne else False)



# @task("Copy tests")
# def tests():
#     sed = Sed()
#     # This is half borked... question is: where do these end-up?
#     Yak.LINKS['CORE'] = Yak.LINKS['ROXEE_STATIC'] + '/' + Yak.package['name'] + "/" + Yak.package['version']
#     PH.addlinksreplace(sed)
#     PH.addpackagereplace(sed)
#     list = FileList("tests")
#     deepcopy(list, Yak.DOC_ROOT + "/tests", sed)


# Stylesheet will get prepended stuff
#    f = [ STATIC_ORIGIN + "/org/normalize/normalize-stable.css", "src/org/wiu/gristaupe/taupale.css" ]
#    combine(f, build_root + "/org/wiu/gristaupe/taupale.css", replace=sed)



    # Copy selected files to the doc-src folder, and replace markers appropriately




    # ================================
    # Lightweight core - likewise to become jsboot
    # ================================



# NOSHIT
#     gistList = [
#       "src/lib/strict.js",
#       # "src/lib/com/wiu/roxee/gist/errors/handler.js",

#     # The actual error center manager
#       "src/lib/com/wiu/roxee/gist/errors/core.js",
#       "src/lib/com/wiu/roxee/gist/errors/errors.js",

#     # Optional stacktrace support - optional, but cool to have for the error manager
#       Yak.REMOTE_BUILD + Yak.LINKS['STATIC'] + '/org/eriwen/stacktrace-stable.js',
#       "src/lib/com/wiu/roxee/gist/errors/stacksupport.js",

#     # Package manager
#       "src/lib/com/wiu/roxee/gist/require.js",

#     # Browser detection semantic
#       "src/lib/com/wiu/roxee/gist/browser/errors.js",
#       "src/lib/com/wiu/roxee/gist/browser/types.js",
#       "src/lib/com/wiu/roxee/gist/browser/core.js",

#     # Basic type helpers
#       "src/lib/com/wiu/roxee/gist/types/utils.js",
#       "src/lib/com/wiu/roxee/gist/types/eventdispatcher.js",

#     # Single app helper
#       "src/lib/com/wiu/roxee/gist/singleapp/browser.js",
#       "src/lib/com/wiu/roxee/gist/singleapp/errors.js",
#       "src/lib/com/wiu/roxee/gist/singleapp/single.js",

#     # Store helper
#       "src/lib/com/wiu/roxee/gist/store/browser.js",
#       "src/lib/com/wiu/roxee/gist/store/errors.js",
#       "src/lib/com/wiu/roxee/gist/store/core.js",

#       "src/lib/com/wiu/roxee/closure.js"
#     ]

#     serviceList = [
#       "src/lib/com/wiu/roxee/core/services/core.js",
#       "src/lib/com/wiu/roxee/core/services/errors.js",
#       "src/lib/com/wiu/roxee/core/services/types.js"
#     ]

#     list = FileList('src/lib/com/wiu/mingus/', exclude="*")
#     list.merge(gistList)
#     list.merge(serviceList)
#     combine(list, Yak.build_root + "/noshit-roxee.js", replace=sed)


#     runnerList = [
#     # Core functionality depend on nothing
#       "src/lib/com/wiu/roxee/runner/core.js",
#       "src/lib/com/wiu/roxee/runner/powermanagement.js",
#       "src/lib/com/wiu/roxee/runner/updater.js",
#       "src/lib/com/wiu/roxee/runner/platipus.js",
#       "src/lib/com/wiu/roxee/runner/player.js",
#       "src/lib/com/wiu/roxee/runner/filesystem.js",
#       "src/lib/com/wiu/roxee/runner/menu.js",
#       "src/lib/com/wiu/roxee/core/torrent/scraper.js",
#     ]


#     gistListExtended = [
#         "src/lib/com/wiu/roxee/gist/tween/tweener.js",
#       # Interesting types that may be used
#         "src/lib/com/wiu/roxee/gist/types/lock.js",
#       # Clean-up and split
#         "src/lib/com/wiu/roxee/gist/types/mutable.js",
#         "src/lib/com/wiu/roxee/gist/types/filterable.js",
#         "src/lib/com/wiu/roxee/gist/types/collection.js",
#     ]



# # FULLMONTY
#     listMonty = [
#         "src/lib/com/wiu/roxee/namespace.js",
#     # Advanced gist types (XXX to be ungisted)
#         "src/lib/com/wiu/roxee/types/collection.js",
#     # Ember overrides
#         "src/lib/com/wiu/ember/types/filtered.js",




#         "src/lib/com/wiu/roxee/users/network.js",

#         # The user controller just depend on the service, and should never be called directly (private api)
#         "src/lib/com/wiu/roxee/controller/user/user.js",

#         # The user object type just depend on the controller, and some basic types
#         "src/lib/com/wiu/roxee/model/users/user.js",





#     # APIs that depend on types
#         "src/lib/com/wiu/roxee/runner/network.js",
#         "src/lib/com/wiu/roxee/runner/connectors/opensubs.js",
#         "src/lib/com/wiu/roxee/runner/filer.js",

#       # Lifecycle
#         "src/lib/com/wiu/roxee/controller/lifecycle/errors.js",
#         "src/lib/com/wiu/roxee/controller/lifecycle/core.js",

#       # Just depend on the model and the lifecycle
#         "src/lib/com/wiu/roxee/model/users/pool.js",





#         "src/lib/com/wiu/roxee/core/torrent/controller.js",

#         # XXX suboptimal stuff
#         "src/lib/com/wiu/roxee/controller/loginmanager/core.js",


#         # XXX dirty stuff
#         "src/lib/com/wiu/roxee/core/prefset/core.js",

#         #### Model and related controllers

#         # Data
#         "src/lib/com/wiu/roxee/model/data/types.js",
#         "src/lib/com/wiu/roxee/model/data/relation.js",
#         "src/lib/com/wiu/roxee/controller/data/core.js",

#         "src/lib/com/wiu/roxee/model/data/people.js",
#         "src/lib/com/wiu/roxee/model/data/media.js",
#         "src/lib/com/wiu/roxee/model/data/proxies.js",

#         # Collections management
#         "src/lib/com/wiu/roxee/model/collection/stats.js",

#         "src/lib/com/wiu/roxee/controller/collection/collectible.js",
#         "src/lib/com/wiu/roxee/model/collection/collectible.js",

#         "src/lib/com/wiu/roxee/controller/collection/collection.js",
#         "src/lib/com/wiu/roxee/controller/collection/local.js",


#     # Notification center
#         "src/lib/com/wiu/roxee/controller/activity/core.js",
#         "src/lib/com/wiu/roxee/controller/notifications/core.js",

#         # Users

#         "src/lib/com/wiu/roxee/controller/user/users.js",



#         # Search thingies
#         "src/lib/com/wiu/roxee/controller/search/autocomplete.js",
#         "src/lib/com/wiu/roxee/controller/search/fullsearch.js",




#         "src/lib/com/wiu/roxee/widgets/ui.js",
#         "src/lib/com/wiu/roxee/widgets/gmap.js",


#       # To be reviewed - this is deep crap (but working)
#         "src/lib/com/wiu/ember/types/toplevel.js",

#       # Late emberifying is not a problem on this
#         "src/lib/com/wiu/ember/core/errors.js",

#       # And finally prep it, rub it, roll it, eat the shit!
#         "src/lib/com/wiu/roxee/closure.js",
#     ]

#     listFull = FileList('src/lib/com/wiu/mingus/', exclude="*")
#     listFull.merge(gistList);
#     listFull.merge(gistListExtended);
#     listFull.merge(serviceList);
#     listFull.merge(runnerList);
#     listFull.merge(listMonty);
#     combine(listFull, Yak.build_root + "/ember-roxee.js", replace=sed)



    # XXX Don't need to deploy everything
    # And build-up the actual core API
    #    list = FileList("src/lib/com/wiu/mingus", filter="*namespace.js")
    # list = FileList("src/lib/com/wiu", filter="*.js")
    # deepcopy(list, Yak.build_root, replace=sed)


    # Shiming
    # list = FileList('src/lib/com/wiu/mingus/shim', filter="*.js")
    # deepcopy(list, FileSystem.join(Yak.build_root, 'shim'), replace=sed)


    # =====================
    # Partner API
    # XXX broken right now
    # =====================


    # list = [
    # # Global namespace
    #     "src/lib/com/wiu/roxee/namespace.js",

    # # Basic types used everywhere
    #     "src/lib/com/wiu/roxee/gist/types/eventdispatcher.js",
    #     "src/lib/com/wiu/roxee/gist/types/lock.js",
    #     "src/lib/com/wiu/roxee/gist/types/mutable.js",
    #     "src/lib/com/wiu/roxee/gist/types/filterable.js",
    #     "src/lib/com/wiu/roxee/types/collection.js",
    #     # "src/lib/com/wiu/ember/types/core.js",


    # # Data
    #     "src/lib/com/wiu/roxee/model/data/types.js",
    #     "src/lib/com/wiu/roxee/model/data/relation.js",
    #     "src/lib/com/wiu/roxee/controller/data/core.js",

    #     "src/lib/com/wiu/roxee/model/data/people.js",
    #     "src/lib/com/wiu/roxee/model/data/media.js",
    #     "src/lib/com/wiu/roxee/model/data/proxies.js",
    # ]

    # listO = FileList('src/lib/com/wiu/mingus/', exclude="*")
    # listO.merge(gistlist);
    # listO.merge(serviceList);
    # listO.merge(list);
    # combine(listO, Yak.build_root + "/partner-roxee.js", replace=sed)


    # isMin = False

    # if isMin:
    #     sed.add('{MIN}', '-min')
    # else:
    #     sed.add('{MIN}', '')


    # list = [
    #   Yak.REMOTE_BUILD + Yak.LINKS['ROXEE_STATIC'] + "/com/labjs/labjs-stable.js",
    #   "src/lib/com/wiu/spitfire/spitfire-lab.js",
    #   "src/lib/com/wiu/roxee/partner/core.js"
    # ]

    # combine(list, Yak.build_root + "/partner-api.js", replace=sed)

    # combine("src/lib/com/wiu/roxee/partner/index.html", Yak.build_root + "/partner-api.html", replace=sed)







    # # Post-message shiming suppose the frame itself uses it as well, independently
    # list = [
    #     "src/lib/com/wiu/mingus/shim/postmessage.js"
    # ]
    # combine(list, Yak.build_root + "/services/shim/postmessage.js", replace=sed)

