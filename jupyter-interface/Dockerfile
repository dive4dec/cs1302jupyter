ARG BASE_CONTAINER=base-notebook

FROM ${BASE_CONTAINER}

USER root



ENV TZ=Hongkong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# fix https://github.com/jupyter/docker-stacks/issues/815
RUN cat /etc/skel/.bashrc >> /etc/bash.bashrc

USER ${NB_UID}

RUN mamba install --quiet --yes \
    'code-server=4.14.*' \
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
    'jupyterlab_filesystem_access==0.5.*' \
    'jupyter-www-proxy' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# Code extensions
RUN for ext in \
        ms-python.python \
        ms-toolsai.jupyter \
        ms-toolsai.vscode-jupyter-powertoys \
        streetsidesoftware.code-spell-checker; do\
        code-server --install-extension "$ext"; \
    done

USER root
### Desktop ###
RUN \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    dbus-x11 \
    libgl1-mesa-glx \
    xfce4 \
    xfce4-panel \
    xfce4-session \
    xfce4-settings \
    xorg \
    xubuntu-icon-theme \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

USER ${NB_UID}

COPY --chown=${NB_USER}:${NB_GID} condarc "${CONDA_DIR}/.condarc"
