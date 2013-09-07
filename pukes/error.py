UNSPECIFIED = "UNSPECIFIED"
UNIMPLEMENTED = "UNIMPLEMENTED"
WRONG_ARGUMENT = "WRONG_ARGUMENT"
MISSING = "MISSING"
BROKEN = "BROKEN"

class GenericError(Exception):

    """Base class for exceptions in airstrip."""

    def __init__(self, etype, message):
        if not etype in globals():
            etype = UNSPECIFIED
        self.type = etype
        self.message = message
        super(GenericError, self).__init__(message)


class ConfigError(GenericError):

    """Exception raised for errors in the rc submodule.

    Attributes:
      etype -- error type
      message  -- explanation of the error
    """

    def __init__(self, etype, message):
        super(ConfigError, self).__init__(etype, message)


class GitError(GenericError):

    """Exception raised for errors in the git submodule.

    Attributes:
      etype -- error type
      message  -- explanation of the error
    """

    def __init__(self, etype, message):
        super(GitError, self).__init__(etype, message)