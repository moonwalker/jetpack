#!/bin/sh

# Hardcode path to workaround npm bin symlink
DIRNAME="node_modules/@moonwalker/jetpack/bin"

# Load env vars
source "${DIRNAME}/env.sh"

# Run commands
ORG=$ORG REPO=$REPO \
  PRODUCT=$PRODUCT \
  PRODUCT_ID=$PRODUCT_ID \
  BRANCH=$BRANCH \
  COMMIT=$COMMIT \
  "${DIRNAME}/run.js" $@
