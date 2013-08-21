#!/usr/bin/make
TSC = tsc

.PHONY: engine engine_clean editor editor_clean server server_clean sq1ega sq1ega_clean all clean

all: engine editor server sq1ega

clean: engine_clean editor_clean server_clean sq1ega_clean

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

##
# Engine Files
##

ENGINE_TS_FILES = \
    scripts/org/ags/engine/Utilities.ts \
    scripts/org/ags/engine/Log.ts \
    scripts/org/ags/engine/Error.ts \
    scripts/org/ags/engine/Event.ts \
    scripts/org/ags/engine/OrderedComponents.ts \
    scripts/org/ags/engine/Cell.ts \
    scripts/org/ags/engine/Loader.ts \
    scripts/org/ags/engine/Loop.ts \
    scripts/org/ags/engine/Component.ts \
    scripts/org/ags/engine/GameObject.ts \
    scripts/org/ags/engine/Scene.ts \
    scripts/org/ags/engine/Set.ts \
    scripts/org/ags/engine/Stage.ts \
    scripts/org/ags/engine/components/Character.ts \
    scripts/org/ags/engine/components/Sprite.ts \
    scripts/org/ags/engine/components/StaticSprite.ts \
    scripts/org/ags/engine/components/Transform.ts \
    scripts/org/ags/engine/Main.ts

ENGINE_JS_FILES = $(ENGINE_TS_FILES:.ts=.js)

$(ENGINE_JS_FILES): $(ENGINE_TS_FILES)
	@echo Building Engine...
	@$(TSC) --target ES5 $(ENGINE_TS_FILES)

ags.engine.d.ts ags.engine.js: $(ENGINE_TS_FILES)
	@echo Building Engine declaration file...
	@$(TSC) --target ES5 $(ENGINE_TS_FILES) --out ags.engine.js --declaration

engine: $(ENGINE_JS_FILES) ags.engine.d.ts

engine_clean:
	rm -f $(ENGINE_JS_FILES)
	rm -f ags.engine.d.ts

##
# Editor Files
##

EDITOR_TS_FILES = \
    scripts/org/ags/editor/Registry.ts \
    scripts/org/ags/editor/Stage.ts \
    scripts/org/ags/editor/Main.ts

EDITOR_JS_FILES = $(EDITOR_TS_FILES:.ts=.js)

$(EDITOR_JS_FILES): ags.engine.d.ts $(EDITOR_TS_FILES)
	@echo Building Editor...
	@$(TSC) --target ES5 ags.engine.d.ts $(EDITOR_TS_FILES)

editor: $(EDITOR_JS_FILES)

editor_clean:
	rm -f $(EDITOR_JS_FILES)

##
# Server
##

SERVER_PLAYER_TS_FILES = \
    serverCommon.ts \
    serverPlayer.ts

SERVER_EDITOR_TS_FILES = \
    serverCommon.ts \
    serverEditor.ts

SERVER_PLAYER_JS_FILES = $(SERVER_PLAYER_TS_FILES:.ts=.js)
SERVER_EDITOR_JS_FILES = $(SERVER_EDITOR_TS_FILES:.ts=.js)

serverPlayer.js: $(SERVER_PLAYER_TS_FILES) $(NODE_TS_FILES)
	@echo Building Server for Player...
	@$(TSC) --target ES5 $(NODE_TS_FILES) $(SERVER_PLAYER_TS_FILES) --out serverPlayer.js

serverEditor.js: $(SERVER_EDITOR_TS_FILES) $(NODE_TS_FILES)
	@echo Building Server for Editor...
	@$(TSC) --target ES5 $(NODE_TS_FILES) $(SERVER_EDITOR_TS_FILES) --out serverEditor.js

server: serverPlayer.js serverEditor.js

server_clean:
	rm -f serverPlayer.js serverEditor.js

##
# SQ1 EGA
##

SQ1EGA_TS_FILES = \
   Games/default/scenes/arcada/arcada.ts

SQ1EGA_JS_FILES = $(SQ1EGA_TS_FILES:.ts=.js)

$(SQ1EGA_JS_FILES): ags.engine.d.ts $(SQ1EGA_TS_FILES)
	@echo Building SQ1EGA...
	@$(TSC) --target ES5 ags.engine.d.ts $(SQ1EGA_TS_FILES)

sq1ega: $(SQ1EGA_JS_FILES)

sq1ega_clean:
	rm -f $(SQ1EGA_JS_FILES)
