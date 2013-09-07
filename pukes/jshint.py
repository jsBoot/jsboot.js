import puke2 as puke

class jsHint:

    """ jshint helper to get of the top
    """

    def __init__(self):
        self.com = puke.sh.Command("./node_modules/.bin/jshint")

    def go(self, list):
        return self.com('--config', 'pukes/jshint.rc', *list)

class fixMyJs:

    """ fixmyjs helper to get of the top
    """

    def __init__(self):
        self.com = puke.sh.Command("./node_modules/.bin/fixmyjs")

    def go(self, list):
        # Right now, escodegen doesn't support line length control - so, using legacy
        return self.com('--indent-pref', 'spaces', '--legacy', '--config', 'pukes/jshint.rc', *list)