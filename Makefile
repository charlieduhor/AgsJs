
FILES = \
   scripts/org/ags/engine/Utilities.ts \
   scripts/org/ags/engine/Log.ts \
   scripts/org/ags/engine/OrderedComponents.ts \
   scripts/org/ags/engine/Component.ts \
   scripts/org/ags/engine/GameObject.ts \
   scripts/org/ags/engine/Stage.ts \
   scripts/org/ags/engine/components/Transform.ts \
   scripts/org/ags/engine/Main.ts

TSC = tsc

all:
	$(TSC) --target ES5 $(FILES)
