
FILES = \
   www/Engine/org/ags/Utilities.ts \
   www/Engine/org/ags/Log.ts \
   www/Engine/org/ags/OrderedComponents.ts \
   www/Engine/org/ags/Component.ts \
   www/Engine/org/ags/GameObject.ts \
   www/Engine/org/ags/Stage.ts \
   www/Engine/org/ags/components/Transform.ts \
   www/Engine/Start.ts

TSC = tsc

all:
	$(TSC) --target ES5 --out www/player.js $(FILES)
