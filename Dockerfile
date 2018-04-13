FROM docker-registry.service.consul:5000/blockchain_javascript@sha256:9ae5d67167dc8d9ccc0bae57b3ba7a07f241ad59fa91a85d3eec9d2594b1c471

RUN echo 'fresh docker kicks'

RUN chown -R blockchain /home/blockchain

# environment config fallbacks that can be overriden on startup
# e.g. docker run -it -p 8080:8080 -e ROOT_URL="whatever"[image-name]
ENV ENVIRONMENT = 'production'
ENV ROOT_URL='https://blockchain.info'
ENV WEB_SOCKET_URL='wss://ws.blockchain.info/inv'
ENV API_DOMAIN='https://api.blockchain.info'
ENV WALLET_HELPER_DOMAIN='https://wallet-helper.blockchain.info'

WORKDIR /home/blockchain

COPY . .

RUN npm -v
RUN node -v

RUN npm install lerna yarn babel-cli
RUN yarn bootstrap
RUN yarn ci:build:prod

USER blockchain

EXPOSE 8080

CMD ["node", "server.js"]
