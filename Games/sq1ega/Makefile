
.PHONY: sq1ega sq1ega_clean

SQ1EGA_TS_FILES = \
   Games/sq1ega/scenes/arcada/arcada.ts

SQ1EGA_JS_FILES = $(SQ1EGA_TS_FILES:.ts=.js)

$(SQ1EGA_JS_FILES): $(UTILS_D_FILE) $(ENGINE_D_FILE) $(SQ1EGA_TS_FILES)
	@echo Building SQ1EGA...
	@$(TSC) --target ES5 $(UTILS_D_FILE) $(ENGINE_D_FILE) $(SQ1EGA_TS_FILES)

sq1ega: $(SQ1EGA_JS_FILES)

sq1ega_clean:
	rm -f $(SQ1EGA_JS_FILES)
