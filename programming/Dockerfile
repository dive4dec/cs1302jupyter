ARG BASE_CONTAINER=jupyter-interface

FROM ${BASE_CONTAINER}

USER root

# Programming languages backends
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    # C, C++
    build-essential \
    unzip \
    # python
    thonny \
    # python3-dev \
    gdb \
    fpc-source \
    # SQL
    sqlite3 \
    # itikz
    pdf2svg \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

USER ${NB_USER}

# Programming languages frontends
RUN npm \
    # Javascript and Typescript
    install -g tslab && \
    tslab install --sys-prefix \
    && \
    mamba install --quiet --yes \
    'pandas=2.0.*' \
    'matplotlib-base=3.7.*' \
    'graphviz=8.1.*' \
    # 'xeus-python' \
    # C, C++
    'xeus-cling=0.15.*' \
    # LaTeX
    'tectonic=0.14.*' \
    'texlab=5.7.*' \
    'chktex=1.7.*' \
    # Java
    'openjdk=20.0.*' \
    && \
    npm install -g \
    bash-language-server \
    vscode-css-languageserver-bin \
    dockerfile-language-server-nodejs \
    vscode-html-languageserver-bin \
    javascript-typescript-langserver \
    vscode-json-languageserver-bin \
    yaml-language-server \
    && \
    pip install --quiet --no-cache-dir \
    'itikz==0.1.*' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" && \
    # Java kernel
    wget 'https://github.com/SpencerPark/IJava/releases/download/v1.3.0/ijava-1.3.0.zip' \
    -O /tmp/ijava.zip && \
    unzip /tmp/ijava.zip -d /tmp/ijava && \
    python /tmp/ijava/install.py --sys-prefix && \
    rm -rf /tmp/ijava

# For cs1302
RUN mamba install --quiet --yes \
    'manim=0.17.*' \
    'pandas=2.0.*' \
    'matplotlib-base=3.7.*' \
    'sympy=1.*' \
    && \
    pip install --quiet --no-cache-dir \
    'divewidgets' \
    'jupyterlab-myst==2.0.*' \
    'divemathjax3' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# Nbgrader
RUN pip install --quiet --no-cache-dir \
    'nbgrader>=v0.9.0a0' && \
    fix-permissions "${CONDA_DIR}"

RUN pip install --quiet --no-cache-dir \
    'jupyterlab_theme_solarized_dark' \
    'jupyterlab-night' \
    'jupyterlab_theme_solarized_dark' \
    'theme-darcula' && \
    fix-permissions "${CONDA_DIR}"


RUN mkdir -p ${CONDA_DIR}/srv/exchange && chmod ugo+rw $_

RUN jupyter server extension disable --sys-prefix nbgrader.server_extensions.formgrader

COPY --chown=${NB_USER}:${NB_GID} nbgrader_config.py ${CONDA_DIR}/etc/jupyter/nbgrader_config.py

