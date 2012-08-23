from puke import *
import re
import yaml

# ==================================================================
# General javascript oriented helpers for puke
# ==================================================================

# ------------------------------------------------------------------
# Common yak soup
# ------------------------------------------------------------------

# Puke at large is just untested on windows - and specifically these helpers
if System.OS != System.MACOS and System.OS != System.LINUX:
  console.fail('Your platform sux ass')

# Yank the description file in
r = Require('puke-yak.yaml')
r.yak('yak')
r.yak('user-%s-%s-%s' % (Env.get("PUKE_LOGIN", System.LOGIN), 'box', Env.get("PUKE_OS", System.OS)))

# Aggregate package name and version to the "root" path, if not the default
if Yak.ROOT != './build':
  Yak.ROOT = FileSystem.join(Yak.ROOT, Yak.PACKAGE['NAME'], Yak.PACKAGE['VERSION'])

# Aggregate all inner paths against the declared ROOT, and build-up all the corresponding top level Yak variables
for (key, path) in Yak.ROOT_PATHS.items():
  # Build-up global key only if not overriden
  if not (key + '_ROOT') in Yak:
    Yak.set(key + '_ROOT', FileSystem.join(Yak.ROOT, path))
  FileSystem.makedir(Yak.get(key + '_ROOT'))


# ------------------------------------------------------------------
# Top-level helpers
# ------------------------------------------------------------------

# Cleans every "ROOT" folder cautiously
def cleaner():
  for key in Yak.ROOT_PATHS.keys():
    pathtoremove = Yak[key + '_ROOT']
    resp = prompt('Delete %s? y/[N]' % pathtoremove, 'N')
    if resp == 'y':
      try:
        FileSystem.remove(pathtoremove)
        console.info('Deleted %s' % pathtoremove)
      except:
        console.warn('Failed removing %s' % pathtoremove)

# Adds a {PUKE-*-*} pattern for every package, link, or path entry in the Yak
def replacer(s):
  for (key, path) in Yak.ROOT_PATHS.items():
    s.add('{PUKE-%s}' % (key + '-ROOT').replace('_', '-'), Yak.get(key + '_ROOT'))
  for (key, path) in Yak.PACKAGE.items():
    s.add('{PUKE-%s}' % ('PACKAGE-' + key).replace('_', '-'), Yak.PACKAGE[key])
  if 'LINKS' in Yak:
    for (key, path) in Yak.LINKS.items():
      s.add('{PUKE-%s}' % (key + '-LINK').replace('_', '-'), Yak.LINKS[key])
  return s

# Mint every file in the provided path avoiding xxx files, tests, and already mint files themselves (usually the build root)
excludecrap = '*/tests/*,*xxx*'
def minter(path):
  list = FileList(path, filter = "*.js", exclude = "*-min.js,%s" % excludecrap)
  for burne in list.get():
    minify(burne, re.sub(r"(.*).js$", r"\1-min.js", burne))
  list = FileList(path, filter = "*.css", exclude = "*-min.css,%s" % excludecrap)
  for burne in list.get():
    minify(burne, re.sub(r"(.*).css$", r"\1-min.css", burne))

# Lint every file (usually src)
def linter(path, relax=False):
  list = FileList(path, filter = "*.js", exclude = "*-min.js,*xxx*")
  jslint(list, relax=relax)

# Flint every file (usually src)
def flinter(path, relax=False):
  list = FileList(path, filter = "*.js", exclude = "*-min.js,*xxx*")
  jslint(list, relax=relax, fix=True)

# Stat every file (usually build)
def stater(path):
  list = FileList(path, filter = "*.js", exclude = "*-min.js,%s" % excludecrap)
  stats(list, title = "Javascript")
  list = FileList(path, filter = "*-min.js", exclude = excludecrap)
  stats(list, title = "Minified javascript")
  list = FileList(path, filter = "*.css", exclude = "*-min.css,%s" % excludecrap)
  stats(list, title = "Css")
  list = FileList(path, filter = "*-min.css", exclude = excludecrap)
  stats(list, title = "Minified css")
  list = FileList(path, filter = "*.html,*.xml,*.txt%s" % excludecrap)
  stats(list, title = "(ht|x)ml + txt")
  list = FileList(path, exclude = "*.html,*.xml,*.txt,*.js,*.css,%s" % excludecrap)
  stats(list, title = "Other")

def deployer(withversion):
  list = FileList(Yak.BUILD_ROOT)
  if withversion and (Yak.ROOT != './build'):
    deepcopy(list, FileSystem.join(Yak.DEPLOY_ROOT, Yak.PACKAGE['NAME'], Yak.PACKAGE['VERSION']))
  else:
    deepcopy(list, Yak.DEPLOY_ROOT)

# For the somewhat rare case where we want to fetch a specific package for puke
def getstaticmanifest(name, trunk = False, usemin = False, makeabsolute = True):
  url = Yak.LINKS['STATIC']
  console.info('Reading manifest %s' % url)
  remote = url.split('/')
  remote.pop()
  remote = '/'.join(remote)
  yammy = http.get(url, verify=False)
  yam = yaml.load(yammy.text)
  if name == '*':
    remote = remote.replace('http:', '').replace('https:', '')
    for (name, vn) in yam.items():
      yam[name] = []
      for i in vn:
        yam[name].append(remote + '/' + i)
    return yam

  for i in yam[name]:
    if (trunk and (i.find('trunk') != -1)) or (not trunk and (i.find('trunk') == -1)):
      return remote + '/' + i
      break

def getmanifest(name, version, usemin = False, makeabsolute = True):
  # Get the remoty shims first
  url = Yak.LINKS[name.upper()]
  console.info('Reading manifest %s' % url)
  remote = url.split('/')
  remote.pop()
  remote = '/'.join(remote)
  yammy = http.get(url, verify=False)
  yam = yaml.load(yammy.text)[version]
  for (k, v) in yam.items():
    if makeabsolute:
      yam[k] = remote + '/' + v
    else:
      yam[k] = remote.replace('http:', '').replace('https:', '') + '/' + v
    if usemin:
      yam[k] = v.replace('.js', '-min.js')
      yam[k] = v.replace('.css', '-min.css')
  return yam
