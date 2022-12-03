SHELL:= /bin/bash
activate_conda = source /opt/conda/bin/activate && conda activate jlite

all: clean build page

clean:
	rm -rf _output .jupyterlite.doit.db

build:
	# run jlite twice to get wtc setup
	$(activate_conda) && \
	jupyter lite build && jupyter lite build && \
	python kernel2xeus_python.py _output/files/main.ipynb

page:
	$(activate_conda) && \
	ghp-import -np _output


modules := all activate deactivate build page

.PHONY: $(modules)