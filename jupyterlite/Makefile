SHELL:= /bin/bash
activate_conda = source /opt/conda/bin/activate && conda activate jlite

all: clean build page

clean:
	rm -rf _output .jupyterlite.doit.db files/.ipynb_checkpoints

build:
	# run jlite twice to get wtc setup
	$(activate_conda) && \
	jupyter lite build && jupyter lite build && \
	python kernel2xeus_python.py _output/files/main.ipynb && \
    python kernel2pyodide.py _output/files/Lab0/main.ipynb _output/files/Lab1/main.ipynb _output/files/Lab2/main.ipynb _output/files/Lab3a/main.ipynb _output/files/Lab3b/main.ipynb _output/files/Lab4/main.ipynb _output/files/Lab5/main.ipynb _output/files/Lab6/main.ipynb _output/files/Lab7/main.ipynb _output/files/Lab8/main.ipynb _output/files/Lab9/main.ipynb _output/files/Lecture1/Introduction\ to\ Computer\ Programming.ipynb _output/files/Lecture2/Values\ and\ Variables.ipynb _output/files/Lecture2/Expressions\ and\ Arithmetic.ipynb _output/files/Lecture3/Conditional\ Execution.ipynb _output/files/Lecture3/Iteration.ipynb _output/files/Lecture4/Using\ Functions.ipynb _output/files/Lecture4/Writing\ Functions.ipynb _output/files/Lecture5/Objects.ipynb _output/files/Lecture6/Generator.ipynb _output/files/Lecture6/Decorator.ipynb _output/files/Lecture7/Sequence\ Types.ipynb _output/files/Lecture7/Operations\ on\ Sequences.ipynb _output/files/Lecture8/Dictionaries\ and\ Sets.ipynb _output/files/Lecture9/Monte\ Carlo\ Simulation\ and\ Linear\ Algebra.ipynb _output/files/LectureX/Review.ipynb

page:
	$(activate_conda) && \
	ghp-import -np _output


modules := all activate deactivate build page

.PHONY: $(modules)