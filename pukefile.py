#!/usr/bin/env puke
# -*- coding: utf8 -*-

global PH
import pukehelpers as PH


@task("Default task")
def default():
  Cache.clean()
  executeTask("build")
  executeTask("deploy")

# @task("Calling all interesting tasks")
# def all():
#     executeTask("build")
#     executeTask("deploy")
#     executeTask("mint")
#     executeTask("tests")
# #    executeTask("doc")
#     executeTask("lint")
#     executeTask("stats")
#     executeTask("statsdoc")

@task("All")
def all():
  Cache.clean()
  executeTask("lint")
  executeTask("build")
  executeTask("mint")
  executeTask("deploy")
  executeTask("stats")


@task("Deploy package")
def deploy():
  PH.deployer(True)

@task("Lint")
def lint():
  PH.linter("src")

@task("Flint")
def flint():
  PH.flinter("src")

@task("Minting")
def mint():
  PH.minter(Yak.BUILD_ROOT)

@task("Stats report deploy")
def stats():
  # PH.stater(Yak.DOC_ROOT)
  PH.stater(Yak.BUILD_ROOT)


@task("Build package")
def build():
    istrunk = Yak.VARIANT == 'bleed'
    sed = Sed()
    PH.replacer(sed)

    spitman = PH.getmanifest('spitfire', '0.1', istrunk)

    spitbase = spitman['spitfire'].split('/')
    spitbase.pop()
    spitbase = '/'.join(spitbase)
    sed.add('{SPIT-BASE}', spitbase)
    # Our own internal boot path to resolve modules against...
    sed.add('{SPIT-BOOT}', Yak.PUBLIC + "/"+ Yak.PACKAGE['NAME'] + "/" + Yak.PACKAGE['VERSION'])
    # Tricky!
    sed.add("'{SPIT-STATICS}'", str(PH.getstaticmanifest('*')))

    # ================================
    # Tests
    # ================================

    list = FileList("tests", filter="*.js,*.html")
    deepcopy(list, Yak.BUILD_ROOT + '/tests', replace=sed)

    # ================================
    # Spitfire loader, in many variants
    # ================================

    # Mini-loader
    combine([spitman['gulliver'], 'src/onegateisopening/b.js'], Yak.BUILD_ROOT + "/t.i.o.j.js", replace=sed)

    # Bootstrappers - we use lab by default
    spitfireList = [
      spitman['spitfire-lab'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.BUILD_ROOT + "/there.is.only.jsboot.js", replace=sed)

    spitfireList = [
      spitman['spitfire'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.BUILD_ROOT + "/there.is.only.jsboot.vanilla.js", replace=sed)

    spitfireList = [
      spitman['spitfire-require'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.BUILD_ROOT + "/there.is.only.jsboot.require.js", replace=sed)

    spitfireList = [
      spitman['spitfire-head'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.BUILD_ROOT + "/there.is.only.jsboot.head.js", replace=sed)

    # These two don't support strict mode - the hell with them!
    spitfireList = [
      spitman['spitfire-yahoo'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.BUILD_ROOT + "/there.is.only.jsboot.yahoo.js", replace=sed)

    spitfireList = [
      spitman['spitfire-yepnope'],
      'src/onegateisopening/boot.js',
    ]
    combine(spitfireList, Yak.BUILD_ROOT + "/there.is.only.jsboot.yepnope.js", replace=sed)

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
    # combine(f, Yak.BUILD_ROOT + "/stack.ember.js", replace=sed)


    # ================================
    # Css normalizer
    # ================================
    cssnorm = PH.getstaticmanifest('normalize', istrunk)
    combine(cssnorm, Yak.BUILD_ROOT + "/there.is.only.jsboot.css", replace=sed)

    # ================================
    # Build-up the gate framy
    # ================================
    # XXX this must die and be replaced by a proper postmessage shim
    postmessageshim = PH.getstaticmanifest('postmessage', istrunk)

    gateList = [
      spitman['loader-lab'],
      spitman['spitfire'],
      postmessageshim,
      'src/onegateisopening/gate.js'
    ]

    combine(gateList, Yak.BUILD_ROOT + '/toobsj.ylno.si.ereht.js', replace=sed)
    # FileSystem.copyfile(Yak.BUILD_ROOT + '/gates/gate-frame.js', Yak.BUILD_ROOT + '/gates/gate-frame-min.js')

    # Build-up the frame to deploy connect to
    sed.add('{PUKE-GATE-OPENER}', Yak.PUBLIC + "/"+ Yak.PACKAGE['NAME'] + "/" + Yak.PACKAGE['VERSION'] + "/toobsj.ylno.si.ereht.js")
    combine('src/onegateisopening/gate.html', Yak.BUILD_ROOT + '/gate.html', replace=sed)



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

    # Then bases
      "src/mingus/xhr/ungate.js",
      "src/mingus/xhr/appkey.js",
      "src/mingus/xhr/digest.js",
    # Then the final XHR
      "src/mingus/xhr/appkeydigestxhr.js"
    ]

    # Shimmy yeah
    combine(mingusList, Yak.BUILD_ROOT + "/mingus.js", replace=sed)


    # ================================
    # jsBoot modules
    # ================================

    list = FileList('src/jsboot/debug', filter = '*.js', exclude = '*xxx*');
    combine(list, Yak.BUILD_ROOT + "/debug.js", replace=sed)

    list = FileList('src/jsboot/core', filter = '*.js', exclude = '*xxx*');
    combine(list, Yak.BUILD_ROOT + "/core.js", replace=sed)

    list = FileList('src/jsboot/gister', filter = '*.js', exclude = '*xxx*');
    combine(list, Yak.BUILD_ROOT + "/gister.js", replace=sed)

    list = FileList('src/jsboot/service', filter = '*.js', exclude = '*xxx*');
    combine(list, Yak.BUILD_ROOT + "/service.js", replace=sed)



    spitroot = Yak.PACKAGE['NAME'] + "/" + Yak.PACKAGE['VERSION']
    description = []
    description.append("mingus: '%s/mingus.js'" % spitroot)
    description.append("jsbootstrap: '%s/there.is.only.jsboot.js'" % spitroot)
    description.append("gate: '%s/gate.html'" % spitroot)
    description.append("cssbootstrap: '%s/there.is.only.jsboot.css'" % spitroot)

    # Link the yaml stuff
    yamu = FileSystem.join(Yak.DEPLOY_ROOT, "jsboot.yaml")
    description = yaml.load('\n'.join(description))
    if FileSystem.exists(yamu):
      mama = yaml.load(FileSystem.readfile(yamu))
      mama[Yak.PACKAGE['VERSION']] = description
    else:
      mama = {Yak.PACKAGE['VERSION']: description}

    # Straight to service root instead - kind of hackish...
    FileSystem.writefile(yamu, yaml.dump(mama))









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

# Generates documentation for the win
@task("Core Documentation")
def doc():
  list = FileList("src/", filter = "*.js", exclude = "*-min.js")
#    list.merge(FileList("src/lib/com/wiu/roxee", filter = "*.js", exclude = "*-min.js"))
  sed = Sed()
  PH.replacer(sed)

  # Analytics marker
  # sed.add("{PUKE-ANAL}", "UA-27075824-1")

  deepcopy(list, Yak.TMP_ROOT, replace=sed)
  # Make doc
  list = FileList(Yak.TMP_ROOT)

  # jsdoc3(list, Yak.DOC_ROOT, Yak.REMOTE_BUILD + Yak.LINKS['TAUPE'] + "/templates/jsboot")
  result = jsdoc3(list, Yak.DOC_ROOT + '/test.json');


# @task("Copy tests")
# def tests():
#     sed = Sed()
#     # This is half borked... question is: where do these end-up?
#     Yak.LINKS['CORE'] = Yak.LINKS['ROXEE_STATIC'] + '/' + Yak.PACKAGE['NAME'] + "/" + Yak.PACKAGE['VERSION']
#     PH.addlinksreplace(sed)
#     PH.addpackagereplace(sed)
#     list = FileList("tests")
#     deepcopy(list, Yak.DOC_ROOT + "/tests", sed)


# Stylesheet will get prepended stuff
#    f = [ STATIC_ORIGIN + "/org/normalize/normalize-stable.css", "src/org/wiu/gristaupe/taupale.css" ]
#    combine(f, BUILD_ROOT + "/org/wiu/gristaupe/taupale.css", replace=sed)



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
#     combine(list, Yak.BUILD_ROOT + "/noshit-roxee.js", replace=sed)


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
#     combine(listFull, Yak.BUILD_ROOT + "/ember-roxee.js", replace=sed)



    # XXX Don't need to deploy everything
    # And build-up the actual core API
    #    list = FileList("src/lib/com/wiu/mingus", filter="*namespace.js")
    # list = FileList("src/lib/com/wiu", filter="*.js")
    # deepcopy(list, Yak.BUILD_ROOT, replace=sed)


    # Shiming
    # list = FileList('src/lib/com/wiu/mingus/shim', filter="*.js")
    # deepcopy(list, FileSystem.join(Yak.BUILD_ROOT, 'shim'), replace=sed)


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
    # combine(listO, Yak.BUILD_ROOT + "/partner-roxee.js", replace=sed)


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

    # combine(list, Yak.BUILD_ROOT + "/partner-api.js", replace=sed)

    # combine("src/lib/com/wiu/roxee/partner/index.html", Yak.BUILD_ROOT + "/partner-api.html", replace=sed)







    # # Post-message shiming suppose the frame itself uses it as well, independently
    # list = [
    #     "src/lib/com/wiu/mingus/shim/postmessage.js"
    # ]
    # combine(list, Yak.BUILD_ROOT + "/services/shim/postmessage.js", replace=sed)

