SHELL:= /bin/bash

# JupyterLite
jl_folder = jupyterlite
jl_env_file = $(jl_folder)/dep/environment.yml
jl_env_name = jl$(word 1, $(shell md5sum $(jl_env_file)))
activate_conda = source /opt/conda/bin/activate && conda activate $(jl_env_name)
# Registry for docker images
REGISTRY=localhost:32000
# REGISTRY=chungc
# version for tagging image for deployment
VERSION=0.0.2b

python_version=3.11.4

base = base-notebook

docker-stacks-build = cd docker-stacks && docker build "$@" -t "$@"

port ?= 8888

docker-stacks-foundation:
	$(docker-stacks-build) \
		--build-arg PYTHON_VERSION="$(python_version)" \
		
base-notebook: docker-stacks-foundation
	$(docker-stacks-build) \
		--build-arg BASE_CONTAINER="docker-stacks-foundation" \

minimal-notebook: base-notebook
	$(docker-stacks-build) \
		--build-arg BASE_CONTAINER="base-notebook"

scipy-notebook: minimal-notebook
	$(docker-stacks-build) \
		--build-arg BASE_CONTAINER="minimal-notebook"

push.%:
	docker tag "$*" "${REGISTRY}/$*:${VERSION}"
	docker push "${REGISTRY}/$*:${VERSION}"

# Programming languages and language servers
programming: jupyter-interface
	docker build \
		-t "programming" -f programming/Dockerfile .

# Development environments
jupyter-interface: base-notebook
	docker build --pull \
		-t "jupyter-interface" -f jupyter-interface/Dockerfile .

# Mathematical engines
math:
	docker build --pull \
		-t "math" -f math/Dockerfile .

# Mathematical animations
manim:
	docker build --pull \
		-t "manim" -f manim/Dockerfile .

image.%:
	cd $* && \
	docker build -t "$*" .


# manim dev cds;
cs1302nb: $(base)
	base=$(base); i=0; \
	for module in jupyter-interface programming ; \
	do \
	stage="cs1302nb$$((++i))_$$module"; \
	docker build --build-arg BASE_CONTAINER="$$base" \
		-t "$$stage" -f "$$module/Dockerfile" .; \
	base="$$stage"; \
	done; \
	docker tag "$$stage" cs1302nb

test.%:
	docker run -it -p $(port):8888/tcp $* start-notebook.sh --NotebookApp.token=''

jobe: scipy-10
	base=scipy-10; i=0; \
	for module in jupyter-interface programming jobeinabox; \
	do \
	stage="jobe$$((++i))_$$module"; \
	docker build --build-arg BASE_CONTAINER="$$base" \
		-t "$$stage" -f "$$module/Dockerfile" .; \
	base="$$stage"; \
	done; \
	docker tag "$$stage" jobe
	docker run --rm -it  -p 8888:8888/tcp jobe

cs1302hub:
	cd cs1302-deploy && \
	docker build --pull \
		-t "cs1302hub" -f Dockerfile .

cs1302ihub:
	cd cs1302-deploy/instructor && \
	docker build --pull \
		-t "cs1302ihub" -f Dockerfile .

jl-source: jl-clean-source jl-build-source

jl-release: jl-clean-release jl-build-release jl-page

jl-clean-release:
	rm -rf _release "$(jl_folder)/.jupyterlite.doit.db"
    
jl-clean-source:
	rm -rf _source "$(jl_folder)/.jupyterlite.doit.db"

jl-build-release:
	cd $(jl_folder) && \
	$(activate_conda) && \
	jupyter lite build --contents=../release && \
	python kernel2xeus_python.py && \
	python kernel2pyodide.py && \
	cp -rf _output ../_release

jl-build-source:
	cd $(jl_folder) && \
	$(activate_conda) && \
	jupyter lite build --contents=../source && \
	python kernel2xeus_python.py && \
	python kernel2pyodide.py && \
	cp -rf _output ../_source
    
jl-page:
	cd release && \
	$(activate_conda) && \
	ghp-import -np ../_release

env:
	conda env create -p ${CONDA_DIR}/envs/$(jl_env_name) -f $(jl_env_file)

show:
	echo $(jl_env_name)

clean-env:
	conda remove -n $(jl_env_name) --all

modules := env clean-env show jobe cs1302nb cs1302hub main scipy-10 programming jupyter-interface push manim jl jl-clean jl-build jl-page release

.PHONY: $(modules) jupyter-interface programming squash math test.% push.% image.%