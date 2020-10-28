#!/bin/sh

ORG=${ORG:-"$CIRCLE_PROJECT_USERNAME"}
REPO=${REPO:-$(basename -s .git `git config --get remote.origin.url`)}

PRODUCT=${PRODUCT:-"$REPO"}
PRODUCT_ID=${PRODUCT_ID:-"$REPO"}

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git rev-parse --short=7 HEAD)

SENTRY_ORG=${SENTRY_ORG:-"$ORG"}
SENTRY_PROJECT=${SENTRY_PROJECT:-"$REPO"}
