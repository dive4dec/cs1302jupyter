ARG ROOT_CONTAINER=ubuntu:22.04

FROM $ROOT_CONTAINER as foundation

ARG NB_USER="jovyan"
ARG NB_UID="1000"
ARG NB_GID="100"

# Configure environment
ENV CONDA_DIR=/opt/conda \
    SHELL=/bin/bash \
    NB_USER="${NB_USER}" \
    NB_UID=${NB_UID} \
    NB_GID=${NB_GID} \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8
ENV PATH="${CONDA_DIR}/bin:${PATH}" \
    HOME="/home/${NB_USER}"

# Fix: https://github.com/hadolint/hadolint/wiki/DL4006
# Fix: https://github.com/koalaman/shellcheck/wiki/SC3014
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

USER root

# Install all OS dependencies for notebook server that starts but lacks all
# features (e.g., download as all possible file formats)
ENV DEBIAN_FRONTEND noninteractive

FROM foundation as base

RUN apt-get update --yes && \
    # - apt-get upgrade is run to patch known vulnerabilities in apt-get packages as
    #   the ubuntu base image is rebuilt too seldom sometimes (less than once a month)
    apt-get upgrade --yes && \
    apt-get install --yes --no-install-recommends \
    # - bzip2 is necessary to extract the micromamba executable.
    bzip2 \
    ca-certificates \
    locales \
    sudo \
    # - tini is installed as a helpful container entrypoint that reaps zombie
    #   processes and such of the actual executable we want to start, see
    #   https://github.com/krallin/tini#why-tini for details.
    tini \
    wget \
    less \
    curl \
    && \
    # apt-get clean && rm -rf /var/lib/apt/lists/* && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen

# Configure environment
ENV CONDA_DIR=/opt/conda \
    SHELL=/bin/bash \
    NB_USER="${NB_USER}" \
    NB_UID=${NB_UID} \
    NB_GID=${NB_GID} \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8
ENV PATH="${CONDA_DIR}/bin:${PATH}" \
    HOME="/home/${NB_USER}"

# Copy a script that we will use to correct permissions after running certain commands
COPY fix-permissions /usr/local/bin/fix-permissions
RUN chmod a+rx /usr/local/bin/fix-permissions

# Enable prompt color in the skeleton .bashrc before creating the default NB_USER
# hadolint ignore=SC2016
RUN sed -i 's/^#force_color_prompt=yes/force_color_prompt=yes/' /etc/skel/.bashrc && \
   # Add call to conda init script see https://stackoverflow.com/a/58081608/4413446
   echo 'eval "$(command conda shell.bash hook 2> /dev/null)"' >> /etc/skel/.bashrc

# Create NB_USER with name jovyan user with UID=1000 and in the 'users' group
# and make sure these dirs are writable by the `users` group.
RUN echo "auth requisite pam_deny.so" >> /etc/pam.d/su && \
    sed -i.bak -e 's/^%admin/#%admin/' /etc/sudoers && \
    sed -i.bak -e 's/^%sudo/#%sudo/' /etc/sudoers && \
    useradd -l -m -s /bin/bash -N -u "${NB_UID}" "${NB_USER}" && \
    mkdir -p "${CONDA_DIR}" && \
    chown "${NB_USER}:${NB_GID}" "${CONDA_DIR}" && \
    chmod g+w /etc/passwd && \
    fix-permissions "${HOME}" && \
    fix-permissions "${CONDA_DIR}"

USER ${NB_UID}

# Pin python version here, or set it to "default"
ARG PYTHON_VERSION=3.11

# Setup work directory for backward-compatibility
RUN mkdir "/home/${NB_USER}/work" && \
    fix-permissions "/home/${NB_USER}"

