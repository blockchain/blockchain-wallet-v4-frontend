'use strict'

const R = require(`ramda`)

const CSP = ({
  api,
  bitpay,
  coinify,
  coinifyPaymentDomain,
  comWalletApp,
  horizon,
  i_sign_this_domain,
  ledger,
  ledgerSocket,
  mainProcess,
  root,
  securityProcess,
  sfox_kyc_url,
  sfox_quote_url,
  sfox_url,
  shapeshift_url,
  veriff,
  walletHelper,
  webSocket
}) => ({
  main: {
    'connect-src': [
      'https://horizon.stellar.org',
      'https://www.unocoin.com',
      api,
      bitpay,
      coinify,
      horizon,
      ledgerSocket,
      ledger,
      mainProcess,
      root,
      sfox_kyc_url,
      sfox_quote_url,
      sfox_url,
      shapeshift_url,
      webSocket
    ],
    'default-src': [mainProcess],
    'font-src': [mainProcess],
    'form-action': [mainProcess],
    'frame-ancestors': [comWalletApp],
    'frame-src': [
      coinifyPaymentDomain,
      i_sign_this_domain,
      root,
      veriff,
      walletHelper
    ],
    'img-src': [
      'android-webview-video-poster:',
      'blob:',
      'data:',
      mainProcess,
      root
    ],
    'media-src': [
      'blob:',
      'data:',
      'https://storage.googleapis.com/bc_public_assets/',
      'mediastream:',
      mainProcess
    ],
    'object-src': ["'none'"],
    'script-src': [`'nonce-**CSP_NONCE**'`, mainProcess],
    'style-src': [`'nonce-**CSP_NONCE**'`, mainProcess],
    'worker-src': ['blob:;']
  },
  root: {
    'base-uri': [`'self'`],
    'connect-src': [`'self'`, api, root, webSocket],
    'default-src': [`'none'`],
    'form-action': [`'none'`],
    'frame-src': [mainProcess, securityProcess],
    'img-src': [`'self'`],
    'manifest-src': [`'self'`],
    'object-src': [`'none'`],
    'script-src': [`'self'`, `'nonce-**CSP_NONCE**'`],
    'style-src': [`'nonce-**CSP_NONCE**'`]
  },
  security: {
    'connect-src': [
      'https://horizon.stellar.org',
      'https://www.unocoin.com',
      api,
      bitpay,
      coinify,
      horizon,
      ledgerSocket,
      ledger,
      root,
      securityProcess,
      sfox_kyc_url,
      sfox_quote_url,
      sfox_url,
      shapeshift_url,
      webSocket
    ],
    'default-src': [securityProcess],
    'font-src': [securityProcess],
    'form-action': [securityProcess],
    'frame-ancestors': [comWalletApp],
    'frame-src': [
      coinifyPaymentDomain,
      i_sign_this_domain,
      root,
      veriff,
      walletHelper
    ],
    'img-src': [
      'android-webview-video-poster:',
      'blob:',
      'data:',
      root,
      securityProcess
    ],
    'media-src': [
      'blob:',
      'data:',
      'https://storage.googleapis.com/bc_public_assets/',
      'mediastream:',
      securityProcess
    ],
    'object-src': ["'none'"],
    'script-src': [`'nonce-**CSP_NONCE**'`, securityProcess],
    'style-src': [`'nonce-**CSP_NONCE**'`, securityProcess],
    'worker-src': ['blob:;']
  }
})

const replaceNonce = ({ nonce }, string) =>
  nonce ? string.replace(/\*\*CSP_NONCE\*\*/g, nonce) : nonce

const cspToString = R.curry(({ nonce }, policy) => {
  const string = Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join(`; `)

  return replaceNonce({ nonce }, string)
})

module.exports = { CSP, cspToString }
