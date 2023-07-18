ARG BASE_CONTAINER=jupyter/minimal-notebook

FROM ${BASE_CONTAINER}

USER root

### code-server ###
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    curl \
    && \
    wget -q https://code-server.dev/install.sh -O /tmp/install.sh && \
    sh /tmp/install.sh --version 4.14.1 && \
    code-server --extensions-dir /usr/lib/code-server/lib/vscode/extensions --install-extension ms-python.python && \
    fix-permissions "${HOME}" && \
    rm -rf ~/.cache/code-server/ && \
    rm -rf /tmp/install.sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Hongkong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# fix https://github.com/jupyter/docker-stacks/issues/815
RUN cat /etc/skel/.bashrc >> /etc/bash.bashrc

### Desktop ###
RUN wget -q "https://sourceforge.net/projects/turbovnc/files/3.0/turbovnc_3.0_amd64.deb/download" \
    -O /tmp/turbovnc_3.0_amd64.deb && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    /tmp/turbovnc_3.0_amd64.deb \
    dbus-x11 \
    x11-utils \
    xfonts-base \
    xvfb \
    xserver-xorg-video-dummy \
    gnupg \
    xorg \
    xfce4 \
    xfce4-panel \
    xfce4-session \
    xfce4-settings \
    xfce4-terminal \
    pipenv \
    python3-websockify python3-dbus python3-paramiko python3-pyinotify python3-netifaces \
    elementary-xfce-icon-theme \
    emacs \
    firefox \
    && \
    apt-get remove -y -q light-locker libllvm11 && \
    rm /tmp/turbovnc_3.0_amd64.deb && \
    ln -s /opt/TurboVNC/bin/* /usr/local/bin/ && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

USER ${NB_UID}

RUN mamba install --quiet --yes \
    'websockify=0.11.*' \
    'jupyter-vscode-proxy=0.2' \
    'jupyterlab-git=0.41.*' \
    'jupytext=1.14.*' \
    'nbgitpuller=1.1.*' \
    'black=23.3.*' \
    'jupyterlab_code_formatter=2.2.*' \
    'python-lsp-server=1.7.*' \
    && \
    pip install --quiet --no-cache-dir \
    'jupyter-remote-desktop-proxy==1.0.*' \
    'jupyter_collaboration==1.0.*' \
    'jupyterlab_filesystem_access==0.5.*' \
    'jupyter-www-proxy' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

COPY --chown=${NB_USER}:${NB_GID} jupyter-interface/condarc "${CONDA_DIR}/.condarc"