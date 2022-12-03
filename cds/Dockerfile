ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER ${NB_UID}

RUN mamba install --quiet --yes \
    'cdsdashboards-singleuser' \
    'voila' \
    'dash' \
    'streamlit' \
    'rise' \
    && \
    # pip install --quiet --no-cache-dir \
    # git+https://github.com/dive4dec/nbgrader.git && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

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