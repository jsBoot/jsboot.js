#!/usr/bin/env puke
# -*- coding: utf8 -*-

import puke2 as puke
from pukes.helpers import yawner, Helpers


@task("Default task")
def default():
    puke.tasks.execute("build")
    puke.tasks.execute("tests_build")
    puke.tasks.execute("deploy")
    puke.tasks.execute("hint")


@task("All")
def all():
    puke.tasks.execute("update")
    # Cache.clean()
    puke.tasks.execute("hint")
    puke.tasks.execute("build")
    puke.tasks.execute("tests_build")
    puke.tasks.execute("mint")
    puke.tasks.execute("deploy")
    puke.tasks.execute("doc")
    puke.tasks.execute("stats")
    # puke.tasks.execute("tests")


@task("Hint")
def hint():
    puke.display.header("Hinting all ur mess")

    ret = puke.web.hint("src") or puke.web.hint("tests")
    if ret:
        puke.display.fail(ret)
    else:
        puke.display.info("You passed the dreaded hinter!")


@task("Tidy")
def tidy():
    puke.display.header("Tidying ur shit")
    puke.display.info(puke.web.tidy("src"))
    puke.display.info(puke.web.tidy("tests"))


@task("Stats (on the build folder)")
def stats():
    puke.display.header("Numbers!")
    Helpers.stats(yawner.paths().build)


@task("Rm temporary and output directories")
def clean():
    puke.display.header("Cleanup")
    Helpers.clean(yawner.paths().items())


@task("Minting")
def mint():
    puke.display.header("Minificying")
    Helpers.mint(yawner.paths().build)


@task("jsDocking")
def doc():
    puke.display.header("Documenting")

    source = puke.find("src")
    destination = puke.fs.join(yawner.paths().tmp, 'doc')
    replace = yawner.replacer()
    puke.copy(source, destination, replace=replace)

    Helpers.doc(
        destination, "bower_components/ink-docstrap/template/", yawner.paths().doc)


@task("Tests building")
def tests_build():
    puke.display.header("Testygryfing")

    # ============================
    # Build tests
    # ============================
    replace = yawner.replacer()

    list = puke.find(yawner.paths().tests,
                     filter="*.js,*.html,*.css", exclude="*xxx*")
    puke.copy(
        list, puke.fs.join(yawner.paths().build, 'tests'), replace=replace)


@task("Tests doing")
def tests():
    puke.display.header("Do the dance baby!")
    Helpers.test("bs_firefox_stable_mac")

    # Helpers.test("bs_ie_10")#"bs_firefox_stable_mac,bs_firefox_esr_mac")
    # Helpers.test("bs_ie_9")#"bs_firefox_stable_mac,bs_firefox_esr_mac")
    # Helpers.test("bs_ie_8")#"bs_firefox_stable_mac,bs_firefox_esr_mac")
    # Helpers.test("bs_ie_7")#"bs_firefox_stable_mac,bs_firefox_esr_mac")
    # Helpers.test("bs_ie_6")#"bs_firefox_stable_mac,bs_firefox_esr_mac")


@task("Deploy package")
def deploy():
    yawner.deployer(yawner.paths().build, withversion=True)

    yawner.deployer(
        puke.fs.join('bower_components', 'jasmine', 'lib', 'jasmine-core'),
        destination='dependencies/jasmine', withversion=True)
    yawner.deployer(
        puke.fs.join('bower_components', 'jasmine-bootstrap', 'src'),
        destination='dependencies/jasmine', withversion=True)
    yawner.deployer(
        puke.fs.join('bower_components', 'jasmine-reporters', 'src'),
        destination='dependencies/jasmine', withversion=True)

    yawner.deployer(puke.fs.join('bower_components', 'jquery'),
                    destination='dependencies/jquery', withversion=True)
    yawner.deployer(
        puke.fs.join('bower_components', 'bootstrap', 'docs', 'assets', 'js'),
        destination='dependencies/bootstrap/js', withversion=True)
    yawner.deployer(
        puke.fs.join('bower_components', 'bootstrap', 'docs', 'assets', 'css'),
        destination='dependencies/bootstrap/css', withversion=True)

    yawner.deployer(
        puke.fs.join('bower_components', 'spitfire.js', 'dist', 'burnscars'),
        destination='burnscars', withversion=True)

    # yawner.deployer(puke.fs.join('bower_components', 'PIE', 'build'),
    #                 destination='dependencies/pie', withversion=True)
    # yawner.deployer(puke.fs.join('bower_components', 'ie7'),
    #                 destination='dependencies/ie7', withversion=True)


