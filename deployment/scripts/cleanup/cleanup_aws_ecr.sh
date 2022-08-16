#!/bin/bash
# Copyright (c) 2020 AppServation Co., Ltd. All Rights Reserved.
# This is licensed software from AppServation Co., Ltd,
# for limitations and restrictions contact company contract 
# manager.

function init() {

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

  if ! command -v jq &> /dev/null
  then
      echo "jq could not be found"
      exit
  fi

  if [ ${CI_COMMIT_REF_NAME} == "master" ]; then
    START_INDEX=6
  else
    START_INDEX=3
  fi

}

function get_delete_candidate() {

  local ESEP="$1"
  local IFS=$'\n'

  local -a array_candidates

  candidates=$(aws ecr describe-images --repository-name ${NAMESPACE}/${CI_PROJECT_NAME} \
                  --query 'reverse(sort_by(imageDetails, &imagePushedAt))[*]' | \
              jq '.[].imageTags[]' | \
              grep ${CI_COMMIT_REF_NAME} | \
              tail -n +${START_INDEX} | cut -d '"' -f 2)

  echo "${candidates}" | tr " " "\n" > candidates.tmp
  mapfile -t array_candidates < <(cat candidates.tmp)
  rm candidates.tmp

  IFS=${ESEP}
  echo ${array_candidates[*]}

}

function delete_images() {

  local -a delete_candidates=( $( get_delete_candidate ) )

  if [ ${#delete_candidates} -gt 0 ]; then
    for candidate in ${delete_candidates[@]}
    do
      aws ecr batch-delete-image --repository-name ${NAMESPACE}/${CI_PROJECT_NAME} --image-ids imageTag=${candidate}
    done
  else
    echo "No candidate(s) marked as deletion"
  fi

}

function main() {

  init
  delete_images

}

main "$@"