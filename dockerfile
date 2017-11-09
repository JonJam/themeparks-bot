FROM node:carbon

WORKDIR .

COPY package.json .
#COPY yarn.lock