#!/usr/bin/env puke
# -*- coding: utf8 -*-

global help
from helpers import Helpers as help
import re
import json

@task("Default task")
def default():
  executeTask("build")
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
  Cache.clean()
  help.cleaner()

@task("jsDocking")
def doc():
  list = FileList(Yak.paths['build'], filter = "*.js")
  # jsdoc3(list, Yak.doc_root + "/jsdoc3.json")
  d = FileSystem.abspath(Yak.paths["doc"])
  jsdoc3(list, "%s/gristaupe.json" % d)
  jsdoc3(list, "%s/html" % d, template = "templates/default")

@task("Lint")
def lint():
  help.linter("src", excluding = "*tests*")

@task("Hint")
def hint():
  help.hinter("src", excluding = "*tests*")

@task("Flint")
def flint():
  help.flinter("src")

@task("Minting")
def mint():
  help.minter(Yak.paths['build'], excluding = "*yepnope*,*yui*", strict = True)
  help.minter(Yak.paths['build'], filter = "*yepnope*,*yui*", strict = False)

@task("Stats report deploy")
def stats():
  help.stater(Yak.paths['build'])

@task("Tests building")
def tests():
  # ============================
  # Build tests
  # ============================
  sed = Sed()
  help.replacer(sed)

  list = FileList(Yak.paths['tests'], filter="*.js,*.html,*.css")
  deepcopy(list, Yak.paths['build'] + '/tests', replace=sed)


@task("Build package")
def build():
  # ============================
  # Very basic build
  # ============================

  sed = Sed()
  help.replacer(sed)
  # deepcopy(FileList("src", exclude = "*tests*"), Yak.paths['build'], replace = sed)


  spitversion = '1.1.0'

  # Mini tiojs
  combine(['dependencies/spitfire/%s/gulliver.js' % spitversion, 'src/onegateisopening/b.js'], Yak.paths['build'] + "/t.i.o.j.js", replace=sed)

  # There is only
  spitfireList = [
    'dependencies/spitfire/%s/spitfire-labjs.js' % spitversion,
    'src/onegateisopening/boot.js',
    'src/gister/packman.js'
  ]
  combine(spitfireList, Yak.paths['build'] + "/there.is.only.jsboot.js", replace=sed)

  # There is only.css
  FileSystem.copyfile('dependencies/spitfire/%s/burnscars.css' % spitversion, Yak.paths['build'] + "/there.is.only.jsboot.css")


  # ================================
  # Build-up the gate framy
  # ================================
  # XXX this must die and be replaced by a proper postmessage shim

  postmessageshim = 'src/mingus/postmessage.js'
  gateList = [
    'dependencies/spitfire/%s/spitfire-labjs.js' % spitversion,
    postmessageshim,
    'src/onegateisopening/gate.js'
  ]

  combine(gateList, Yak.paths['build']  + '/toobsj.ylno.si.ereht.js', replace=sed)

  shortversion = Yak.package['version'].split('-').pop(0).split('.')
  shortversion = shortversion[0] + "." + shortversion[1]

  # Build-up the frame to deploy connect to
  # XXX whether this works is undefined... because of shortversion and selectable versioned deploy
  sed.add('{PUKE-GATE-OPENER}', Yak.config['self'] + "/"+ Yak.package['name'] + "/" + shortversion + "/toobsj.ylno.si.ereht.js")
  combine('src/onegateisopening/gate.html', Yak.paths['build'] + '/gate.html', replace=sed)


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
  combine(mingusList, Yak.paths['build'] + "/mingus.js", replace=sed)


  # ================================
  # jsBoot modules
  # ================================

  list = FileList('src/jsboot/debug', filter = '*.js');
  combine(list, Yak.paths['build'] + "/debug.js", replace=sed)

  # list = FileList('src/jsboot/gister', filter = '*.js')
  list = FileList('src/jsboot/core', filter = '*.js');
  # list.merge(FileList('src/jsboot/gister', filter = '*.js'));
  list.merge(['src/jsboot/types/eventdispatcher.js'])

  # Not exactly "core" per-se
  list.merge(['src/jsboot/types/mutable.js'])
  list.merge(['src/jsboot/controllers/idle.js'])
  list.merge(['src/jsboot/controllers/singleapp.js'])
  list.merge(['src/jsboot/utils/storage.js'])
  list.merge(['src/jsboot/utils/tweener.js'])


  combine(list, Yak.paths['build'] + "/core.js", replace=sed)

  list = [
    'src/jsboot/service/errors.js',
    'src/jsboot/service/client.js',
    'src/jsboot/service/core.js',
    'src/jsboot/service/flaves/account.js',
    'src/jsboot/controllers/application.js'
  ]

  combine(list, Yak.paths['build'] + "/service.js", replace=sed)

  list = FileList('src/jsboot/ui', filter = '*.js');
  combine(list, Yak.paths['build'] + "/ui.js", replace=sed)




  # spitroot = Yak.package['name'] + "/" + shortversion

  # description = {}
  # description["mingus"] = "%s/mingus.js" % spitroot
  # description["jsbootstrap"] = "%s/there.is.only.jsboot.js" % spitroot
  # description["gate"] = "%s/gate.html" % spitroot
  # description["cssbootstrap"] = "%s/there.is.only.jsboot.css" % spitroot

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



  # PH.describe(shortversion, "jsboot", description)



@task("Deploy package")
def deploy():
  # Libraries usually have a versioned path (True)
  # help.deployer(True)
  # Sites or apps dont
  help.deployer(Yak.paths['build'], True)
  # In case you wanna deploy dependencies as well
  # help.deployer('dependencies', True, 'dependencies')

