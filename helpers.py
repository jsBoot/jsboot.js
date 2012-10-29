from puke import *
import re
import json

# ==================================================================
# Global helpers for puke
# ==================================================================

# ------------------------------------------------------------------
# Common yak soup
# ------------------------------------------------------------------

def __enforceunix():
  # Puke at large is just untested on windows - and specifically these helpers
  if System.OS != System.MACOS and System.OS != System.LINUX:
    console.fail('Your platform is not supported')

def __yankconfiguration():
  # Yank the base config file
  r = Require('config.yaml')
  # Try to get separate user specific file, either as json or yaml
  usercpath = 'config-%s-%s' % (Env.get("PUKE_LOGIN", System.LOGIN), Env.get("PUKE_OS", System.OS).lower())
  try:
    r.merge(usercpath + ".json")
  except:
    try:
      r.merge(usercpath + ".yaml")
    except:
      pass

  # Yank in the base and default config
  r.yak('baseYank')
  r.yak('defaultYank')
  # Try to yank in a user defined node
  try:
    r.yak(usercpath)
    console.info('Reading inline user configuration from main file')
  except:
    pass
  try:
    r.yak('userYank')
    console.info('Reading separate user configuration')
  except:
    pass

def __yankgitdata():
  # Git helpers
  # Commit hash start: git log -n1 --pretty=format:%h
  # Full commit hash: git log | head -n 1 | cut -f2 -d" "
  # Commit number: git log --pretty=format:%h | wc -l
  # Current branch: git branch | grep '*'

  try:
    branch = sh("cd .; git branch | grep '*'", output=False).strip('*').strip()
    if branch == '(no branch)':
      branch = sh("cd .; git describe --tags", output=False).strip()
    commitnb = sh("cd .; git log --pretty=format:%s | wc -l" % '%h', output=False).strip()
    commithash = sh("cd .; git log | head -n 1 | cut -f2 -d' '", output=False).strip()
    Yak.git['root'] = Yak.git['root'].replace('/master/', '/' + branch + '/')
    Yak.git['revision'] = '#' + commitnb + '-' + commithash
  except:
    Yak.git['revision'] = '#no-git-information'
    console.error("FAILED fetching git information - locations won't be accurate")

def __preparepaths():
  # Aggregate package name and version to the "root" path, if not the default
  if Yak.root != './':
    Yak.root = FileSystem.join(Yak.root, Yak.package['name'], Yak.package['version'])

  # Aggregate all inner paths against the declared ROOT, and build-up all the corresponding top level Yak variables
  for (key, path) in Yak.paths.items():
    # Build-up global key only if not overriden
    if not (key + '_root') in Yak:
      Yak.set(key + '_root', FileSystem.join(Yak.root, path))
    FileSystem.makedir(Yak.get(key + '_root'))


def __prepareconfig():
  Yak.istrunk = Yak.settings['variant'] == 'bleed'


__enforceunix()
__yankconfiguration()
__yankgitdata()
__preparepaths()
__prepareconfig()

# ------------------------------------------------------------------
# Top-level helpers
# ------------------------------------------------------------------

# Cleans every "ROOT" folder cautiously
def cleaner():
  for key in Yak.paths.keys():
    pathtoremove = Yak.get(key + '_root')
    resp = prompt('Delete %s? y/[N]' % pathtoremove, 'N')
    if resp == 'y':
      try:
        FileSystem.remove(pathtoremove)
        console.info('Deleted %s' % pathtoremove)
      except:
        console.error('Failed removing %s' % pathtoremove)


# Adds a {PUKE-*-*} pattern for every package, link, or path entry in the Yak
def replacer(s):
  for (key, path) in Yak.package.items():
    s.add('{PUKE-PACKAGE-%s}' % key.replace('_', '-').upper(), Yak.package[key])
  for (key, path) in Yak.rights.items():
    s.add('{PUKE-RIGHTS-%s}' % key.replace('_', '-').upper(), Yak.rights[key])
  for (key, path) in Yak.git.items():
    s.add('{PUKE-GIT-%s}' % key.replace('_', '-').upper(), Yak.git[key])
  for (key, path) in Yak.paths.items():
    s.add('{PUKE-%s-ROOT}' % key.replace('_', '-').upper(), Yak.get(key + '_root'))
  if 'links' in Yak:
    for (key, path) in Yak.links.items():
      s.add('{PUKE-%s-LINK}' % key.replace('_', '-').upper(), Yak.links[key]['url'])
  return s




# Mint every file in the provided path avoiding xxx files, tests, and already mint files themselves (usually the build root)
excludecrap = '*xxx*'

