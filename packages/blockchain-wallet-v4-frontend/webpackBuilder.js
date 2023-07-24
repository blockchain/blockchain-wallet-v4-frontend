const { concat, prepend } = require('ramda')
// node
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
// webpack plugins
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const threadLoader = require('thread-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// configs
let mockWalletOptions = require('./../../config/mocks/wallet-options-v4')
const CONFIG_PATH = require('./../../config/paths')

// thread loader plugin settings
const threadLoaderSettings = {
  name: 'thread-loader-pool',
  workers: 2,
  workerParallelJobs: 50
}
threadLoader.warmup(threadLoaderSettings, ['babel-loader', 'ts-loader'])

const APP_ENV = process.env.APP_ENV_LOCAL
// csp nonce for local development
const CSP_NONCE = '2726c7f26c'

// gets and logs build config
const getAndLogEnvConfig = () => {
  let envConfig = {}
  const isSslEnabled = process.env.DISABLE_SSL
    ? false
    : fs.existsSync(CONFIG_PATH.sslConfig + '/key.pem') &&
      fs.existsSync(CONFIG_PATH.sslConfig + '/cert.pem')

  try {
    envConfig = require(CONFIG_PATH.envConfig + `/${APP_ENV}` + '.js')
  } catch (e) {
    console.log(
      chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') +
        chalk.yellow(
          `Failed to load ${APP_ENV}.js config file! Using the production config instead.\n`
        )
    )
    envConfig = require(CONFIG_PATH.envConfig + '/production.js')
  } finally {
    console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
    console.log(chalk.cyan('Root URL') + `: ${envConfig.ROOT_URL}`)
    console.log(chalk.cyan('API Domain') + `: ${envConfig.API_DOMAIN}`)
    console.log(
      chalk.cyan('Wallet Helper Domain') + ': ' + chalk.blue(envConfig.WALLET_HELPER_DOMAIN)
    )
    console.log(chalk.cyan('Web Socket URL') + ': ' + chalk.blue(envConfig.WEB_SOCKET_URL))
    console.log(`${chalk.cyan('App Environment')}: ${chalk.blue(APP_ENV)}`)
  }

  return { envConfig, isSslEnabled }
}

// builds standard webpack config
//
// IMPORTANT: if you want to add/override a config property for all webpack
// configs (local dev, ci, debug:prod), do it here.  If you want to override a config for
// local dev, edit the webpack.config.dev.js file directly.  If you want to edit a
// CI config that differs from local dev, edit the property below and then override
// the new property in the webpack.config.dev.js file.
const buildWebpackConfig = (envConfig, extraPluginsList) => ({
  devtool: false, // default is false but needs to be set so dev config can override
  entry: {
    app: [`${CONFIG_PATH.src}/index.js`]
  },
  output: {
    assetModuleFilename: 'resources/[name][ext]', // default asset path that is usually overwritten in specific modules.rules
    crossOriginLoading: 'anonymous',
    filename: '[name].[fullhash:8].js',
    path: CONFIG_PATH.ciBuild,
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../blockchain-wallet-v4/src/'),
      components: path.resolve(__dirname, 'src/components/'),
      data: path.resolve(__dirname, 'src/data/'),
      generated: path.resolve(__dirname, 'src/generated/'),
      hooks: path.resolve(__dirname, 'src/hooks/'),
      layouts: path.resolve(__dirname, 'src/layouts/'),
      middleware: path.resolve(__dirname, 'src/middleware/'),
      providers: path.resolve(__dirname, 'src/providers/'),
      services: path.resolve(__dirname, 'src/services/'),
      utils: path.resolve(__dirname, 'src/utils/')
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  mode: 'production',
  module: {
    // 👋 rule order matters as other ci/dev configs will override rules in specific list locations!
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'thread-loader', options: threadLoaderSettings }, 'babel-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name][ext]' }
      },
      {
        test: /\.(png|jpg|gif|svg|ico|webmanifest|xml)$/,
        type: 'asset/resource',
        generator: { filename: 'img/[name][ext]?[contenthash:10]' }
      },
      { test: /\.(pdf)$/, type: 'asset/resource' },
      { test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] }
    ]
  },
  performance: { hints: false }, // TODO: enable bundle size warnings in future
  plugins: concat(
    [
      new webpack.DefinePlugin({
        'process.env.FIREBASE_API_KEY': JSON.stringify(
          process.env.FIREBASE_API_KEY || envConfig.FIREBASE_API_KEY
        ),
        'process.env.FIREBASE_APP_ID': JSON.stringify(
          process.env.FIREBASE_APP_ID || envConfig.FIREBASE_APP_ID
        ),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(
          process.env.FIREBASE_MEASUREMENT_ID || envConfig.FIREBASE_MEASUREMENT_ID
        ),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
          process.env.FIREBASE_MESSAGING_SENDER_ID || envConfig.FIREBASE_MESSAGING_SENDER_ID
        ),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
          process.env.FIREBASE_PROJECT_ID || envConfig.FIREBASE_PROJECT_ID
        )
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: CONFIG_PATH.src + '/index.html',
        filename: 'index.html'
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '**APP_VERSION**',
          replacement: require(CONFIG_PATH.pkgJson).version
        },
        {
          pattern: '**RECAPTCHA_KEY**',
          replacement: process.env.CAPTCHA_KEY ? process.env.CAPTCHA_KEY : envConfig.RECAPTCHA_KEY
        },
        {
          pattern: '**SARDINE_CLIENT_ID**',
          replacement: process.env.SARDINE_CLIENT_ID
            ? process.env.SARDINE_CLIENT_ID
            : envConfig.SARDINE_CLIENT_ID
        },
        {
          pattern: '**SARDINE_ENVIRONMENT**',
          replacement: process.env.SARDINE_ENVIRONMENT
            ? process.env.SARDINE_ENVIRONMENT
            : envConfig.SARDINE_ENVIRONMENT
        }
      ]),
      new NodePolyfillPlugin(),
      new FaviconsWebpackPlugin({
        devMode: 'light',
        logo: CONFIG_PATH.src + '/assets/favicon.png',
        mode: 'webapp',
        prefix: 'img/favicons-[contenthash:10]/',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: true,
          favicons: true,
          firefox: true,
          windows: true,
          yandex: true
        }
      })
    ],
    extraPluginsList
  ),
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: { keep_fnames: true },
          mangle: { keep_fnames: true }
        }
      })
    ],
    runtimeChunk: {
      name: 'runtime'
    }
  }
})

