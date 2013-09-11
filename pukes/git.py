import puke2 as puke
from error import *


class Git:

    """ Trivial git helper on top of puke.sh
    """

    def __init__(self, path="."):
        self.giter = puke.sh.git.bake(_cwd=path, _tty_out=False)

    def branch(self):
        try:
            branch = puke.sh.grep(
                self.giter("branch", "--no-color"), "*").strip("*").strip()
            if branch == "(no branch)":
                branch = self.giter("describe", "--tags", "--no-color").strip()
            return branch
        except Exception as e:
            raise GitError(BROKEN, e)

    def nb(self):
        try:
            return puke.sh.wc(
                self.giter("log", "--no-color", "--pretty=format:%h"),
                '-l').strip()
        except Exception as e:
            raise GitError(BROKEN, e)

    def hash(self):
        try:
            return puke.sh.cut(puke.sh.head(
                self.giter("log"),
                n=1), f=2, d=' ').strip()
        except Exception as e:
            raise GitError(BROKEN, e)
