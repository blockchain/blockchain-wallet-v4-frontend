const R = require(`ramda`)

const cspToString = policy =>
  Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join(`; `)

const processes = ({
  api_domain,
  bitpay_url,
  coinify_pay_url,
  coinify_url,
  horizon_friendbot_url,
  horizon_url,
  i_sign_this_domain,
  ledger_socket_url,
  ledger_url,
  main_process_url,
  root_process_url,
  root_url,
  security_process_url,
  sfox_kyc_url,
  sfox_quote_url,
  sfox_url,
  shapeshift_url,
  veriff_url,
  wallet_helper_domain,
  web_socket_url
}) => ({
  root: {
    'base-uri': [root_process_url],
    'connect-src': [root_process_url, web_socket_url, api_domain, root_url],
    'default-src': [`'none'`],
    'form-action': [`'none'`],
    'frame-src': [main_process_url, security_process_url],
    'img-src': [root_process_url],
    'manifest-src': [root_process_url],
    'object-src': [`'none'`],
    'script-src': [root_process_url, `'nonce-**CSP_NONCE**'`],
    'style-src': [`'nonce-**CSP_NONCE**'`]
  },
  main: {
    'child-src': [
      coinify_pay_url,
      i_sign_this_domain,
      root_url,
      veriff_url,
      wallet_helper_domain
    ],
    'connect-src': [
      main_process_url,
      'https://horizon.stellar.org',
      'https://www.unocoin.com',
      api_domain,
      bitpay_url,
      coinify_url,
      horizon_url,
      ledger_socket_url,
      ledger_url,
      root_url,
      sfox_kyc_url,
      sfox_quote_url,
      sfox_url,
      shapeshift_url,
      web_socket_url
    ],
    'default-src': [main_process_url],
    'font-src': [main_process_url],
    'form-action': [main_process_url],
    'frame-ancestors': [root_process_url],
    'frame-src': [
      coinify_pay_url,
      i_sign_this_domain,
      root_url,
      veriff_url,
      wallet_helper_domain
    ],
    'img-src': [
      main_process_url,
      'android-webview-video-poster:',
      'blob:',
      'data:',
      root_url
    ],
    'media-src': [
      main_process_url,
      'blob:',
      'data:',
      'https://storage.googleapis.com/bc_public_assets/',
      'mediastream:'
    ],
    'object-src': ["'none'"],
    'script-src': [
      main_process_url,
      "'sha256-nM2STjrUZ1XstR+Hzh4CPeB+ptkb42LRKW5gVz0/4Nw='"
    ],
    'style-src': ["'nonce-**CSP_NONCE**'", main_process_url],
    'worker-src': ['blob:;']
  },
  security: {
    'child-src': [
      coinify_pay_url,
      i_sign_this_domain,
      root_url,
      veriff_url,
      wallet_helper_domain
    ],
    'connect-src': [
      security_process_url,
      'https://horizon.stellar.org',
      'https://www.unocoin.com',
      api_domain,
      bitpay_url,
      coinify_url,
      horizon_url,
      ledger_socket_url,
      ledger_url,
      root_url,
      sfox_kyc_url,
      sfox_quote_url,
      sfox_url,
      shapeshift_url,
      web_socket_url
    ],
    'default-src': [security_process_url],
    'font-src': [security_process_url],
    'form-action': [security_process_url],
    'frame-ancestors': [root_process_url],
    'frame-src': [
      coinify_pay_url,
      i_sign_this_domain,
      root_url,
      veriff_url,
      wallet_helper_domain
    ],
    'img-src': [
      security_process_url,
      'android-webview-video-poster:',
      'blob:',
      'data:',
      root_url
    ],
    'media-src': [
      security_process_url,
      'blob:',
      'data:',
      'https://storage.googleapis.com/bc_public_assets/',
      'mediastream:'
    ],
    'object-src': ["'none'"],
    'script-src': [
      security_process_url,
      "'sha256-nM2STjrUZ1XstR+Hzh4CPeB+ptkb42LRKW5gVz0/4Nw='"
    ],
    'style-src': ["'nonce-**CSP_NONCE**'", security_process_url],
    'worker-src': ['blob:;']
  }
})

module.exports = build_args =>
  R.fromPairs(
    Object.entries(processes(build_args)).map(([key, value]) => [
      key,
      cspToString(value)
    ])
  )
