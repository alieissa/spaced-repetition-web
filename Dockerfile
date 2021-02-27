FROM node:15.0-alpine3.10

WORKDIR /app
COPY ./public /app/public
COPY ./src /app/src
COPY ./*.json /app/

RUN npm install
## Use reat-scripts already installed
RUN npm install react-scripts@3.4.1 -g --silent

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]