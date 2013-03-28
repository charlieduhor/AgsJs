
FILES = \
   www/Engine/org/ags/Utilities.ts \
   www/Engine/org/ags/Component.ts \
   www/Engine/org/ags/GameObject.ts \
   www/Engine/org/ags/Stage.ts \
   www/Engine/org/ags/components/Transform.ts \
   www/Engine/Start.ts

TSC = /cygdrive/c/Program\ Files/nodejs/tsc.cmd

all:
	$(TSC) --target ES5 --out www/player.js $(FILES)
