ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER ${NB_UID}

RUN pip install --quiet --no-cache-dir \
    'divewidgets' \
    'divemathjax3' \
    'divemarkdownit' \
    'otter-grader' \
    'jupyterlab-deck' \
    && \
    fix-permissions "${CONDA_DIR}"


RUN pip install --quiet --no-cache-dir \
    nbgrader && \    
    # git+https://github.com/dive4dec/nbgrader.git \
    # git+https://github.com/dive4dec/ngshare_exchange.git && \
    fix-permissions "${CONDA_DIR}"

COPY --chown=${NB_USER}:${NB_GID} dev/nbgrader_config ${CONDA_DIR}/etc/jupyter/nbgrader_config.py
COPY --chown=${NB_USER}:${NB_GID} jupyterlite/dep/ /tmp/dep/

RUN conda env create -p ${CONDA_DIR}/envs/jlite -f /tmp/dep/environment.yml && \
    conda clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# RUN pip install --quiet --no-cache-dir -r /tmp/requirements.txt \
#     # 'bqplot' \
#     # 'ipycanvas>=0.9.1' \
#     # 'ipyevents>=2.0.1' \
#     # 'ipyleaflet' \
#     # 'ipympl>=0.8.2' \
#     # 'ipywidgets>=8.0.0,<9' \
#     # 'jupyterlab~=3.4.7' \
#     # 'ipydrawio' \
#     # 'ipydrawio-widgets' \
#     # 'jupyterlab-language-pack-zh-TW' \
#     # 'jupyterlab-language-pack-zh-CN' \
#     # 'ghp-import' \
#     # 'jupyterlab-deck>=0.1.3' \
#     # 'jupyterlite<=0.1.0b14' \
#     # 'jupyterlab_filesystem_access' \
#     # 'jupyterlab-webrtc-docprovider' \
#     # 'dive-jupyterlite-xeus-python' \ 
#     && \
#     fix-permissions "${CONDA_DIR}"


# RUN jupyter nbextension install --symlink --sys-prefix --py nbgrader && \
#     jupyter nbextension enable --sys-prefix --py nbgrader && \
#     jupyter serverextension enable --sys-prefix --py nbgrader  && \
#     jupyter nbextension disable --sys-prefix formgrader/main --section=tree && \
#     jupyter nbextension disable --sys-prefix course_list/main --section=tree && \
#     jupyter serverextension disable --sys-prefix nbgrader.server_extensions.course_list && \
#     fix-permissions "${CONDA_DIR}"

# RUN \
#     #  alias yarn="jlpm" && \
#     pip install --quiet --no-cache-dir \
#     'jupyter-contrib-nbextensions' && \
#     git clone https://github.com/fcollonval/RISE.git /tmp/RISE && \
#     cd /tmp/RISE && \
#     git checkout ft/jlab3 && \
#     # binder/postBuild && \
#     jlpm install && \
#     jlpm build && \
#     pip install . && \
#     jupyter server extension enable rise && \
#     jupyter serverextension enable rise --sys-prefix && \
#     jupyter labextension build && \
#     jupyter nbextension install rise --py --sys-prefix --symlink && \
#     jupyter nbextension enable rise --py --sys-prefix && \
#     jupyter contrib nbextension install --sys-prefix && \
#     fix-permissions "${CONDA_DIR}" && \
#     rm -rf /tmp/RISE

WORKDIR "${HOME}"

CMD ["start-notebook.sh", "--LabApp.collaborative=True"]