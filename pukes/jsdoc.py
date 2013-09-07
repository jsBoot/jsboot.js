import puke2 as puke

class jsDoc:

    """ jsDoc3 helper to get of the top
    """

    def __init__(self):
        self.com = puke.sh.Command("./node_modules/jsdoc/jsdoc")

    def go(self, source, theme, destination):
        return self.com(puke.sh.glob(puke.fs.join(source, "*.js")), "-t", theme, "-c", "pukes/jsdoc.json", "-d", destination)
