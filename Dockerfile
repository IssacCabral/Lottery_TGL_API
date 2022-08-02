FROM node:alpine
RUN apk add --no-cache bash
USER node
WORKDIR /usr/src/app