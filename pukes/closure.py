import puke2 as puke


class gjsLint:

    """ jshint helper to get of the top
    """

    def __init__(self):
        self.com = puke.sh.Command("/usr/local/bin/gjslint")

    def go(self, list):

        # tags = 'homepage,ignore,requires,namespace,property,static,default,location,copyright,memberOf,lends,fileOverview'
        # This covers jsdoc3 as well
        # tags += 'description,event,exception,exports,fires,global,inner,instance,var,memberof,mixes,mixin,arg,argument,readonly,since,todo,public'

        tags =  'file,summary,version,copyright,name,location,module,todo,abstract,member,function,\
example,constant,returns,author,\
namespace,property,static,requires,memberof,property,kind,ignore,homepage,description,default'
        return self.com(
            '--jslint_error', 'blank_lines_at_top_level',
            '--jslint_error', 'indentation',
            '--jslint_error', 'no_braces_around_inherit_doc',
            '--jslint_error', 'braces_around_type',
            '--jslint_error', 'optional_type_marker',
            '--jslint_error', 'unused_private_members',
            '--max_line_length', '120',
            '--custom_jsdoc_tags', tags,
            *list)


class fixJsStyle:

    """ fixmyjs helper to get of the top
    """

    def __init__(self):
        self.com = puke.sh.Command("/usr/local/bin/fixjsstyle")

    def go(self, list):
        tags =  'file,summary,version,copyright,name,location,module,todo,abstract,member,function,\
example,constant,returns,author'
        return self.com(
            '--jslint_error', 'blank_lines_at_top_level',
            '--jslint_error', 'indentation',
            '--jslint_error', 'no_braces_around_inherit_doc',
            '--jslint_error', 'braces_around_type',
            '--jslint_error', 'optional_type_marker',
            '--jslint_error', 'unused_private_members',
            '--max_line_length', '100',
            '--custom_jsdoc_tags', tags,
            *list)
