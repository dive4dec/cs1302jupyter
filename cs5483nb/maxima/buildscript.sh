#!/bin/sh

# Adapted from https://github.com/ccha23/goemaxima/blob/master/buildscript.sh
# ---
# This script build SBCL and Maxima from source.
# It also compiles maxima_fork.c.

set -e

MAXIMA_VERSION=5.44.0
SBCL_VERSION=2.3.10
SRC=/tmp/src
mkdir -p /tmp/src

apt-get update --yes
apt-get install --yes --no-install-recommends wget make gcc texinfo # curl libcap2-bin

wget "https://github.com/mathinstitut/maxima-mirror/releases/download/${MAXIMA_VERSION}/maxima-${MAXIMA_VERSION}.tar.gz" -O "${SRC}/maxima-${MAXIMA_VERSION}.tar.gz"
wget "https://github.com/sbcl/sbcl/archive/refs/tags/sbcl-${SBCL_VERSION}.tar.gz" -O "${SRC}/sbcl-${SBCL_VERSION}.tar.gz"

# Compile sbcl (installs and removes debian sbcl for bootstrapping)
apt install -y sbcl
cd ${SRC}
tar -xzf sbcl-${SBCL_VERSION}.tar.gz
rm sbcl-${SBCL_VERSION}.tar.gz
cd sbcl-sbcl-${SBCL_VERSION}
echo "\"$SBCL_VERSION\"" > version.lisp-expr
./make.sh
apt remove -y sbcl
./install.sh

# Compile maxima
cd ${SRC}
tar -xf maxima-${MAXIMA_VERSION}.tar.gz
rm maxima-${MAXIMA_VERSION}.tar.gz
cd maxima-${MAXIMA_VERSION}
./configure
make
make install
make clean

# runtime dependencies
# apt-get install -y gnuplot-nox gettext-base libbsd-dev tini

# cd /
# test -n "$MAX_USER" || MAX_USER=32
# gcc -shared maxima_fork.c -lbsd -fPIC -Wall -Wextra -DN_SLOT="${MAX_USER}" -o libmaximafork.so
# apt-get purge -y bzip2 make wget python3 gcc texinfo
# apt-get autoremove -y