FROM node:9.11.1-alpine

# environment config fallbacks that can be overriden on startup
# e.g. docker run -it -p 8080:8080 -e ROOT_URL="whatever"[image-name]
ENV ROOT_URL='https://blockchain.info'
ENV WEB_SOCKET_URL='wss://ws.blockchain.info/inv'
ENV API_DOMAIN='https://api.blockchain.info'
ENV I_SIGN_THIS_DOMAIN='https://stage-verify.isignthis.com'

WORKDIR /usr/src/app

RUN mkdir build

COPY ./dist ./build
COPY package.json .
COPY server.js .

RUN npm install express compression

EXPOSE 8080

CMD ["node", "server.js"]
