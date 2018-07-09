# image/registry settings
ARG REGISTRY=docker-registry.internal.blockchain.info
ARG NGINX_IMAGE=blockchain_nginx
ARG NGINX_SHA=06c5efe75cedf639e5393a70380ba0d38300fa1ce56e59adb25918b15afe25a1
ARG NODE_IMAGE=blockchain_node_10
ARG NODE_SHA=7bcb42954e38ad413265e5d4b0c1e943cd85b06a95637c8c549ae978e55c51a7

# build arguments from pipeline
ARG environment
ARG root_url
ARG web_socket_url
ARG api_domain
ARG wallet_helper_domain
ARG i_sign_this_domain

# use Node image as builder
FROM ${REGISTRY}/${NODE_IMAGE}@sha256:${NODE_SHA} AS BUILDER

# ensure required build arguments are set
RUN : "${environment:? build argument is not set!}" \
  : "${root_url:? build argument is not set!}" \
  : "${web_socket_url:? build argument is not set!}" \
  : "${api_domain:? build argument is not set!}" \
  : "${wallet_helper_domain:? build argument is not set!}" \
  : "${i_sign_this_domain:? build argument is not set!}"

# set build args as environment variables for Node to consume
ENV ENVIRONMENT=$environment
ENV ROOT_URL=$root_url
ENV WEB_SOCKET_URL=$web_socket_url
ENV API_DOMAIN=$api_domain
ENV WALLET_HELPER_DOMAIN=$wallet_helper_domain

RUN chown -R blockchain /home/blockchain
RUN apt-get update && apt-get install -y python

WORKDIR /home/blockchain

# copy code
COPY . .

# build assets
RUN npm install lerna yarn babel-cli rimraf cross-env
RUN yarn bootstrap
RUN yarn ci:compile

# use NGINX image
FROM ${REGISTRY}/${NGINX_IMAGE}@sha256:${NGINX_SHA}

# copy built application assets to nginx layer
COPY --from=BUILDER /home/blockchain/dist /var/www/

# TODO: sed command on nginx
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R www-data:www-data /var/www/

EXPOSE 8080
