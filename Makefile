
ENGINE_FILES = \
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
   scripts/org/ags/engine/Set.ts \
   scripts/org/ags/engine/Stage.ts \
   scripts/org/ags/engine/components/Character.ts \
   scripts/org/ags/engine/components/Sprite.ts \
   scripts/org/ags/engine/components/StaticSprite.ts \
   scripts/org/ags/engine/components/Transform.ts \
   scripts/org/ags/engine/Main.ts

EDITOR_FILES = \
   scripts/org/ags/editor/Registry.ts \
   scripts/org/ags/editor/Main.ts

TSC = tsc

editor: $(ENGINE_FILES) $(EDITOR_FILES)
	$(TSC) --target ES5 $(ENGINE_FILES) $(EDITOR_FILES)

engine: $(ENGINE_FILES)
	$(TSC) --target ES5 $(ENGINE_FILES)
