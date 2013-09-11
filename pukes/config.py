import puke2 as puke
from error import *


class Config(puke.config.File):

    """A config class extending puke.config.File to support multiple paths and
    default boilerplate.

    Multiple paths allows for exemple to have home "general" config files
    to be overriden by other files present in the current working directory.

    The default boilerplate gives you the guarantee that all settings at least
    exist.

    :param default A string containing a json object with default values for
    your config
    :param mainpath Where the main config file is expected to be
    :param additionalpaths An array containing additional paths to use
    """

    def __init__(self, default, mainpath, additionalpaths=[], version="1"):
        if isinstance(additionalpaths, basestring):
            additionalpaths = [additionalpaths]
        additionalpaths.insert(0, mainpath)
        super(Config, self).__init__(default)
        for p in additionalpaths:
            if puke.fs.exists(p) and puke.fs.isfile(p, True):
                try:
                    self.merge(p)
                except:
                    raise ConfigError(
                        BROKEN,
                        "Your config file at %s is horked! rm / fix it" % p)