# Download and install Micromamba, and initialize Conda prefix.
#   <https://github.com/mamba-org/mamba#micromamba>
#   Similar projects using Micromamba:
#     - Micromamba-Docker: <https://github.com/mamba-org/micromamba-docker>
#     - repo2docker: <https://github.com/jupyterhub/repo2docker>
# Install Python, Mamba and jupyter_core
# Cleanup temporary files and remove Micromamba
# Correct permissions
# Do all this in a single RUN command to avoid duplicating all of the
# files across image layers when the permissions change
COPY --chown="${NB_UID}:${NB_GID}" initial-condarc "${CONDA_DIR}/.condarc"
WORKDIR /tmp
RUN set -x && \
    arch=$(uname -m) && \
    if [ "${arch}" = "x86_64" ]; then \
        # Should be simpler, see <https://github.com/mamba-org/mamba/issues/1437>
        arch="64"; \
    fi &&  \
    wget --progress=dot:giga -O /tmp/micromamba.tar.bz2 \
        "https://micromamba.snakepit.net/api/micromamba/linux-${arch}/latest" && \
    tar -xvjf /tmp/micromamba.tar.bz2 --strip-components=1 bin/micromamba && \
    rm /tmp/micromamba.tar.bz2 && \
    PYTHON_SPECIFIER="python=${PYTHON_VERSION}" && \
    if [[ "${PYTHON_VERSION}" == "default" ]]; then PYTHON_SPECIFIER="python"; fi && \
    # Install the packages
    ./micromamba install \
        --root-prefix="${CONDA_DIR}" \
        --prefix="${CONDA_DIR}" \
        --yes \
        "${PYTHON_SPECIFIER}" \
        'mamba' \
        'jupyter_core' && \
    rm micromamba && \
    # Pin major.minor version of python
    mamba list python | grep '^python ' | tr -s ' ' | cut -d ' ' -f 1,2 >> "${CONDA_DIR}/conda-meta/pinned" && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" && \
    fix-permissions "/home/${NB_USER}"

# ------------------------------------
# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

USER root

# Install all OS dependencies for notebook server that starts but lacks all
# features (e.g., download as all possible file formats)
RUN \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    fonts-liberation \
    # - pandoc is used to convert notebooks to html files
    #   it's not present in aarch64 ubuntu image, so we install it here
    pandoc \
    # - run-one - a wrapper script that runs no more
    #   than one unique  instance  of  some  command with a unique set of arguments,
    #   we use `run-one-constantly` to support `RESTARTABLE` option
    run-one 
    # && \
    # apt-get clean && rm -rf /var/lib/apt/lists/*

# Install all OS dependencies for fully functional notebook server
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    # Common useful utilities
    git \
    nano-tiny \
    tzdata \
    unzip \
    vim-tiny \
    # git-over-ssh
    openssh-client \
    # nbconvert dependencies
    # https://nbconvert.readthedocs.io/en/latest/install.html#installing-tex
    texlive-xetex \
    texlive-fonts-recommended \
    texlive-plain-generic \
    # Enable clipboard on Linux host systems
    xclip
    # apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Jupyter Notebook, Lab, and Hub
# Generate a notebook server config
# Cleanup temporary files
# Correct permissions
# Do all this in a single RUN command to avoid duplicating all of the
# files across image layers when the permissions change
WORKDIR /tmp

USER ${NB_UID}

RUN mamba install --yes \
    'nodejs<19' \
    'notebook==7.0.6' \
    'jupyterlab==4.0.9' \
    'jupyterhub==4.0.2' \
    && \
    jupyter notebook --generate-config && \
    # mamba clean --all -f -y && \
    # npm cache clean --force && \
    # jupyter lab clean && \
    rm -rf "/home/${NB_USER}/.cache/yarn" && \
    fix-permissions "${CONDA_DIR}" && \
    fix-permissions "/home/${NB_USER}"

USER root

### code-server ###
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    curl \
    && \
    wget -q https://code-server.dev/install.sh -O /tmp/install.sh && \
    sh /tmp/install.sh --version 4.20.0
    #  && \
    # apt-get clean && rm -rf /var/lib/apt/lists/*

# Code extensions
RUN for ext in \
        ms-python.python \
        ms-toolsai.jupyter \
        ms-toolsai.vscode-jupyter-powertoys \
        streetsidesoftware.code-spell-checker \
        sugatoray.vscode-git-extension-pack \
        Kelvin.vscode-sshfs \
        hediet.vscode-drawio \
        genieai.chatgpt-vscode \
        ; do \
        code-server --extensions-dir /usr/lib/code-server/lib/vscode/extensions --install-extension "$ext"; \
    done && \
    fix-permissions "${HOME}" && \
    fix-permissions /usr/lib/code-server/ && \
    rm -rf ~/.cache/code-server/ && \
    rm -rf /tmp/install.sh

ENV JUPYTER_PORT=8888
EXPOSE $JUPYTER_PORT

