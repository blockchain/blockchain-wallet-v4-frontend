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
    webSocket,
    'https://horizon.stellar.org',
    'https://www.unocoin.com'
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
  'img-src': [self, root, 'android-webview-video-poster:', 'blob:', 'data:'],
  'media-src': [
    self,
    'blob:',
    'data:',
    'https://storage.googleapis.com/bc_public_assets/',
    'mediastream:'
  ],
  'object-src': ["'none'"],
  'script-src': [self, `'nonce-**CSP_NONCE**'`],
  'style-src': [self, `'nonce-**CSP_NONCE**'`],
  'worker-src': ['blob:;']
})
