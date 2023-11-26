SHELL=/bin/bash

# Customizations:
# Version for tagging docker images
VERSION=0.1.3

# Application name:
#   - Used to define part of the helm release name, e.g., in the make command helm-upgrade.%.
#   - Used to define part of the kubernetes namespace, e.g., in the make command helm-upgrade.%.
#   - Must be unique among all jupyterhub instances deployed in the cluster because 
#     resources of the helm deployment are identified by namespace and/or release name.
main=cs1302-23a

# Additional options. E.g., to test helm upgrade:
#   make helm_upgrade -e options='--dry-run --debug'
options=
# Port to test run a notebook image. 
# See make command docker-run.%.
port=8888

# Docker registry
# E.g., to push all images to a public registry in dockerhub account chungc:
#    make image.cs1302nb -e REGISTRY=chungc
REGISTRY=localhost:32000
# JupyterHub chart version
jupyterhub_chart_version=3.0.3

# Deploy the default jupyterhub instance
all: setup hub.default

# Setup the kubernetes cluster
setup: .setup_nfs .setup_hub

# Setup kubernetes to provide NFS storage
.setup_nfs: nfs.yaml
	helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/ --force-update && \
	helm upgrade --cleanup-on-fail --create-namespace -i \
		nfs-subdir-external-provisioner \
		nfs-subdir-external-provisioner/nfs-subdir-external-provisioner -f nfs.yaml -n nfs-provisioner && \
	touch $@

# Setup kubernetes to deploy JupyterHub
.setup_hub:
	helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/ --force-update && \
	touch $@

# Build and push hub and notebook images
image: image.cs1302hub image.cs1302nb image.cs1302nb__collab image.cs1302nb_alpine image.cs1302nb_test image.cs8695nb image.cs8695nb__collab

# Deploy a jupyterhub instance
# NOTE: The necesary hub and notebook images should be built and pushed to the registry beforehand, e.g., with the command
#       make image
#    with the VERSION variable set to the desired value.
hub.%:  helm-upgrade.%
	@echo "Deploying $*..."

# Cleaning the default jupyterhub instance.
clean: clean.default
# Cleaning a jupyterhub instance.
clean.%:
	@echo "Cleaning up namespace $*..."
	rm -rf .setup_$*
	make helm-uninstall.$*
	kubectl delete namespace jh-$(main)-$*

# Prepare a docker image for all instances
image.%: docker-build.% docker-push.%
	@echo "Making docker image $*..."

# Build a docker image
# E.g., the make command 
#   make docker-build.{{subdir}}_{{dockerfile_suffix}}_{{build_target}}
# will run
# 	cd {{subdir}} && docker build . -t {{subdir}}_{{dockerfile_suffix}}_{{build_target}} -f Dockerfile.{{dockerfile_suffix}} --target {{build_target}}
define docker-build
cd $(1) && \
docker build . \
-t $(1)$(2)$(3) \
$(foreach v,$(subst _,,$(2)),$(if $(v),-f Dockerfile.$(v))) \
$(foreach v,$(subst _,,$(3)),$(if $(v),--target $(v)))
endef

docker-build.%:
	$(call docker-build,$(word 1, $(subst _, _,$*)),$(word 2, $(subst _, _,$*)),$(word 3, $(subst _, _,$*)))

# Push a docker image to a registry
docker-push.%:
	docker tag "$*" "${REGISTRY}/$*:${VERSION}" && \
	docker push "${REGISTRY}/$*:${VERSION}"

# Test run a docker image at a port
docker-run.%:
	docker run -it -p $(port):8888/tcp \
	  -v $(PWD):/home/jovyan/work \
	  $* start-notebook.sh --NotebookApp.token='' --Application.log_level=0

# Create a namespace for a jupyterhub instance
namespace.%:
	@if ! kubectl get namespace jh-$(main)-$* >/dev/null 2>&1; then \
        echo "Creating namespace jh-$(main)-$*"; \
        kubectl create namespace jh-$(main)-$*; \
    else \
        echo "Namespace jh-$(main)-$* already exists"; \
    fi

# Helm upgrade a jupyterhub instance
helm-upgrade.%:
	@echo "Upgrading/installing jupyterhub with $*.yaml in the Kubernetes cluster..."
	helm upgrade --cleanup-on-fail --create-namespace -i -n jh-$(main)-$* $(main)-$* jupyterhub/jupyterhub \
	  --version=$(jupyterhub_chart_version) -f $*.yaml --atomic $(options)

# Helm list a jupyterhub instance
helm-list.%:
	@helm list -n jh-$(main)-$* && kubectl get all -n jh-$(main)-$*

# Helm uninstall a jupyterhub instance
helm-uninstall.%:
	@echo "Uninstalling chart from the Kubernetes cluster..."
	helm uninstall -n jh-$(main)-$* $(main)-$* --wait

.PHONY: image all setup	hub.% clean clean.% docker-build.% docker-push.% docker-run.% image.% helm-upgrade.% helm-list.% helm-uninstall.%