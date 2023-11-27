#!/bin/sh

# Adapted from https://github.com/ccha23/goemaxima/blob/master/buildscript.sh
# ---
# This script build SBCL and Maxima from source.
# It also compiles maxima_fork.c.

set -e

cd /tmp/quicklisp && curl -JOL https://beta.quicklisp.org/quicklisp.lisp
sbcl --non-interactive --load "/tmp/quicklisp/quicklisp.lisp" \
    --eval '(quicklisp-quickstart:install :path "/opt/quicklisp/ql")'
cd /tmp
git clone https://github.com/dive4dec/maxima-jupyter.git
cd maxima-jupyter
# perl -pi -e 's/"\\\\tag{\$~A\$}"/""/g' src/overrides.lisp && \
maxima --batch-string="load(\"load-maxima-jupyter.lisp\");jupyter_system_install(true, \"pkg/\");"
perl -pi -e 's`/usr/local`/opt/conda`g' pkg/usr/local/share/jupyter/kernels/maxima/kernel.json
mv pkg/usr/local/share/jupyter/kernels/maxima ${CONDA_DIR}/share/jupyter/kernels/
mv pkg/usr/local/share/maxima-jupyter ${CONDA_DIR}/share/

maxima --very-quiet --preload-lisp=/opt/conda/share/maxima-jupyter/bundle.lisp \
    --preload-lisp=/opt/conda/share/maxima-jupyter/local-projects/maxima-jupyter/load-maxima-jupyter.lisp \
    --batch-string='jupyter_kernel_start("examples/MaximaJupyterExample.ipynb")$'

fix-permissions "/opt/quicklisp"