ARG BASE_CONTAINER=jupyter/minimal-notebook

FROM ${BASE_CONTAINER}

USER root

# Programming languages backends
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    # C, C++
    build-essential \
    # java
    # default-jdk \
    openjdk-19-jdk \
    openjdk-19-jre \
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