@task("Build package")
def build():
    puke.display.header("Building")

    # source = puke.find("src")
    destination = yawner.paths().build
    replace = yawner.replacer()

    # Mini tiojs
    puke.combine(['bower_components/spitfire.js/dist/gulliver.js', 'src/onegateisopening/b.js'], puke.fs.join(destination, "t.i.o.j.js"), replace=replace)

    puke.copy(puke.find('src', filter = "*index.html,*miniboot*,*assets*"), destination)

    # There is only
    spitfireList = [
      'src/strict.js',
      'bower_components/spitfire.js/dist/spitfire-lab.js',
      'src/onegateisopening/boot.js',
      'src/gister/packman.js'
    ]
    puke.combine(spitfireList, puke.fs.join(destination, "there.is.only.jsboot.js"), replace=replace)

    # There is only.css
    puke.fs.copyfile('bower_components/spitfire.js/dist/burnscars.css',puke.fs.join(destination, "there.is.only.jsboot.css"))




    # ================================
    # Build-up the gate framy
    # ================================
    # XXX this must die and be replaced by a proper postmessage shim

    gateList = [
      'src/strict.js',
      'bower_components/spitfire.js/dist/spitfire-lab.js',
      'src/mingus/postmessage.js',
      'src/onegateisopening/gate.js'
    ]

    puke.combine(gateList, puke.fs.join(destination, 'toobsj.ylno.si.ereht.js'), replace=replace)

    shortversion = yawner.config.version.split('.')
    shortversion = shortversion[0] + "." + shortversion[1]

    # Build-up the frame to deploy connect to
    # XXX whether this works is undefined... because of shortversion and selectable versioned deploy

    replace.add('{PUKE-GATE-OPENER}', puke.fs.join(yawner.config.config.self, yawner.config.name, shortversion, "toobsj.ylno.si.ereht.js"))
    puke.combine('src/onegateisopening/gate.html', puke.fs.join(destination, 'gate.html'), replace=replace)


    # ================================
    # Standalone mingus
    # ================================

    mingusList = [
      # Have postmessage shit
      'src/mingus/postmessage.js',
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
    puke.combine(mingusList, puke.fs.join(destination, "mingus.js"), replace=replace)


    # ================================
    # jsBoot modules
    # ================================

    list = puke.find('src/jsboot/debug', filter = '*.js');
    puke.combine(list, puke.fs.join(destination, "debug.js"), replace=replace)

    # list = FileList('src/jsboot/gister', filter = '*.js')
    list = puke.find('src/jsboot/core', filter = '*.js');
    # list.merge(FileList('src/jsboot/gister', filter = '*.js'));
    list.merge(['src/jsboot/types/eventdispatcher.js'])

    # Not exactly "core" per-se
    list.merge(['src/jsboot/types/mutable.js'])
    list.merge(['src/jsboot/controllers/idle.js'])
    list.merge(['src/jsboot/controllers/singleapp.js'])
    list.merge(['src/jsboot/utils/storage.js'])
    list.merge(['src/jsboot/utils/tweener.js'])


    puke.combine(list, puke.fs.join(destination, "core.js"), replace=replace)

    list = [
      'src/jsboot/service/errors.js',
      'src/jsboot/service/client.js',
      'src/jsboot/service/core.js',
      'src/jsboot/service/flaves/account.js',
      'src/jsboot/controllers/application.js'
    ]

    puke.combine(list, puke.fs.join(destination, "service.js"), replace=replace)

    list = puke.find('src/jsboot/ui', filter = '*.js');
    puke.combine(list, puke.fs.join(destination, "ui.js"), replace=replace)
