#!/bin/bash
# Copyright (c) 2020 AppServation Co., Ltd. All Rights Reserved.
# This is licensed software from AppServation Co., Ltd,
# for limitations and restrictions contact company contract 
# manager.

function init() {

  if [ -z ${AWS_ACCESS_KEY_ID} ]; then
    echo "AWS Access Key not found"
    exit 1;
  fi

  if [ -z ${AWS_SECRET_ACCESS_KEY} ]; then
    echo "AWS Secret Key not found"
    exit 1;
  fi

  if ! command -v aws &> /dev/null
  then
      echo "AWS CLI could not be found"
      exit
  fi

  aws_s3_bucket="optimus-cached-artifacts"

}

function aws_s3_get_last_modified_object() {

  echo "Get last modified object date"
  last_modified_object=$(aws s3 ls --recursive ${aws_s3_bucket} | sort | tail -n 1 | awk '{print $1}')

  echo "Last modified object date: ${last_modified_object}"
  aws_s3_object_older_than=$(date --date "${last_modified_object} 7 days ago" +%s)

}

function aws_s3_get_expired_object() {

  aws s3 ls --recursive ${aws_s3_bucket} | \
  while read -r line;
    do

      date_created=`echo ${line} | awk {'print $1" "$2'}`
      date_created=`date --date "${date_created}" +%s`
      
      if [[ ${date_created} -lt ${aws_s3_object_older_than} ]]; then
        aws_s3_object_name=`echo ${line} | awk {'print $4'}`

        if [[ ${aws_s3_object_name} != "" ]]; then
          aws s3 rm s3://${aws_s3_bucket}/${aws_s3_object_name}
        fi
      fi

    done;
}

function main() {

  init
  aws_s3_get_last_modified_object
  aws_s3_get_expired_object

}

main "$@"