ARG REGISTRY=docker-registry.internal.blockchain.info
ARG NGINX_IMAGE=blockchain_nginx
ARG NGINX_SHA=06c5efe75cedf639e5393a70380ba0d38300fa1ce56e59adb25918b15afe25a1
ARG NODE_IMAGE=blockchain_node_10
ARG NODE_SHA=7bcb42954e38ad413265e5d4b0c1e943cd85b06a95637c8c549ae978e55c51a7

FROM ${REGISTRY}/${NODE_IMAGE}@sha256:${NODE_SHA} AS BUILDER

RUN chown -R blockchain /home/blockchain
RUN apt-get update && apt-get install -y python

WORKDIR /home/blockchain

# Copy code
COPY . .

# Build assets
RUN npm install lerna yarn babel-cli rimraf cross-env
RUN yarn bootstrap
RUN yarn ci:compile

FROM ${REGISTRY}/${NGINX_IMAGE}@sha256:${NGINX_SHA}

# Copy built assets to nginx layer
COPY --from=BUILDER /home/blockchain/dist /var/www/
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R www-data:www-data /var/www/

EXPOSE 8080
