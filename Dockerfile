FROM docker-registry.service.consul:5000/blockchain_node_10@sha256:7bcb42954e38ad413265e5d4b0c1e943cd85b06a95637c8c549ae978e55c51a7

RUN chown -R blockchain /home/blockchain

# pull build arguments from pipeline
ARG environment
ARG root_url
ARG web_socket_url
ARG api_domain
ARG wallet_helper_domain

# ensure required build arguments are set
RUN : "${environment:? build argument is not set!}" \
  : "${root_url:? build argument is not set!}" \
  : "${web_socket_url:? build argument is not set!}" \
  : "${api_domain:? build argument is not set!}" \
  : "${wallet_helper_domain:? build argument is not set!}"

# set build args as environment variables for Node to consume
ENV ENVIRONMENT=$environment
ENV ROOT_URL=$root_url
ENV WEB_SOCKET_URL=$web_socket_url
ENV API_DOMAIN=$api_domain
ENV WALLET_HELPER_DOMAIN=$wallet_helper_domain

WORKDIR /home/blockchain

# copy code
COPY . .

# build assets
RUN npm install lerna yarn babel-cli rimraf cross-env
RUN yarn bootstrap
RUN yarn ci:compile

USER blockchain

EXPOSE 8080

# start server
CMD ["node", "server.js"]
