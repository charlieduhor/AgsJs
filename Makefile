#!/usr/bin/make
TSC = tsc

.PHONY: engine editor sq1ega

all: engine editor sq1ega

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

##
# Editor Files
##

EDITOR_TS_FILES = \
   scripts/org/ags/editor/Registry.ts \
   scripts/org/ags/editor/Main.ts

EDITOR_JS_FILES = $(EDITOR_TS_FILES:.ts=.js)

EDITOR_JS_FILES: ags.engine.d.ts $(EDITOR_TS_FILES)
	@echo Building Editor...
	@$(TSC) --target ES5 ags.engine.d.ts $(EDITOR_TS_FILES)

editor: $(EDITOR_TS_FILES)

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