# XXX still crap
def minter(path, filter = '', excluding = '', strict = True):
  if excluding:
    excluding = ',%s' % excluding

  if not filter:
    filtre = '*.js'
    list = FileList(path, filter = filtre, exclude = "*-min.js,%s%s" % (excludecrap, excluding))
    for burne in list.get():
      print burne
      print re.sub(r"(.*).js$", r"\1-min.js", burne)
      minify(burne, re.sub(r"(.*).js$", r"\1-min.js", burne), strict = strict)
    filtre = '*.css'
    list = FileList(path, filter = filtre, exclude = "*-min.css,%s%s" % (excludecrap, excluding))
    for burne in list.get():
      minify(burne, re.sub(r"(.*).css$", r"\1-min.css", burne))
  else:
    filtre = filter
    list = FileList(path, filter = filtre, exclude = "*-min.js,%s%s" % (excludecrap, excluding))
    for burne in list.get():
      minify(burne, re.sub(r"(.*).js$", r"\1-min.js", burne), strict = strict)

# Lint every file (usually src)
def linter(path, excluding = '', relax=False):
  if excluding:
    excluding = ',%s' % excluding
  list = FileList(path, filter = "*.js", exclude = "*-min.js,%s%s" % (excludecrap, excluding))
  jslint(list, relax=relax)

def hinter(path, excluding = '', relax=False):
  System.check_package('node')
  System.check_package('npm')
  System.check_package('jshint')
  if excluding:
    excluding = ',%s' % excluding
  list = FileList(path, filter = "*.js", exclude = "*-min.js,%s%s" % (excludecrap, excluding))
  res = '"' + '" "'.join(list.get()) + '"'
  ret = sh('jshint --config %s %s' % ('hinter.json', res), output = False)
  if ret:
    console.fail(ret)
  else:
    console.info("You passed the dreaded hinter!")

#  npm install -g jshint


# Flint every file (usually src)
def flinter(path, excluding = '', relax=False):
  if excluding:
    excluding = ',%s' % excluding
  list = FileList(path, filter = "*.js", exclude = "*-min.js,%s%s" % (excludecrap, excluding))
  jslint(list, relax=relax, fix=True)

# Stat every file (usually build)
def stater(path, excluding = ''):
  if excluding:
    excluding = ',%s' % excluding
  list = FileList(path, filter = "*.js", exclude = "*-min.js,%s%s" % (excludecrap, excluding))
  stats(list, title = "Javascript")
  list = FileList(path, filter = "*-min.js", exclude = "%s%s" % (excludecrap, excluding))
  stats(list, title = "Minified javascript")
  list = FileList(path, filter = "*.css", exclude = "*-min.css,%s%s" % (excludecrap, excluding))
  stats(list, title = "Css")
  list = FileList(path, filter = "*-min.css", exclude = "%s%s" % (excludecrap, excluding))
  stats(list, title = "Minified css")
  list = FileList(path, filter = "*.html,*.xml,*.txt", exclude = "%s%s" % (excludecrap, excluding))
  stats(list, title = "(ht|x)ml + txt")
  list = FileList(path, exclude = "*.html,*.xml,*.txt,*.js,*.css,%s%s" % (excludecrap, excluding))
  stats(list, title = "Other")

def deployer(withversion):
  list = FileList(Yak.build_root, exclude="*.DS_Store")
  if withversion and (Yak.root != './' or Yak.deploy_root != './lib'):
    v = Yak.package['version'].split('-').pop(0).split('.')
    v = v[0] + "." + v[1]
    deepcopy(list, FileSystem.join(Yak.deploy_root, Yak.package['name'], v))
  else:
    deepcopy(list, Yak.deploy_root)

def describe(shortversion, name, description):
  yamu = FileSystem.join(Yak.deploy_root, "%s.json" % name)
  if FileSystem.exists(yamu):
    mama = json.loads(FileSystem.readfile(yamu))
    mama[shortversion] = description
  else:
    mama = {shortversion: description}

  # Straight to service root instead - kind of hackish...
  FileSystem.writefile(yamu, json.dumps(mama, indent=4))




















# For the somewhat rare case where we want to fetch a specific package for puke
def getstaticmanifest(name, trunk = False, usemin = False, makeabsolute = True):
  url = Yak.links['airstrip']['url']
  console.info('Reading manifest %s' % url)
  remote = url.split('/')
  remote.pop()
  remote = '/'.join(remote)
  yammy = http.get(url, verify=False)
  yam = json.loads(yammy.text, 'utf8')[Yak.links['airstrip']['version']]
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

def getmanifest(name, usemin = False, makeabsolute = True):
  # Get the remoty shims first
  url = Yak.links[name]['url']
  console.info('Reading manifest %s' % url)
  remote = url.split('/')
  remote.pop()
  remote = '/'.join(remote)
  yammy = http.get(url, verify=False)
  yam = json.loads(yammy.text.encode('latin-1'), encoding = 'latin-1')[Yak.links[name]['version']]
  for (k, v) in yam.items():
    if makeabsolute:
      yam[k] = remote + '/' + v
    else:
      yam[k] = remote.replace('http:', '').replace('https:', '') + '/' + v
    if usemin:
      yam[k] = re.sub(r"(.*).js$", r"\1-min.js", yam[k])
      yam[k] = re.sub(r"(.*).css$", r"\1-min.css", yam[k])
  return yam

