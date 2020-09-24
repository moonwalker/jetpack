#!/bin/bash

TAG=$(git describe --tags --abbrev=0)
VERSION=${TAG:1}

./node_modules/.bin/release-it --config ./config/release-it/release.js --ci $VERSION