ENV TZ=Hongkong

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# fix https://github.com/jupyter/docker-stacks/issues/815
RUN cat /etc/skel/.bashrc >> /etc/bash.bashrc



USER ${NB_UID}

RUN mamba install --quiet --yes \
    # 'code-server=4.17.1' \
    'websockify=0.11.*' \
    'jupyter-vscode-proxy=0.5' \
    'jupytext=1.16.*' \
    'nbgitpuller=1.2.*' \
    'black=23.12.*' \
    'jupyterlab_code_formatter=2.2.*' \
    'python-lsp-server=1.9.*' \
    # 'openai=0.28.*' \
    # 'jupyter-ai=2.2.*' \
    && \
    pip install --quiet --no-cache-dir \
    'jupyterlab-git==0.50.*' \    
    'jupyterlab_filesystem_access==0.5.*' \
    'jupyter-www-proxy' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

USER root

# Programming languages backends
RUN \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    # C, C++
    build-essential \
    unzip \
    # python
    # thonny \
    # python3-dev \
    gdb \
    fpc-source \
    # SQL
    sqlite3 \
    pdf2svg
    # && \
    # apt-get clean && rm -rf /var/lib/apt/lists/*

# JAVA
RUN \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    default-jdk default-jre

USER ${NB_USER}

# Programming languages frontends
RUN npm \
    # Javascript and Typescript
    install -g tslab && \
    tslab install --sys-prefix \
    && \
    mamba install --quiet --yes \
    'graphviz=8.1.*' \
    # 'xeus-python' \
    # C, C++
    'xeus-cling=0.15.*' \
    # # LaTeX
    # 'tectonic=0.14.*' \
    # 'texlab=5.7.*' \
    # 'chktex=1.7.*' \
    # # Java
    # 'openjdk=20.0.*' \
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
    pip install --quiet \
    # --no-cache-dir \
    'itikz==0.1.*' \
    && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" && \
    # Java kernel
    wget 'https://github.com/SpencerPark/IJava/releases/download/v1.3.0/ijava-1.3.0.zip' \
    -O /tmp/ijava.zip && \
    unzip /tmp/ijava.zip -d /tmp/ijava && \
    python /tmp/ijava/install.py --sys-prefix && \
    rm -rf /tmp/ijava

RUN mamba install --quiet --yes \
    'manim=0.18.*' \
    'manimpango=0.5.*' \
    'pandas=2.1.*' \
    'matplotlib-base=3.8.*' \
    'ipympl=0.9.*' \
    'sympy=1.*' \
    'jupyterlite=0.2.*' \
    && \
    pip install --quiet --no-cache-dir \
    'divewidgets' \
    'jupyterlab-myst==2.1.*' \
    && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# Nbgrader
RUN pip install --quiet --no-cache-dir \
    'nbgrader==0.9.*' && \
    # git+https://github.com/dive4dec/nbgrader.git && \
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

# Slideshow
RUN pip install --quiet --no-cache-dir \
    # not compatible with jupyterlab-myst
    # 'jupyterlab_rise==0.42.*' \
    'jupyterlab-deck==0.2.0' && \
    fix-permissions "${CONDA_DIR}"

# Disable news and update
# See https://jupyterlab.readthedocs.io/en/stable/user/announcements.html
RUN jupyter labextension disable "@jupyterlab/apputils-extension:announcements"

# MyST Markdown CLI
RUN npm install -g mystmd

# # Collaboration
# RUN mamba install --quiet --yes \
#     'jupyter-collaboration=1.1.*' \
#     && \
#     # mamba clean --all -f -y && \
#     fix-permissions "${CONDA_DIR}"

# latex dependencies for mystmd
USER root

RUN \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    latexmk \
    biber \
    lmodern \
    && \
    paperconfig -p a4 \
    # && \
    # tlmgr option repository http://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2021/tlnet-final \
    # && \
    # apt-get clean && rm -rf /var/lib/apt/lists/*
    ;

### Desktop ###
RUN \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    emacs \    
    thonny \
    dbus-x11 \
    libgl1-mesa-glx \
    xfce4 \
    xfce4-panel \
    xfce4-session \
    xfce4-settings \
    xorg \
    xubuntu-icon-theme

