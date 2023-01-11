SHELL:= /bin/bash
activate_conda = source /opt/conda/bin/activate && conda activate jlite
# Registry for docker images
REGISTRY=localhost:32000
# REGISTRY=chungc
# version for tagging image for deployment
VERSION=0.0.2b

push-%:
	docker tag "$*" "${REGISTRY}/$*:${VERSION}"
	docker push "${REGISTRY}/$*:${VERSION}"

# Support different programming languages in addition to python such as
# C++, Java, SQL, javascript, typescript, ...
programming:
	docker build \
		-t "programming" -f programming/Dockerfile .
	docker run --rm -it  -p 8888:8888/tcp -v "$$(pwd)/programming/examples":/home/jovyan/work programming

# Support different interfaces such as
# VSCode, remote desktop, retrolab, ...
jupyter-interface:
	docker build --pull \
		-t "jupyter-interface" -f jupyter-interface/Dockerfile .
	docker run --rm -it  -p 8888:8888/tcp -v "$$(pwd)/jupyter-interface/examples":/home/jovyan/work jupyter-interface

# Tools for mathematics
math:
	docker build --pull \
		-t "math" -f math/Dockerfile .
	docker run --rm -it  -p 8888:8888/tcp math

manim:
	docker build --pull \
		-t "manim" -f manim/Dockerfile .
	docker run --rm -it  -p 8888:8888/tcp manim

cs1302nb: scipy-10
	base=scipy-10; i=0; \
	for module in jupyter-interface programming manim dev cds; \
	do \
	stage="cs1302nb$$((++i))_$$module"; \
	docker build --build-arg BASE_CONTAINER="$$base" \
		-t "$$stage" -f "$$module/Dockerfile" .; \
	base="$$stage"; \
	done; \
	docker tag "$$stage" cs1302nb
	docker run --rm -it  -p 8888:8888/tcp cs1302nb

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

scipy-10:
	docker build \
		--build-arg PYTHON_VERSION="3.10" \
		-t "docker-stacks-foundation" docker-stacks/docker-stacks-foundation
	docker build \
		--build-arg PYTHON_VERSION="3.10" \
		-t "base-notebook-10" docker-stacks/base-notebook
	docker build \
		--build-arg BASE_CONTAINER="base-notebook-10" \
		-t "minimal-notebook-10" docker-stacks/minimal-notebook
	docker build \
		--build-arg BASE_CONTAINER="minimal-notebook-10" \
		-t "scipy-10" docker-stacks/scipy-notebook

jl-source: jl-clean-source jl-build-source

jl-release: jl-clean-release jl-build-release jl-page

jl-clean-release:
	rm -rf _release .jupyterlite.doit.db
    
jl-clean-source:
	rm -rf _source .jupyterlite.doit.db

jl-build-release:
	# run jlite twice to get wtc setup
	cd jupyterlite && \
	$(activate_conda) && \
	jupyter lite build --contents=../release && \
	jupyter lite build --contents=../release && \
	python kernel2xeus_python.py && \
	python kernel2pyodide.py && \
	cp -rf _output ../_release

jl-build-source:
	cd jupyterlite && \
	$(activate_conda) && \
	jupyter lite build --contents=../source && \
	python kernel2xeus_python.py && \
	python kernel2pyodide.py && \
	cp -rf _output ../_source
    
jl-page:
	cd release && \
	$(activate_conda) && \
	ghp-import -np ../_release


modules := jobe cs1302nb cs1302hub main scipy-10 programming jupyter-interface push manim jl jl-clean jl-build jl-page release

.PHONY: $(modules)