'use strict'

module.exports = ({
  api,
  bitpay,
  coinify,
  coinifyPaymentDomain,
  comWalletApp,
  horizon,
  i_sign_this_domain,
  ledger,
  ledgerSocket,
  root,
  self,
  sfox_kyc_url,
  sfox_quote_url,
  sfox_url,
  shapeshift_url,
  veriff,
  walletHelper,
  webpackHttp,
  webpackWebSocket,
  webSocket
}) => ({
  'child-src': [
    coinifyPaymentDomain,
    i_sign_this_domain,
    root,
    veriff,
    walletHelper
  ],
  'connect-src': [
    'https://horizon.stellar.org',
    'https://www.unocoin.com',
    api,
    bitpay,
    coinify,
    horizon,
    ledgerSocket,
    ledger,
    self,
    root,
    sfox_kyc_url,
    sfox_quote_url,
    sfox_url,
    shapeshift_url,
    webpackHttp,
    webpackWebSocket,
    webSocket
  ],
  'default-src': [self],
  'font-src': [self],
  'form-action': [self],
  'frame-ancestors': [comWalletApp],
  'frame-src': [
    coinifyPaymentDomain,
    i_sign_this_domain,
    root,
    veriff,
    walletHelper
  ],
  'img-src': ['android-webview-video-poster:', 'blob:', 'data:', root, self],
  'media-src': [
    'blob:',
    'data:',
    'https://storage.googleapis.com/bc_public_assets/',
    'mediastream:',
    self
  ],
  'object-src': ["'none'"],
  'script-src': [`'nonce-**CSP_NONCE**'`, self],
  'style-src': [`'nonce-**CSP_NONCE**'`, self],
  'worker-src': ['blob:;']
})
