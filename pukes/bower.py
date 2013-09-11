import puke2 as puke


class Bower:

    """ Formerly airstrip - just wraps around Bower to handle dependencies
    """

    def __init__(self, conf):
        self.config = conf
        self.com = puke.sh.Command("./node_modules/.bin/bower")
        pass

    def init(self):
        for i in self.config:
            d = self.config[i]
            for v in d.versions:
                puke.display.info(
                    "Installing: %s/%s#%s into %s" % (d.owner, d.repo, v, i))
                puke.display.info(
                    str(self.add(i, d.owner, d.repo, v, True if "private" in d else False)))
        # Force update once done
        self.com.update()

    def update(self):
        return self.com.update()

    def list(self):
        ret = {}
        for i in self.config:
            d = self.config[i]
            if "active" in d:
                # ret[i] = 'bower_components/%s-%s' % (i, d.active)
                ret[i] = 'bower_components/%s' % i
            else:
                for v in d.versions:
                    # ret[i] = 'bower_components/%s-%s' % (i, v)
                    ret[i] = 'bower_components/%s' % i

        return ret  # self.config.keys()

    # def path(self, key, version):
    #     return self.config[key].owner, self.config[key].repo

    # def real_list(self):
    #     ls = puke.find(".", filter = "*bower.json*")
    #     result = {}
    #     for i in ls:
    #         cc = puke.config.load(i)
    #         name = cc.content.name
    #         url = cc.content.homepage
    #         version = cc.content._target
    #         source = cc.content._source
    #         if 'version' in cc.content:
    #             version = cc.content.version
    #         if not source in result:
    #             result[source] = {
    #                 "home": url,
    #                 "versions": []
    #             }
    #         result[source]["versions"].append({"path": "bower_components/%s" %name, "version": version})
    #     return result
    def search(self, keyword):
        return self.com.search(keyword)

    def info(self, name):
        return self.com.info(name)

    def add(self, local, owner, name, version='master', private=False):
        # Get external shims
        version = version or 'master'
        remote = 'git@github.com:%s/%s.git' % (
            owner, name) if private else 'git://github.com/%s/%s' % (owner, name)
        # return puke.sh.bower.install("%s-%s=%s#%s" % (local, version, remote, version))
        # return puke.sh.bower.install("%s=%s#%s" % (local, remote, version))
        print "bower install %s#%s" % (remote, version)
        return self.com.install("%s#%s" % (remote, version))
