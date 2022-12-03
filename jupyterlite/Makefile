SHELL:= /bin/bash

all: activate clean build page deactivate

activate:
	conda activate jlite

deactivate:
	conda deactivate jlite

clean:
	rm -irf _output .jupyterlite.doit.db

build:
	# run twice to get wtc setup
	jupyter lite build && \
	jupyter lite build

page:
	ghp-import -np _output


modules := all activate deactivate build page

.PHONY: $(modules)