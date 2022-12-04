ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

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

### code-server ###
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    curl \
    && \
    wget -q https://code-server.dev/install.sh -O /tmp/install.sh && \
    sh /tmp/install.sh --version 4.5.1 && \
    code-server --extensions-dir /usr/lib/code-server/lib/vscode/extensions --install-extension ms-python.python && \
    fix-permissions "${HOME}" && \
    rm -rf ~/.cache/code-server/ && \
    rm -rf /tmp/install.sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Hongkong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# fix https://github.com/jupyter/docker-stacks/issues/815
RUN cat /etc/skel/.bashrc >> /etc/bash.bashrc

USER ${NB_UID}


RUN mamba install --quiet --yes \
    'websockify=0.10.*' \
    'jupyter-vscode-proxy=0.1.*' \
    'ipydrawio=1.2.*' \
    'ipydrawio-export=1.2.*' \
    'ipydrawio-mathjax=1.2.*' \
    'jupyter-offlinenotebook=0.2.*' \
    'jupyterlab-system-monitor=0.8.*' \
    'jupyterlab-spellchecker=0.7.*' \
    'jupytext=1.13.*' \
    'jupyterlab-git=0.37.*' \
    'nbgitpuller=1.1.*' \
    'retrolab=0.3.*' \
    && \
    pip install --quiet --no-cache-dir \
    'jupyter-desktop-server==0.1.*' \
    'jupyterlab_sublime==0.4.*' \
    'jupyterlab_filesystem_access==0.5.*' \
    # 'jupyterlab-citation-manager==0.3.*' \
    'jupyter-www-proxy' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"


# Jupyter-book
RUN mamba install --quiet --yes \
    'jupyter-book=0.12.*' \
    'myst-nb==0.13.*' \
    && \
    pip install --quiet --no-cache-dir \
    'sphinx-proof==0.1.*' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

COPY --chown=${NB_USER}:${NB_GID} jupyter-interface/condarc "${CONDA_DIR}/.condarc"

# USER ${NB_USER}

# Remote desktop customization
COPY --chown=${NB_USER}:${NB_GID} jupyter-interface/jupyter_desktop_init.py /tmp/
RUN mv /tmp/jupyter_desktop_init.py "$(pip show jupyter-desktop-server | grep Location | awk '{print $2}')/jupyter_desktop/__init__.py"

WORKDIR "${HOME}"

CMD ["start-notebook.sh", "--LabApp.collaborative=True"]