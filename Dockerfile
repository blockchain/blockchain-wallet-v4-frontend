FROM docker-registry.service.consul:5000/blockchain_javascript@sha256:9ae5d67167dc8d9ccc0bae57b3ba7a07f241ad59fa91a85d3eec9d2594b1c471

RUN chown -R blockchain /home/blockchain

# configure image build
ARG environment
ARG root_url
ARG web_socket_url
ARG api_domain

# ensure required build arguments are known
RUN \
  : "${environment:? build argument is not set!}" \
  : "${root_url:? build argument is not set!}" \
  : "${web_socket_url:? build argument is not set!}" \
  : "${api_domain:? build argument is not set!}" \

# set build args as environments vars for Express server
ENV ENVIRONMENT=$environment
ENV ROOT_URL=$root_url
ENV WEB_SOCKET_URL=$web_socket_url
ENV API_DOMAIN=$api_domain
ENV WALLET_HELPER_DOMAIN='https://wallet-helper.blockchain.info'

WORKDIR /home/blockchain

COPY . .

RUN npm install lerna yarn babel-cli
RUN yarn bootstrap
RUN yarn ci:build:prod

USER blockchain

EXPOSE 8080

CMD ["node", "server.js"]
