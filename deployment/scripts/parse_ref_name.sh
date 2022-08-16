#!/bin/bash
# Copyright (c) 2020 AppServation Co., Ltd. All Rights Reserved.
# This is licensed software from AppServation Co., Ltd,
# for limitations and restrictions contact company contract 
# manager.

if [[ ${CI_COMMIT_REF_NAME} == *['!'@/\-#\$%^\&*()_+]* ]]
then
  echo "REF_NAME=$(echo ${CI_COMMIT_REF_NAME} | tr -dc '[:alnum:]' | tr '[:upper:]' '[:lower:]')"
else
  echo "REF_NAME=${CI_COMMIT_REF_NAME}"
fi