/* eslint-disable */
const Webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const path = require('path')
const fs = require('fs')
const { evolve, update } = require('ramda')

const webpackBuilder = require('./utils/webpackBuilder')
const CONFIG_PATH = require('../../config/paths')
const mockWalletOptions = require('../../config/mocks/wallet-options-v4.json')
const NONCE = '2726c7f26c'

// get envConfig, SSL flag and base webpack config from builder
const { envConfig, isSslEnabled, webpackConfig } = webpackBuilder([
  new CaseSensitivePathsPlugin(),
  new Webpack.HotModuleReplacementPlugin()
])
const localhostUrl = isSslEnabled
  ? 'https://localhost:8080'
  : 'http://localhost:8080'

// evolve base config for fast dev mode and HMR
// NOTE: if you want to add/override a base config property, do it here!
const devWebpackConfig = evolve(
  {
    devtool: () => 'inline-source-map',
    mode: () => 'development',
    module: {
      rules: update(0, {
        test: /\.js$/,
        include: /src|blockchain-info-components.src|blockchain-wallet-v4.src/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 8, // number of cores on intel i5
              workerParallelJobs: 32,
              workerNodeArgs: ['--max-old-space-size=2048'],
              poolRespawn: false,
              poolParallelJobs: 32
            }
          },
          'babel-loader'
        ]
      })
    },
    output: { path: () => CONFIG_PATH.appBuild },
    optimization: {
      concatenateModules: () => false,
      splitChunks: {
        cacheGroups: {
          frontend: {
            test: () =>
              function(module) {
                return (
                  module.resource &&
                  module.resource.indexOf(
                    'blockchain-wallet-v4-frontend/src'
                  ) === -1
                )
              }
          }
        }
      }
    }
  },
  webpackConfig
)

// merge configurations into one export for webpack
module.exports = {
  ...devWebpackConfig,
  devServer: {
    cert: isSslEnabled
      ? fs.readFileSync(CONFIG_PATH.sslConfig + '/cert.pem', 'utf8')
      : '',
    contentBase: CONFIG_PATH.src,
    disableHostCheck: true,
    host: 'localhost',
    https: isSslEnabled,
    key: isSslEnabled
      ? fs.readFileSync(CONFIG_PATH.sslConfig + '/key.pem', 'utf8')
      : '',
    port: 8080,
    hot: true,
    historyApiFallback: true,
    before(app) {
      app.get('/Resources/wallet-options-v4.json', function(req, res) {
        // combine wallet options base with custom environment config
        mockWalletOptions.domains = {
          api: envConfig.API_DOMAIN,
          bitpay: envConfig.BITPAY_URL,
          coinify: envConfig.COINIFY_URL,
          coinifyPaymentDomain: envConfig.COINIFY_PAYMENT_DOMAIN,
          comRoot: envConfig.COM_ROOT,
          comWalletApp: envConfig.COM_WALLET_APP,
          exchange: envConfig.EXCHANGE_URL,
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
        `script-src 'nonce-${NONCE}' 'self' 'unsafe-eval'`,
        "style-src 'self' 'unsafe-inline'",
        `frame-src ${envConfig.COINIFY_PAYMENT_DOMAIN} ${envConfig.WALLET_HELPER_DOMAIN} ${envConfig.ROOT_URL} https://magic.veriff.me https://localhost:8080`,
        `child-src ${envConfig.COINIFY_PAYMENT_DOMAIN} ${envConfig.WALLET_HELPER_DOMAIN} blob:`,
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
          envConfig.LEDGER_SOCKET_URL,
          envConfig.HORIZON_URL,
          envConfig.VERIFF_URL,
          'https://friendbot.stellar.org',
          'https://app-api.coinify.com',
          'https://app-api.sandbox.coinify.com',
          'https://api.sfox.com',
          'https://api.staging.sfox.com',
          'https://quotes.sfox.com',
          `https://quotes.staging.sfox.com`,
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