// builds dev server config
const buildDevServerConfig = (
  allowUnsafeScripts,
  allowUnsafeStyles,
  envConfig,
  isSslEnabled,
  useHMR
) => {
  // determine config based on whether SSL is configured locally and enabled
  const localhostUrl = isSslEnabled ? 'https://localhost:8080' : 'http://localhost:8080'
  let httpsConfig = false
  if (isSslEnabled) {
    try {
      httpsConfig = {
        cert: fs.readFileSync(CONFIG_PATH.sslConfig + '/cert.pem', 'utf8'),
        key: fs.readFileSync(CONFIG_PATH.sslConfig + '/key.pem', 'utf8')
      }
      console.log(chalk.cyan('SSL: ') + chalk.blue(`enabled at ${localhostUrl}`))
    } catch (e) {
      console.log(chalk.red('SSL: ') + chalk.red('SSL was desired but certificates missing'))
    }
  } else {
    console.log(chalk.cyan('SSL: ') + chalk.blue('disabled'))
  }

  return {
    allowedHosts: 'all',
    client: {
      logging: 'info',
      overlay: { warnings: false },
      progress: true
    },
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': [
        `img-src 'self' data: blob: https:`,
        allowUnsafeScripts
          ? `script-src 'nonce-${CSP_NONCE}' 'self' 'unsafe-eval'`
          : `script-src 'nonce-${CSP_NONCE}' 'self'`,
        allowUnsafeStyles
          ? `style-src 'self' 'unsafe-inline'`
          : `style-src 'nonce-${CSP_NONCE}' 'self'`,
        `frame-src ${envConfig.WALLET_HELPER_DOMAIN} ${envConfig.ROOT_URL} https://magic.veriff.me https://www.google.com/ https://pay.google.com/ https://www.gstatic.com https://localhost:8080 http://localhost:8080 http://localhost:8081 https://api.sandbox.sardine.ai https://api.sardine.ai`,
        `child-src https://localhost:8080 http://localhost:8080 ${envConfig.WALLET_HELPER_DOMAIN} blob:`,
        `script-src-elem 'self' 'nonce-${CSP_NONCE}' https://www.googletagmanager.com https://api.sandbox.sardine.ai https://api.sardine.ai`,
        `worker-src 'self' blob:`,
        [
          'connect-src',
          "'self'",
          'data:',
          `https://firebaseinstallations.googleapis.com`,
          `https://firebaseremoteconfig.googleapis.com`,
          envConfig.API_DOMAIN,
          envConfig.HORIZON_URL,
          envConfig.ROOT_URL,
          envConfig.VERIFF_URL,
          envConfig.WALLET_HELPER_DOMAIN,
          envConfig.WEB_SOCKET_URL,
          envConfig.OPENSEA_API,
          'http://localhost:8081',
          'https://play.google.com/',
          'https://www.google-analytics.com',
          'https://api-rinkeby.etherscan.io',
          'https://friendbot.stellar.org',
          'https://bitpay.com',
          'https://static.zdassets.com',
          'https://ekr.zdassets.com',
          'ws://localhost:8080',
          'wss://localhost:8080',
          APP_ENV !== 'production' ? 'https://api.blockchain.info' : null
        ].join(' '),
        "object-src 'none'",
        "media-src 'self' https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:",
        "font-src 'self'"
      ].join('; ')
    },
    hot: useHMR,
    https: httpsConfig,
    liveReload: !useHMR,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      devServer.app.get('/wallet-options-v4.json', function (req, res) {
        // combine wallet options base with custom environment config
        mockWalletOptions.domains = {
          api: envConfig.API_DOMAIN,
          bitpay: envConfig.BITPAY_URL,
          comRoot: envConfig.COM_ROOT,
          comWalletApp: localhostUrl,
          exchange: envConfig.EXCHANGE_URL,
          horizon: envConfig.HORIZON_URL,
          opensea: envConfig.OPENSEA_API,
          root: envConfig.ROOT_URL,
          veriff: envConfig.VERIFF_URL,
          walletHelper: envConfig.WALLET_HELPER_DOMAIN,
          webSocket: envConfig.WEB_SOCKET_URL
        }

        res.json(mockWalletOptions)
      })

      devServer.app.get('/wallet-options.json', function (req, res) {
        mockWalletOptions.domains = {
          comWalletApp: localhostUrl
        }
        res.json(mockWalletOptions)
      })

      return middlewares
    },
    port: 8080
  }
}

module.exports = ({
  allowUnsafeScripts = false,
  allowUnsafeStyles = false,
  extraPluginsList = [],
  useDevServer = false,
  useHMR = false
}) => {
  // build env config and determine SSL status
  const { envConfig, isSslEnabled } = getAndLogEnvConfig()

  // add CSP nonce support if using local dev server
  if (useDevServer) {
    extraPluginsList = prepend(
      new HtmlReplaceWebpackPlugin([{ pattern: '**CSP_NONCE**', replacement: CSP_NONCE }]),
      extraPluginsList
    )
  }

  // build webpack config
  const webpackConfig = buildWebpackConfig(envConfig, extraPluginsList)

  // build dev server config if requested
  const devServerConfig =
    useDevServer &&
    buildDevServerConfig(allowUnsafeScripts, allowUnsafeStyles, envConfig, isSslEnabled, useHMR)

  return { devServerConfig, webpackConfig }
}
