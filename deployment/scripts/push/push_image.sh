#!/bin/bash
# Copyright (c) 2020 AppServation Co., Ltd. All Rights Reserved.
# This is licensed software from AppServation Co., Ltd,
# for limitations and restrictions contact company contract 
# manager.

function init() {

  # Sanitize environment
  if [ -z ${AWS_ECR_ENDPOINT} ]; then
    echo "AWS ECR Endpoint not found"
    exit 1;
  fi

  if [ -z ${AWS_ACCESS_KEY} ]; then
    echo "AWS Access Key not found"
    exit 1;
  fi

  if [ -z ${AWS_SECRET_KEY} ]; then
    echo "AWS Secret Key not found"
    exit 1;
  fi

  if ! command -v aws &> /dev/null
  then
      echo "AWS CLI could not be found"
      exit
  fi

  if ! command -v docker &> /dev/null
  then
      echo "Docker could not be found"
      exit
  fi

  readonly docker_image_name="${NAMESPACE}/${CI_PROJECT_NAME}"
  readonly docker_image_uri="${AWS_ECR_ENDPOINT}/${NAMESPACE}/${CI_PROJECT_NAME}"

}

function docker_login() {

  # Login to ECR
  AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY} \
  AWS_SECRET_ACCESS_KEY=${AWS_SECRET_KEY} \
  aws ecr get-login-password | \
  docker login --username AWS --password-stdin \
  ${AWS_ECR_ENDPOINT}

}

function docker_push() {

  docker tag "${docker_image_name}:${VERSION}" "${docker_image_uri}:${VERSION}"
  docker tag "${docker_image_name}:${VERSION}" "${docker_image_uri}:${REF_NAME}-latest"
  docker push "${docker_image_uri}:${VERSION}"
  docker push "${docker_image_uri}:${REF_NAME}-latest"

}

function docker_delete() {

  docker rmi "${docker_image_name}:${VERSION}"
  docker rmi "${docker_image_uri}:${VERSION}"
  docker rmi "${docker_image_uri}:${REF_NAME}-latest"

}

function main() {

  init
  docker_login
  docker_push
  docker_delete

}

main "$@"