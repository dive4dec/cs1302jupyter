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

# cs1302inb: scipy-10
# 	base=scipy-10; i=0; \
# 	for module in jupyter-interface programming dev cds; \
# 	do \
# 	stage="cs1302inb$$((++i))_$$module"; \
# 	docker build --build-arg BASE_CONTAINER="$$base" \
# 		-t "$$stage" -f "$$module/Dockerfile" .; \
# 	base="$$stage"; \
# 	done; \
# 	docker tag "$$stage" cs1302inb
# 	docker run --rm -it  -p 8888:8888/tcp cs1302inb

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
		-t "base-notebook-10" docker-stacks/base-notebook
	docker build \
		--build-arg BASE_CONTAINER="base-notebook-10" \
		-t "minimal-notebook-10" docker-stacks/minimal-notebook
	docker build \
		--build-arg BASE_CONTAINER="minimal-notebook-10" \
		-t "scipy-10" docker-stacks/scipy-notebook

jl: jl-clean jl-build jl-page

jl-clean:
	rm -rf jupyterlite/_output .jupyterlite.doit.db

jl-build:
	# run jlite twice to get wtc setup
	cd jupyterlite && \
	$(activate_conda) && \
	jupyter lite build --contents=../release && jupyter lite build --contents=../release && \
	python kernel2xeus_python.py _output/files/README.ipynb && \
    python kernel2pyodide.py _output/files/Lab0/main.ipynb _output/files/Lab1/main.ipynb _output/files/Lab2/main.ipynb _output/files/Lab3a/main.ipynb _output/files/Lab3b/main.ipynb _output/files/Lab4/main.ipynb _output/files/Lab5/main.ipynb _output/files/Lab6/main.ipynb _output/files/Lab7/main.ipynb _output/files/Lab8/main.ipynb _output/files/Lab9/main.ipynb _output/files/Lecture1/Introduction\ to\ Computer\ Programming.ipynb _output/files/Lecture2/Values\ and\ Variables.ipynb _output/files/Lecture2/Expressions\ and\ Arithmetic.ipynb _output/files/Lecture3/Conditional\ Execution.ipynb _output/files/Lecture3/Iteration.ipynb _output/files/Lecture4/Using\ Functions.ipynb _output/files/Lecture4/Writing\ Functions.ipynb _output/files/Lecture5/Objects.ipynb _output/files/Lecture6/Generator.ipynb _output/files/Lecture6/Decorator.ipynb _output/files/Lecture7/Sequence\ Types.ipynb _output/files/Lecture7/Operations\ on\ Sequences.ipynb _output/files/Lecture8/Dictionaries\ and\ Sets.ipynb _output/files/Lecture9/Monte\ Carlo\ Simulation\ and\ Linear\ Algebra.ipynb _output/files/LectureX/Review.ipynb

jl-page:
	cd release && \
	$(activate_conda) && \
	ghp-import -np ../jupyterlite/_output

release:
	bash source/release.sh

modules := jobe cs1302nb cs1302hub main scipy-10 programming jupyter-interface push manim jl jl-clean jl-build jl-page release

.PHONY: $(modules)