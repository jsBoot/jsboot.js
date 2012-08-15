from puke import *

################################################# EVERYTHING BELOW CAN BE USED GENERALLY IN ANY PUKEFILE

######## Standard Yanking
# Roxish is not meant to run anywhere else
if System.OS != System.MACOS and System.OS != System.LINUX:
    console.fail('Your platform sux ass')


# Yank the files in
r = Require('puke-yak.yaml')
# Yak the yak node
r.yak('yak')
# Yak-in another node, from PUKE_LOGIN/PUKE_OS env variables, or from what the system returns as login/os
# Will fail silently!!!!
r.yak('user-%s-%s-%s' % (Env.get("PUKE_LOGIN", System.LOGIN), 'box', Env.get("PUKE_OS", System.OS)))

# Aggregate package name and version to the "root" path
Yak.ROOT = FileSystem.join(Yak.ROOT, Yak.PACKAGE['NAME'], Yak.PACKAGE['VERSION'])

# Aggregate all inner paths against the declared ROOT, and build-up all the corresponding top level Yak variables
for (key, path) in Yak.ROOT_PATHS.items():
    # Build-up global key only if not overriden
    if not (key + '_ROOT') in Yak:
        Yak.set(key + '_ROOT', FileSystem.join(Yak.ROOT, path))
    FileSystem.makedir(Yak.get(key + '_ROOT'))

######## END Standard Yanking

# ######## Simple helper to perform a cautious, error resistent clean
# def cautiousclean(pathtoremove, description = 'mouflon'):
#     resp = prompt('Delete %s (is a %s)? y/[N]' % (pathtoremove, description), 'N')
#     if resp == 'y':
#         try:
#             FileSystem.remove(pathtoremove)
#             console.info('Deleted %s' % pathtoremove)
#         except:
#             console.warn('Failed removing %s' % pathtoremove)


# ######## Universal cautious clean
# def globalclean():
#     cautiousclean(Yak.BUILD_ROOT, 'temporary build directory')
#     cautiousclean(Yak.TMP_ROOT, 'temporary directory')
#     cautiousclean(Yak.DEPLOY_ROOT, 'deploy directory for compiled stuff')
#     cautiousclean(Yak.PACK_ROOT, 'directory holding zipped release packages')
#     cautiousclean(Yak.DOC_ROOT, 'directory holding documentation')
#     cautiousclean(Yak.SCRIPT_ROOT, 'directory holding startup and helper scripts')

#     cautiousclean(Yak.ETC_ROOT, 'configuration directory')
#     cautiousclean(Yak.DATA_ROOT, 'data directory')
#     cautiousclean(Yak.LOG_ROOT, 'log directory')
#     cautiousclean(Yak.RUN_ROOT, 'run/lock/pid files directory')


######## Overload a sed object with {puke-} replaces for all PATHs yak
def addrootreplace(s):
    for (key, path) in Yak.ROOT_PATHS.items():
        s.add('{PUKE-%s}' % (key + '-ROOT').replace('_', '-'), Yak.get(key + '_ROOT'))
    return s

######## Overload a sed object with {puke-} replaces for all PACKAGEs yak
def addpackagereplace(s):
    for (key, path) in Yak.PACKAGE.items():
        s.add('{PUKE-%s}' % ('PACKAGE-' + key).replace('_', '-'), Yak.PACKAGE[key])
    return s

######## Overload a sed object with {puke-} replaces for all LINKs yak
def addlinksreplace(s):
    for (key, path) in Yak.LINKS.items():
        s.add('{PUKE-%s}' % (key + '-LINK').replace('_', '-'), Yak.LINKS[key])
    return s
