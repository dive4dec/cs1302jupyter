ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

RUN apt-get update --yes && \
    apt-get install --no-install-recommends -y \
        libcairo2-dev \
        libffi-dev \
        libpango1.0-dev \
        freeglut3-dev \
        dvisvgm \
        && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

USER ${NB_USER}

RUN pip install --quiet --no-cache-dir \
    'manim' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" 