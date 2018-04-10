FROM node:9.11.1-alpine

WORKDIR /usr/src/app

RUN mkdir build

COPY ./build ./build
COPY package.json .
COPY server.js .

RUN npm install express compression

EXPOSE 8080

ENTRYPOINT ["node", "server.js"]
