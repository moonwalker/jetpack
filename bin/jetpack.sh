#!/bin/sh

# Hardcode path to workaround npm bin symlink
DIRNAME="node_modules/@moonwalker/jetpack/bin"

# Load env vars
. "${DIRNAME}/env.sh"

# Run commands
ORG=$ORG REPO=$REPO \
  PRODUCT=$APP_PRODUCT \
  PRODUCT_ID=$PRODUCT_ID \
  BRANCH=$BRANCH \
  COMMIT=$COMMIT \
  SENTRY_ORG=$SENTRY_ORG \
  SENTRY_PROJECT=$SENTRY_PROJECT \
  "${DIRNAME}/run.js" $@
