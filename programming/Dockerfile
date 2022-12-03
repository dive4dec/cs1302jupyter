ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

# Programming languages backends
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    # C, C++
    build-essential \
    # java
    # default-jdk \
    openjdk-17-jdk \
    openjdk-17-jre \
    # python
    thonny \
    # python3-dev \
    # pascal
    fp-compiler \
    lazarus \
    gdb \
    fpc-source \
    # SQL
    sqlite3 \
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
    'graphviz=2.50.*' \
    'xeus-python=0.13.*' \
    # C, C++
    'xeus-cling=0.13.*' \
    # SQL
    'xeus-sql=0.1.*' \
    'soci-sqlite=4.0.*' \
    'xwidgets=0.26.*' \
    # LaTeX
    'tectonic=0.9.*' \
    'texlab=4.2.*' \
    'chktex=1.7.*' \
    # Formatters and Servers
    'black=22.*' \
    'jupyterlab_code_formatter=1.4.*' \
    'jupyterlab-lsp=3.10.*' \
    'python-lsp-server=1.4.*' \
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
    'jupyterlab_sublime==0.4.*' \
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
