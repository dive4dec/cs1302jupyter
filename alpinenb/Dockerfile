ARG BASE_CONTAINER=frolvlad/alpine-glibc:alpine-3.17

FROM ${BASE_CONTAINER} as foundation

ARG NB_USER="jovyan"
ARG NB_UID="1000"

# Configure environment
ENV CONDA_DIR=/opt/conda \
    SHELL=/bin/bash \
    NB_USER="${NB_USER}" \
    NB_UID=${NB_UID} \
    NB_GID=100 \
    LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    LANGUAGE=C.UTF-8
ENV TZ="Hongkong" \
    PATH="${CONDA_DIR}/bin:${PATH}" \
    HOME="/home/${NB_USER}"

# Copy a script that we will use to correct permissions after running certain commands
COPY fix-permissions /usr/local/bin/fix-permissions

RUN apk add --no-cache bash bash-completion linux-pam \
    # - bzip2 is necessary to extract the micromamba executable.
    bzip2 \
    ca-certificates \
    tzdata \
    sudo \
    git \
    unzip \
    vim \
    openssh-client \
    less \
    xclip \
    curl \
    # - tini is installed as a helpful container entrypoint that reaps zombie
    #   processes and such of the actual executable we want to start, see
    #   https://github.com/krallin/tini#why-tini for details.
    tini \
    wget && \
    # enable color prompt
    ln -sf /etc/profile.d/color_prompt.sh.disabled /etc/profile.d/color_prompt.sh && \
    # Create NB_USER with name jovyan user with UID=1000 and in the 'users' group
    # and make sure these dirs are writable by the `users` group.
    echo "auth requisite pam_deny.so" >> /etc/pam.d/su && \
    sed -i.bak -e 's/^%admin/#%admin/' /etc/sudoers && \
    sed -i.bak -e 's/^%sudo/#%sudo/' /etc/sudoers && \
    adduser -D -h /home/${NB_USER} -s /bin/bash -G users -u "${NB_UID}" "${NB_USER}" && \
    chmod g+w /etc/passwd && \
    mkdir -p "${CONDA_DIR}" && \
    chown "${NB_USER}:${NB_GID}" "${CONDA_DIR}" && \
    chmod a+rx /usr/local/bin/fix-permissions && \
    fix-permissions "${HOME}" && \
    fix-permissions "${CONDA_DIR}"

# Fix: https://github.com/hadolint/hadolint/wiki/DL4006
# Fix: https://github.com/koalaman/shellcheck/wiki/SC3014
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Configure container startup
ENTRYPOINT ["tini", "-g", "--"]

# ---------------------------------------------------------------------------
FROM foundation as conda

# Pin python version here, or set it to "default"
ARG PYTHON_VERSION=3.11


USER ${NB_UID}

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
    fi && \
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
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" && \
    fix-permissions "/home/${NB_USER}"

# Install Jupyter Notebook, Lab, and Hub
# Generate a notebook server config
# Cleanup temporary files
# Correct permissions
# Do all this in a single RUN command to avoid duplicating all of the
# files across image layers when the permissions change
RUN mamba install --yes \
    'notebook' \
    'jupyterhub' \
    'jupyterlab' && \
    jupyter notebook --generate-config && \
    mamba clean --all -f -y && \
    npm cache clean --force && \
    jupyter lab clean && \
    rm -rf "/home/${NB_USER}/.cache/yarn" && \
    fix-permissions "${CONDA_DIR}" && \
    fix-permissions "/home/${NB_USER}"

# Interface
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

RUN mkdir -p ${CONDA_DIR}/srv/exchange && chmod ugo+rw $_

RUN jupyter server extension disable --sys-prefix nbgrader.server_extensions.formgrader

COPY --chown=${NB_USER}:${NB_GID} nbgrader_config.py ${CONDA_DIR}/etc/jupyter/nbgrader_config.py

# Copy local files as late as possible to avoid cache busting
COPY start.sh start-notebook.sh start-singleuser.sh grader_setup /usr/local/bin/
# Currently need to have both jupyter_notebook_config and jupyter_server_config to support classic and lab
COPY jupyter_server_config.py docker_healthcheck.py /etc/jupyter/

FROM foundation as base

COPY --from=conda /opt/conda /opt/conda
COPY --from=conda /usr/local/bin/ /usr/local/bin/
COPY --from=conda /etc/jupyter /etc/jupyter

RUN conda init --system bash

USER ${NB_UID}
WORKDIR ${HOME}

# Configure container startup
CMD ["start-notebook.sh"]

# HEALTHCHECK documentation: https://docs.docker.com/engine/reference/builder/#healthcheck
# This healtcheck works well for `lab`, `notebook`, `nbclassic`, `server` and `retro` jupyter commands
# https://github.com/jupyter/docker-stacks/issues/915#issuecomment-1068528799
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
    CMD /etc/jupyter/docker_healthcheck.py || exit 1

ENV JUPYTER_PORT=8888
EXPOSE $JUPYTER_PORT


# FROM base as test

