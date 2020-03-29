/* eslint-disable */
const chalk = require('chalk')
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin')
const path = require('path')
const fs = require('fs')

const webpackBuilder = require('./scripts/webpackBuilder')
const CONFIG_PATH = require('./../../config/paths')
const mockWalletOptions = require('./../../config/mocks/wallet-options-v4.json')

const iSignThisDomain =
  mockWalletOptions.platforms.web.coinify.config.iSignThisDomain
const coinifyPaymentDomain =
  mockWalletOptions.platforms.web.coinify.config.coinifyPaymentDomain
const NONCE = `2726c7f26c`
let envConfig = {}
let sslEnabled = process.env.DISABLE_SSL
  ? false
  : fs.existsSync(CONFIG_PATH.sslConfig + '/key.pem') &&
    fs.existsSync(CONFIG_PATH.sslConfig + '/cert.pem')
let localhostUrl = sslEnabled
  ? 'https://localhost:8080'
  : 'http://localhost:8080'

try {
  envConfig = require(CONFIG_PATH.envConfig +
    `/${process.env.NODE_ENV}` +
    '.js')
} catch (e) {
  console.log(
    chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') +
      chalk.yellow(
        `Failed to load ${process.env.NODE_ENV}.js config file! Using the production config instead.\n`
      )
  )
  envConfig = require(CONFIG_PATH.envConfig + '/production.js')
} finally {
  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
  console.log(chalk.cyan('Root URL') + `: ${envConfig.ROOT_URL}`)
  console.log(chalk.cyan('API Domain') + `: ${envConfig.API_DOMAIN}`)
  console.log(
    chalk.cyan('Wallet Helper Domain') +
      ': ' +
      chalk.blue(envConfig.WALLET_HELPER_DOMAIN)
  )
  console.log(
    chalk.cyan('Web Socket URL') + ': ' + chalk.blue(envConfig.WEB_SOCKET_URL)
  )
  console.log(chalk.cyan('SSL Enabled: ') + chalk.blue(sslEnabled))
}

const webpackConfig = webpackBuilder(envConfig, [
  new HtmlWebpackStringReplacePlugin({ '\\*\\*CSP_NONCE\\*\\*': NONCE })
])

module.exports = {
  ...webpackConfig,
  devServer: {
    cert: sslEnabled
      ? fs.readFileSync(CONFIG_PATH.sslConfig + '/cert.pem', 'utf8')
      : '',
    contentBase: CONFIG_PATH.src,
    disableHostCheck: true,
    historyApiFallback: true,
    host: 'localhost',
    hot: false,
    https: sslEnabled,
    key: sslEnabled
      ? fs.readFileSync(CONFIG_PATH.sslConfig + '/key.pem', 'utf8')
      : '',
    port: 8080,
    before(app) {
      app.get('/Resources/wallet-options-v4.json', function(req, res) {
        // combine wallet options base with custom environment config
        mockWalletOptions.domains = {
          api: envConfig.API_DOMAIN,
          bitpay: envConfig.BITPAY_URL,
          coinify: envConfig.COINIFY_URL,
          comRoot: envConfig.COM_ROOT,
          comWalletApp: envConfig.COM_WALLET_APP,
          horizon: envConfig.HORIZON_URL,
          ledger: localhostUrl + '/ledger', // will trigger reverse proxy
          ledgerSocket: envConfig.LEDGER_SOCKET_URL,
          root: envConfig.ROOT_URL,
          veriff: envConfig.VERIFF_URL,
          walletHelper: envConfig.WALLET_HELPER_DOMAIN,
          webSocket: envConfig.WEB_SOCKET_URL
        }

        if (process.env.NODE_ENV === 'testnet') {
          mockWalletOptions.platforms.web.coins.BTC.config.network = 'testnet'
          mockWalletOptions.platforms.web.coinify.config.partnerId = 35
          mockWalletOptions.platforms.web.sfox.config.apiKey =
            '6fbfb80536564af8bbedb7e3be4ec439'
        }

        res.json(mockWalletOptions)
      })

      // TODO: DEPRECATE
      // This is to locally test transferring cookies from transfer_stored_values.html
      app.get('/Resources/transfer_stored_values.html', function(req, res) {
        res.sendFile(
          path.join(
            __dirname,
            '/../../config/mocks/transfer_stored_values.html'
          )
        )
      })

      app.get('/Resources/wallet-options.json', function(req, res) {
        mockWalletOptions.domains = { comWalletApp: localhostUrl }
        res.json(mockWalletOptions)
      })
    },
    proxy: {
      '/ledger': {
        target: envConfig.LEDGER_URL,
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/ledger': '' }
      }
    },
    overlay: {
      warnings: true,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': [
        "img-src 'self' data: blob:",
        `script-src 'nonce-${NONCE}' 'self'`,
        `style-src 'nonce-${NONCE}' 'self'`,
        `frame-src ${iSignThisDomain} ${coinifyPaymentDomain} ${envConfig.WALLET_HELPER_DOMAIN} ${envConfig.ROOT_URL} https://localhost:8080 http://localhost:8080`,
        `child-src ${iSignThisDomain} ${coinifyPaymentDomain} ${envConfig.WALLET_HELPER_DOMAIN} blob:`,
        [
          'connect-src',
          "'self'",
          'ws://localhost:8080',
          'wss://localhost:8080',
          'wss://api.ledgerwallet.com',
          'wss://ws.testnet.blockchain.info/inv',
          envConfig.WEB_SOCKET_URL,
          envConfig.ROOT_URL,
          envConfig.API_DOMAIN,
          envConfig.WALLET_HELPER_DOMAIN,
          envConfig.LEDGER_URL,
          envConfig.VERIFF_URL,
          envConfig.LEDGER_SOCKET_URL,
          envConfig.HORIZON_URL,
          'https://app-api.coinify.com',
          'https://app-api.sandbox.coinify.com',
          'https://api.sfox.com',
          'https://api.staging.sfox.com',
          'https://quotes.sfox.com',
          `https://quotes.staging.sfox.com`,
          'https://sfox-kyc.s3.amazonaws.com',
          'https://sfox-kyctest.s3.amazonaws.com',
          'https://testnet5.blockchain.info',
          'https://api.testnet.blockchain.info',
          'https://shapeshift.io',
          'https://bitpay.com'
        ].join(' '),
        "object-src 'none'",
        "media-src 'self' https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:",
        "font-src 'self'"
      ].join('; ')
    }
  }
}
