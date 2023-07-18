ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

### Math
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    gnupg \
    # Octave
    ghostscript \
    fonts-freefont-otf \
    octave \
    && \
    # Maxima
    # fix personality failure
    echo 'deb http://ppa.launchpad.net/maxima-developers/maxima-nightly/ubuntu jammy main' > /etc/apt/sources.list.d/maxima-developers-ubuntu-maxima-nightly-focal.list && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 269CC6D68C369059 && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    maxima=5.46.0-31~202301151812~ubuntu22.04.1 wxmaxima=23.04.1-27~202307142012~ubuntu22.04.1 \
    libzmq3-dev sbcl cl-quicklisp \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --chown=${NB_UID}:${NB_GID} math/sbclrc /etc/sbclrc

USER ${NB_USER}

# Octave
RUN mamba install --quiet --yes \
    'gnuplot=5.4.*' && \
    pip install --quiet --no-cache-dir 'octave_kernel==0.34.*' && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# Maxima
RUN sbcl --non-interactive --load "/usr/share/common-lisp/source/quicklisp/quicklisp.lisp" \
    --eval '(quicklisp-quickstart:install :path "/tmp/quicklisp")' && \
    git clone https://github.com/dive4dec/maxima-jupyter.git && \
    cd maxima-jupyter && \
    # perl -pi -e 's/"\\\\tag{\$~A\$}"/""/g' src/overrides.lisp && \
    maxima --batch-string="load(\"load-maxima-jupyter.lisp\");jupyter_system_install(true, \"pkg/\");" && \
    perl -pi -e 's`/usr/local`/opt/conda`g' pkg/usr/local/share/jupyter/kernels/maxima/kernel.json && \
    mv pkg/usr/local/share/jupyter/kernels/maxima ${CONDA_DIR}/share/jupyter/kernels/ && \
    mv pkg/usr/local/share/maxima-jupyter ${CONDA_DIR}/share/ && \
    maxima --very-quiet --preload-lisp=/opt/conda/share/maxima-jupyter/bundle.lisp \
        --preload-lisp=/opt/conda/share/maxima-jupyter/local-projects/maxima-jupyter/load-maxima-jupyter.lisp \
        --batch-string='jupyter_kernel_start("examples/MaximaJupyterExample.ipynb")$' && \
    cd .. && \
    rm -rf maxima-jupyter && \
    fix-permissions "/tmp/quicklisp"
