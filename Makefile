#!/usr/bin/make
TSC = tsc

all: utils engine editor server sq1ega

clean: utils_clean engine_clean editor_clean server_clean sq1ega_clean

##
# Node.js
##

NODE_TS_FILES = \
    scripts/declarations/node.d.ts \
    scripts/declarations/node_buffer.d.ts \
    scripts/declarations/node_fs.d.ts \
    scripts/declarations/node_http.d.ts \
    scripts/declarations/node_path.d.ts \
    scripts/declarations/node_process.d.ts \
    scripts/declarations/node_url.d.ts

JQUERY_TS_FILES = \
    scripts/declarations/jquery.d.ts \
    scripts/declarations/jquery.mobile.d.ts

include Makefile.utils
include Makefile.engine
include Makefile.editor
include Makefile.server
include Games/sq1ega/Makefile


