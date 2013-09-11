import puke2 as puke


class Karma:

    """ Karma helper to get of the top
    """

    def __init__(self):
        self.com = puke.sh.Command("./node_modules/.bin/karma")

    def go(self, browsers):
        self.com("start", "pukes/karma.js", "--browsers", browsers)
