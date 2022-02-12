.SECONDARY:

.PHONY: clean
run: arrays

clean:
	rm -f *.comp.json
	rm -f *.bin

%.comp.json: %.cairo
	cairo-compile $< --output $@

%: %.comp.json
	cairo-run --program=$< --print_output --print_info --debug_error --print_memory --relocate_prints --layout=small

