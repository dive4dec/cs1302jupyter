ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

# Adapted from https://github.com/trampgeek/jobeinabox
# to support jupyter environment

# Set up the (apache) environment variables
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV LANG C.UTF-8

# Copy apache virtual host file for later use
COPY jobeinabox/000-jobe.conf /
# Copy test script
COPY jobeinabox/container-test.sh /

# Install extra packages
# Redirect apache logs to stdout
# Configure apache
# Configure php
# Get and install jobe
# Clean up
RUN apt-get update && \
    apt-get --no-install-recommends install -yq \
        acl \
        apache2 \
        build-essential \
        fp-compiler \
        git \
        libapache2-mod-php \
        nodejs \
        octave \
        openjdk-18-jdk \
        php \
        php-cli \
        php-mbstring \
        sqlite3 \
        sudo \
        tzdata \
        unzip && \
    # python3 -m pip install pylint && \
    # pylint --reports=no --score=n --generate-rcfile > /etc/pylintrc && \
    ln -sf /proc/self/fd/1 /var/log/apache2/access.log && \
    ln -sf /proc/self/fd/1 /var/log/apache2/error.log && \
    sed -i "s/export LANG=C/export LANG=$LANG/" /etc/apache2/envvars && \
    sed -i '1 i ServerName localhost' /etc/apache2/apache2.conf && \
    sed -i 's/ServerTokens\ OS/ServerTokens \Prod/g' /etc/apache2/conf-enabled/security.conf && \
    sed -i 's/ServerSignature\ On/ServerSignature \Off/g' /etc/apache2/conf-enabled/security.conf && \
    rm /etc/apache2/sites-enabled/000-default.conf && \
    mv /000-jobe.conf /etc/apache2/sites-enabled/ && \
    mkdir -p /var/crash && \
    chmod 777 /var/crash && \
    echo '<!DOCTYPE html><html lang="en"><title>Jobe</title><h1>Jobe</h1></html>' > /var/www/html/index.html && \
    git clone https://github.com/dive4dec/jobe.git /var/www/html/jobe && \
    apache2ctl start && \
    cd /var/www/html/jobe && \
    /usr/bin/python3 /var/www/html/jobe/install && \
    chown -R ${APACHE_RUN_USER}:${APACHE_RUN_GROUP} /var/www/html && \
    apt-get -y autoremove --purge && \
    apt-get -y clean && \
    rm -rf /var/lib/apt/lists/*

# Expose apache
EXPOSE 80

# Start apache
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]

# Healthcheck, minimaltest.py should complete within 2 seconds
HEALTHCHECK --interval=5m --timeout=2s \
    CMD /usr/bin/python3 /var/www/html/jobe/minimaltest.py || exit 1

# To run apache as non-root
RUN apt update \
    && apt upgrade -y \
    && apt install -y libcap2-bin procps

RUN setcap 'cap_net_bind_service=+ep' /usr/sbin/apache2 \
    && setcap 'cap_net_bind_service=+ep' /usr/sbin/apache2ctl \
    && chown -R www-data:www-data /var/log/apache2 /var/run/apache2 \
    && usermod -a -G ${NB_GID} www-data \
    && pylint --reports=no --score=n --generate-rcfile > /etc/pylintrc

# change python path to use conda python
RUN sed -i 's\/usr/bin/\\' /var/www/html/jobe/application/libraries/python3_task.php \
    && echo '$config'"['python3_version'] = '${CONDA_DIR}/bin/python3';" >> /var/www/html/jobe/application/config/config.php

USER www-data