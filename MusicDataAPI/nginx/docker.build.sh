#!/bin/bash
APP_VERSION=1.0.0
PACKAGE_NAME=connect-fm-nginx
RELEASE_DATE=$(date +"%Y/%m/%d")
DOCKER_REGISTRY=197609
docker build -t ${DOCKER_REGISTRY}/${PACKAGE_NAME}:${APP_VERSION} \
--build-arg APP_VERSION=${APP_VERSION} \
--build-arg RELEASE_DATE=${RELEASE_DATE} \
.
docker tag ${DOCKER_REGISTRY}/${PACKAGE_NAME}:${APP_VERSION} ${DOCKER_REGISTRY}/${PACKAGE_NAME}:latest
docker push ${DOCKER_REGISTRY}/${PACKAGE_NAME}:${APP_VERSION}
docker push ${DOCKER_REGISTRY}/${PACKAGE_NAME}:latest