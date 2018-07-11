ARG REGISTRY=docker-registry.service.consul:5000
ARG NGINX_IMAGE=blockchain_nginx
ARG NGINX_SHA=06c5efe75cedf639e5393a70380ba0d38300fa1ce56e59adb25918b15afe25a1
ARG NODE_IMAGE=blockchain_node_10
ARG NODE_SHA=7bcb42954e38ad413265e5d4b0c1e943cd85b06a95637c8c549ae978e55c51a7

# use Node image as builder
FROM ${REGISTRY}/${NODE_IMAGE}@sha256:${NODE_SHA} AS BUILDER

# build arguments from pipeline
ARG root_url
ARG web_socket_url
ARG api_domain
ARG wallet_helper_domain
ARG i_sign_this_domain
ARG sfox_url
ARG sfox_quote_url
ARG sfox_kyc_url
ARG shapeshift_url
ARG coinify_url

# ensure required build arguments are set
RUN : "${root_url:? build argument is not set!}" \
  : "${web_socket_url:? build argument is not set!}" \
  : "${api_domain:? build argument is not set!}" \
  : "${wallet_helper_domain:? build argument is not set!}" \
  : "${i_sign_this_domain:? build argument is not set!}" \
  : "${sfox_url:? build argument is not set!}" \
  : "${sfox_quote_url:? build argument is not set!}" \
  : "${sfox_kyc_url:? build argument is not set!}" \
  : "${shapeshift_url:? build argument is not set!}" \
  : "${coinify_url:? build argument is not set!}"

# set build args as environment variables for sed command
ENV ENVIRONMENT=$environment
ENV ROOT_URL=$root_url
ENV WEB_SOCKET_URL=$web_socket_url
ENV API_DOMAIN=$api_domain
ENV WALLET_HELPER_DOMAIN=$wallet_helper_domain
ENV I_SIGN_THIS_DOMAIN=$i_sign_this_domain
ENV SFOX_URL=$sfox_url
ENV SFOX_QUOTE_URL=$sfox_quote_url
ENV SFOX_KYC_URL=$sfox_kyc_url
ENV SHAPESHIFT_URL=$shapeshift_url
ENV COINIFY_URL=$coinify_url

RUN chown -R blockchain /home/blockchain
RUN apt-get update && apt-get install -y python

WORKDIR /home/blockchain

# copy code
COPY . .

# update CSP headers in NGINX config
RUN sed -e "s|_apiDomain_|$API_DOMAIN|g" -e "s|_rootURL_|$ROOT_URL|g" -e "s|_iSignThisDomain_|$I_SIGN_THIS_DOMAIN|g" -e "s|_walletHelperDomain_|$WALLET_HELPER_DOMAIN|g" -e "s|_webSocketURL_|$WEB_SOCKET_URL|g" -e "s|_sfoxURL_|$SFOX_URL|g" -e "s|_sfoxQuoteURL_|$SFOX_QUOTE_URL|g" -e "s|_sfoxKycURL_|$SFOX_KYC_URL|g" -e "s|_shapeshiftURL_|$SHAPESHIFT_URL|g" -e "s|_coinifyURL_|$COINIFY_URL|g" -i nginx.conf

# build assets
RUN npm install yarn babel-cli rimraf cross-env
RUN yarn
RUN yarn ci:compile

# use NGINX image
FROM ${REGISTRY}/${NGINX_IMAGE}@sha256:${NGINX_SHA}

# copy built application assets to nginx layer
COPY --from=BUILDER /home/blockchain/dist /var/www/
COPY --from=BUILDER /home/blockchain/nginx.conf /etc/nginx/nginx.conf

RUN chown -R www-data:www-data /var/www/

EXPOSE 8080