# Xpra
RUN \
    wget -O "/usr/share/keyrings/xpra.asc" https://xpra.org/xpra.asc && \
    wget -O "/etc/apt/sources.list.d/xpra.sources" https://raw.githubusercontent.com/Xpra-org/xpra/master/packaging/repos/jammy/xpra.sources && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    xpra \
    xpra-x11 \
    xpra-html5 \
    x11-utils \
    xfonts-base \
    xvfb \
    # python3-websockify python3-dbus python3-paramiko python3-pyinotify python3-netifaces \
    && \
    /usr/bin/pip3 install --quiet --no-cache-dir \
    'pyxdg==0.28'

# fix https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=908156
RUN mkdir -p /run/xpra && \
    mkdir -p /run/user/${NB_UID}/xpra && \
    # fix permission for NB_USER to start xpra and create sockets under /run
    chmod -R 700 /run/user && \
    chmod -R 775 /run/xpra && \
    chown -R ${NB_USER}:${NB_GID} /run

USER ${NB_USER}

RUN pip install --quiet --no-cache-dir \
    'jupyter-remote-desktop-proxy==1.1.*' \
    'jupyter-xprahtml5-proxy==0.3.*' \
    && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# AI
RUN pip install --quiet --no-cache-dir \
    'jupyter_ai' \
    'openai' \
    'jupyter-resource-usage==1.0.*' \
    && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# ----------------------------------------------------------

### Tensorflow ###
# minor issues: 
# https://stackoverflow.com/questions/44232898/memoryerror-in-tensorflow-and-successful-numa-node-read-from-sysfs-had-negativ
# tested with:
# https://docs.vmware.com/en/VMware-vSphere-Bitfusion/4.0/Example-Guide/GUID-8F6BF9A8-DC1A-4ACD-A2FF-C9CD0B50A9DC.html

RUN pip install --quiet \
    # --no-cache-dir \
    'tensorflow==2.15.*' \
    'tensorflowjs==4.15.*' \
    # downgraded protobuf
    # 'tensorflow-datasets==4.9.*' \
    'tensorflow-addons==0.23.*' \
    && \
    fix-permissions "${CONDA_DIR}"

### Pytorch ###
RUN mamba install --quiet --yes \
    'pytorch=2.1.*' \
    'torchvision=0.16.*' \
    'torchaudio=2.1.*' \
    'pytorch-cuda=11.8' \
    -c pytorch -c nvidia \
    && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

RUN mamba install --quiet --yes \
    altair \
    bokeh \
    bottleneck \
    blas \
    cython \
    h5py \
    matplotlib-base \
    numba \
    patsy \
    pytables \
    seaborn \
    sqlalchemy \
    statsmodels \
    xlrd \
    && \
    pip install --quiet --no-cache-dir \
    'nvitop' \
    'gpustat' \
    'jdc' \
    'jupyterlab-tensorboard-pro' && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"



# https://github.com/Kaggle/docker-python/issues/1267
RUN mamba install --quiet --yes \
    openssh && \
    # mamba install --quiet --yes -c intel intel-extension-for-pytorch && \
    # mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

USER root

# Maxima
COPY maxima/ /tmp/maxima/
RUN bash /tmp/maxima/buildscript.sh

COPY --chown=${NB_USER}:${NB_GID} quicklisp /tmp/quicklisp
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends libzmq3-dev && \
    mkdir -p /opt/quicklisp && chown -R ${NB_USER} $_ && fix-permissions $_ && \
    mv /tmp/quicklisp/sbclrc /etc/
    
USER ${NB_USER}
RUN bash /tmp/quicklisp/buildscript.sh

# conflict with jupyter-ai due to protobuf downgrade
# Also read buffer timeout
#
# RUN apt-get update --yes && \
#     apt-get install --yes --no-install-recommends \
#     gnupg && \
#     wget -O- https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB | gpg --dearmor | tee /usr/share/keyrings/oneapi-archive-keyring.gpg > /dev/null && \
#     echo "deb [signed-by=/usr/share/keyrings/oneapi-archive-keyring.gpg] https://apt.repos.intel.com/oneapi all main" | tee /etc/apt/sources.list.d/oneAPI.list && \
#     apt-get update --yes && \
#     apt-get install --yes --no-install-recommends \
#     intel-basekit

# WEKA

USER root

