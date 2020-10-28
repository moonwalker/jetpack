#!/bin/sh

DIRNAME=$(dirname $0)

# Load env vars
source "${DIRNAME}/env.sh"

# Run commands
ORG=$ORG REPO=$REPO \
  PRODUCT=$PRODUCT \
  PRODUCT_ID=$PRODUCT_ID \
  BRANCH=$BRANCH \
  COMMIT=$COMMIT \
  "${DIRNAME}/run.js" $@
