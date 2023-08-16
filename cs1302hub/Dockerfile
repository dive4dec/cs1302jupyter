FROM jupyterhub/k8s-hub:2.0.0

USER root

# For LDAP & RADIUS
RUN apt-get update && \
    apt-get upgrade --yes && \
    apt-get install --yes --no-install-recommends \
    libnss-ldap \
    libpam-ldap \
    libpam-radius-auth \
    ldap-utils \
    sudo \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY etc/libnss-ldap.conf /etc/libnss-ldap.conf
COPY etc/nsswitch.conf /etc/nsswitch.conf
COPY etc/pam_radius_auth.conf /etc/pam_radius_auth.conf
COPY etc/pam.d /etc/pam.d

USER jovyan
