# Copyright (c) 2020 AppServation Co., Ltd. All Rights Reserved.
# This is licensed software from AppServation Co., Ltd,
# for limitations and restrictions contact company contract 
# manager.

FROM node:12.22.0
LABEL maintainer="engineering@hungryhub.com"

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install

COPY . /app
RUN yarn build