### Weka and python-weka-wrapper ###
RUN wget -q -O /tmp/weka.deb 'https://www.cs.waikato.ac.nz/~ml/weka/snapshots/stable-3-8.deb' && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    # java
    # openjdk-11-jre \
    # openjdk-11-jdk \
    # python3-dev \
    # imagemagick \
    /tmp/weka.deb \
    && \
    echo 'alias weka="/usr/bin/weka-stable-gui"' >> /etc/bash.bashrc && \
    rm /tmp/weka.deb
    # && \
    # apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update --yes && \
    # wget -q https://download1.rstudio.org/electron/jammy/amd64/rstudio-2023.12.0-369-amd64.deb -O /tmp/rstudio.deb && \
    apt-get install --yes --no-install-recommends \
    'r-base'
    # /tmp/rstudio.deb && \
    # apt-get clean && rm -rf /var/lib/apt/lists/* && \
    # rm /tmp/rstudio.deb

RUN R -e "install.packages('IRkernel', dependencies=TRUE, repos='http://cran.rstudio.com/')" && \
    R -e "install.packages('ClusterR', dependencies=TRUE, repos='http://cran.rstudio.com/')" && \
    R -e "install.packages('cluster', dependencies=TRUE, repos='http://cran.rstudio.com/')" && \
    R -e "install.packages('dbscan', dependencies=TRUE, repos='http://cran.rstudio.com/')"

USER ${NB_USER}

# R
RUN R -e "IRkernel::installspec(sys_prefix = TRUE)"


# ML packages
# RUN export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64" && \
#     mamba install --quiet --yes \
#     'biopython=1.*' \
#     && \
#     pip install --quiet --no-cache-dir \
#     'python-javabridge==4.0.*' \
#     'python-weka-wrapper3==0.2.*' \
#     # 'pygraphviz==1.9' \
#     # 'dit==1.2.*' \
#     && \
#     mamba clean --all -f -y && \
#     fix-permissions "${CONDA_DIR}"

# ----------------------------------------------------------
# Cleanup

USER root

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

USER ${NB_UID}

RUN npm cache clean --force && \
    jupyter lab clean && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" && \
    fix-permissions "/home/${NB_USER}"

# ----------------------------------------------------------

FROM foundation as prod

COPY --from=base /etc/ /etc/
COPY --from=base /usr/ /usr/
COPY --from=base /var/ /var/
COPY --from=base /home/ /home/
COPY --from=base /opt/ /opt/

USER root

# Configure container startup
ENTRYPOINT ["tini", "-g", "--"]
# Configure container startup
CMD ["start-notebook.sh"]

# Copy local files as late as possible to avoid cache busting
COPY start.sh /usr/local/bin/
# Copy local files as late as possible to avoid cache busting
COPY start-notebook.sh start-singleuser.sh grader_setup /usr/local/bin/
# Currently need to have both jupyter_notebook_config and jupyter_server_config to support classic and lab
COPY jupyter_server_config.py docker_healthcheck.py /etc/jupyter/


# customize xpra https://xpra.org/manual.html
COPY --chown=${NB_USER}:${NB_GID} jupyter_xprahtml5_proxy_init.py /tmp/
RUN mv /tmp/jupyter_xprahtml5_proxy_init.py "$(pip show jupyter-xprahtml5-proxy | grep Location | awk '{print $2}')/jupyter_xprahtml5_proxy/__init__.py"

ENV TF_CPP_MIN_LOG_LEVEL=2

ENV XLA_FLAGS=--xla_gpu_cuda_data_dir=${CONDA_DIR}/lib
ENV LD_LIBRARY_PATH="/opt/conda/lib/:${CONDA_DIR}/lib/python3.11/site-packages/nvidia/cudnn/lib/"

# https://github.com/tensorflow/tensorboard/pull/3674
ENV TENSORBOARD_PROXY_URL="/proxy/%PORT%/"

ENV NBGRADER_UID=2000 \
    NBGRADER_USER=nbgrader

# Create NBGRADER_USER with name nbgrader, UID=2000 and in the 'users' group
# On jupyterhub, this user should be the owner of the course root and exchange folder for nbgrader.
RUN useradd -l -M -s /bin/bash -N -u "${NBGRADER_UID}" "${NBGRADER_USER}"


# Switch back to jovyan to avoid accidental container runs as root
# USER ${NB_UID}

WORKDIR "${HOME}"


# ----------------------------------------------------------

FROM prod as collab

USER ${NB_USER}

# Collaboration
RUN mamba install --quiet --yes \
    'jupyter-collaboration=1.2.*' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

FROM prod as default

USER ${NB_USER}
