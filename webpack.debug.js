/* eslint-disable */
const chalk = require('chalk')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const fs = require('fs')
const PATHS = require('./config/paths')
const mockWalletOptions = require('./config/mocks/wallet-options-v4.json')

const mainProcess = require(`./packages/main-process/webpack.debug`)
const rootProcess = require(`./packages/root-process/webpack.debug`)
const securityProcess = require(`./packages/security-process/webpack.debug`)

const iSignThisDomain =
  mockWalletOptions.platforms.web.coinify.config.iSignThisDomain
const coinifyPaymentDomain =
  mockWalletOptions.platforms.web.coinify.config.coinifyPaymentDomain

let envConfig = {}
let manifestCacheBust = new Date().getTime()
let sslEnabled = process.env.DISABLE_SSL
  ? false
  : fs.existsSync(PATHS.sslConfig + '/key.pem') &&
    fs.existsSync(PATHS.sslConfig + '/cert.pem')
let localhostUrl = sslEnabled
  ? 'https://localhost:8080'
  : 'http://localhost:8080'

const mainDomain = `main.lvh.me:8080`
const securityDomain = `security.lvh.me:8080`

try {
  envConfig = require(PATHS.envConfig + `/${process.env.NODE_ENV}` + '.js')
} catch (e) {
  console.log(
    chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') +
      chalk.yellow(
        `Failed to load ${
          process.env.NODE_ENV
        }.js config file! Using the production config instead.\n`
      )
  )
  envConfig = require(PATHS.envConfig + '/production.js')
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

const common = {
  mode: `production`,
  node: {
    fs: 'empty'
  },
  optimization: {
    namedModules: true,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            keep_fnames: true
          },
          mangle: {
            keep_fnames: true
          }
        },
        parallel: true,
        cache: false
      })
    ],
    concatenateModules: true,
    runtimeChunk: {
      name: `manifest.${manifestCacheBust}`
    }
  },
  performance: {
    hints: false
  }
}

const subdomains = [`main`, `security`]

const devServer = {
  cert: sslEnabled
    ? fs.readFileSync(PATHS.sslConfig + '/cert.pem', 'utf8')
    : '',
  contentBase: PATHS.src,
  disableHostCheck: true,
  host: 'localhost',
  https: sslEnabled,
  key: sslEnabled ? fs.readFileSync(PATHS.sslConfig + '/key.pem', 'utf8') : '',
  port: 8080,
  hot: false,
  historyApiFallback: true,
  before(app) {
    app.use((request, response, next) => {
      const [subdomain] = request.hostname.split(`.lvh.me`)

      if (subdomains.includes(subdomain)) {
        request.url = `/` + subdomain + request.url
      }

      next()
    })

    app.get('/Resources/wallet-options-v4.json', function(req, res) {
      // combine wallet options base with custom environment config
      mockWalletOptions.domains = {
        root: envConfig.ROOT_URL,
        api: envConfig.API_DOMAIN,
        webSocket: envConfig.WEB_SOCKET_URL,
        walletHelper: envConfig.WALLET_HELPER_DOMAIN,
        veriff: envConfig.VERIFF_URL,
        comWalletApp: envConfig.COM_WALLET_APP,
        comRoot: envConfig.COM_ROOT,
        ledgerSocket: envConfig.LEDGER_SOCKET_URL,
        ledger: localhostUrl + '/ledger', // will trigger reverse proxy
        horizon: envConfig.HORIZON_URL,
        coinify: envConfig.COINIFY_URL
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
        path.join(__dirname, './config/mocks/transfer_stored_values.html')
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
      `img-src ${localhostUrl} ${mainDomain} ${securityDomain} data: blob:`,
      `script-src ${localhostUrl} ${mainDomain} ${securityDomain}`,
      `style-src ${mainDomain} ${securityDomain} 'unsafe-inline'`,
      `frame-src ${iSignThisDomain} ${coinifyPaymentDomain} ${
        envConfig.WALLET_HELPER_DOMAIN
      } ${envConfig.ROOT_URL} ${mainDomain} ${securityDomain}`,
      [
        'connect-src',
        localhostUrl,
        mainDomain,
        securityDomain,
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
        'https://shapeshift.io'
      ].join(' '),
      "object-src 'none'",
      `media-src ${mainDomain} ${securityDomain} https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:`,
      `font-src ${localhostUrl} ${mainDomain} ${securityDomain}`
    ].join('; ')
  }
}

module.exports = [
  {
    ...common,
    ...rootProcess({
      localhostUrl,
      mainDomain,
      PATHS,
      securityDomain
    }),
    devServer
  },
  {
    ...common,
    ...mainProcess({
      envConfig,
      localhostUrl,
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `main`)
      }
    })
  },
  {
    ...common,
    ...securityProcess({
      envConfig,
      localhostUrl,
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `security`)
      }
    })
  }
]
