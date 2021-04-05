/* eslint-disable */
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const { concat, prepend } = require('ramda')
const HtmlWebpackPlugin = require('html-webpack-plugin')
let mockWalletOptions = require('./../../../config/mocks/wallet-options-v4')
const TerserPlugin = require('terser-webpack-plugin')
const CONFIG_PATH = require('./../../../config/paths')
const Webpack = require('webpack')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const CSP_NONCE = '2726c7f26c'

// gets and logs build config
const getAndLogEnvConfig = () => {
  let envConfig = {}
  const isSslEnabled = process.env.DISABLE_SSL
    ? false
    : fs.existsSync(CONFIG_PATH.sslConfig + '/key.pem') &&
      fs.existsSync(CONFIG_PATH.sslConfig + '/cert.pem')

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
    console.log(chalk.cyan('SSL Enabled: ') + chalk.blue(isSslEnabled))
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
  mode: 'production',
  node: { fs: 'empty' },
  devtool: false,
  entry: {
    app: ['@babel/polyfill', CONFIG_PATH.src + '/index.js']
  },
  output: {
    path: CONFIG_PATH.ciBuild,
    pathinfo: false,
    chunkFilename: '[name].[chunkhash:10].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      components: path.resolve(__dirname, '../src/components/'),
      data: path.resolve(__dirname, '../src/data/'),
      layouts: path.resolve(__dirname, '../src/layouts/'),
      providers: path.resolve(__dirname, '../src/providers/'),
      services: path.resolve(__dirname, '../src/services/'),
      utils: path.resolve(__dirname, '../src/utils/')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'thread-loader', options: { workerParallelJobs: 50 } },
          'babel-loader'
        ]
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: { name: 'fonts/[name]-[hash].[ext]' }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|ico|webmanifest|xml)$/,
        use: {
          loader: 'file-loader',
          options: { name: 'img/[name].[ext]?[hash]' }
        }
      },
      {
        test: /\.(pdf)$/,
        use: {
          loader: 'file-loader',
          options: { name: 'resources/[name].[ext]?[hash]' }
        }
      },
      {
        test: /\.(AppImage|dmg|exe)$/,
        use: {
          loader: 'file-loader',
          options: { name: 'resources/[name].[ext]' }
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },
  performance: { hints: false },
  plugins: concat(
    [
      new CleanWebpackPlugin(),
      new Webpack.DefinePlugin({
        APP_VERSION: JSON.stringify(require(CONFIG_PATH.pkgJson).version),
        NETWORK_TYPE: JSON.stringify(envConfig.NETWORK_TYPE)
      }),
      new HtmlWebpackPlugin({
        template: CONFIG_PATH.src + '/index.html',
        filename: 'index.html'
      }),
      new Webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      new FaviconsWebpackPlugin({
        devMode: 'light',
        logo: CONFIG_PATH.src + '/assets/favicon.png',
        mode: 'webapp',
        prefix: 'img/favicons-[hash]/',
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
    concatenateModules: true,
    namedModules: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: { keep_fnames: true },
          mangle: { keep_fnames: true }
        },
        parallel: true
      })
    ],
    runtimeChunk: {
      name: `manifest.${new Date().getTime()}`
    },
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'initial',
          name: 'app',
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        },
        frontend: {
          chunks: 'initial',
          name: 'frontend',
          priority: -11,
          reuseExistingChunk: true,
          test: function(module) {
            return (
              module.resource &&
              module.resource.indexOf('blockchain-wallet-v4-frontend/src') !==
                -1
            )
          }
        }
      }
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
  const localhostUrl = isSslEnabled
    ? 'https://localhost:8080'
    : 'http://localhost:8080'

  return {
    cert: isSslEnabled
      ? fs.readFileSync(CONFIG_PATH.sslConfig + '/cert.pem', 'utf8')
      : '',
    contentBase: CONFIG_PATH.src,
    disableHostCheck: true,
    historyApiFallback: true,
    host: 'localhost',
    hot: useHMR,
    https: isSslEnabled,
    key: isSslEnabled
      ? fs.readFileSync(CONFIG_PATH.sslConfig + '/key.pem', 'utf8')
      : '',
    port: 8080,
    before(app) {
      app.get('/wallet-options-v4.json', function(req, res) {
        // combine wallet options base with custom environment config
        mockWalletOptions.domains = {
          api: envConfig.API_DOMAIN,
          bitpay: envConfig.BITPAY_URL,
          comRoot: envConfig.COM_ROOT,
          comWalletApp: envConfig.COM_WALLET_APP,
          everypay: envConfig.EVERYPAY_URL,
          exchange: envConfig.EXCHANGE_URL,
          horizon: envConfig.HORIZON_URL,
          ledger: localhostUrl + '/ledger', // will trigger reverse proxy
          ledgerSocket: envConfig.LEDGER_SOCKET_URL,
          root: envConfig.ROOT_URL,
          veriff: envConfig.VERIFF_URL,
          walletHelper: envConfig.WALLET_HELPER_DOMAIN,
          webSocket: envConfig.WEB_SOCKET_URL
        }

        res.json(mockWalletOptions)
      })

      app.get('/wallet-options.json', function(req, res) {
        mockWalletOptions.domains = {
          comWalletApp: localhostUrl
        }
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
    overlay: { warnings: true, errors: true },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': [
        `img-src 'self' *.googleusercontent.com *.zendesk.com data: blob:`,
        allowUnsafeScripts
          ? `script-src 'nonce-${CSP_NONCE}' 'self' 'unsafe-eval'`
          : `script-src 'nonce-${CSP_NONCE}' 'self'`,
        allowUnsafeStyles
          ? `style-src 'self' 'unsafe-inline'`
          : `style-src 'nonce-${CSP_NONCE}' 'self'`,
        `frame-src http://localhost:8081 ${envConfig.WALLET_HELPER_DOMAIN} ${envConfig.ROOT_URL} https://magic.veriff.me https://localhost:8080 http://localhost:8080`,
        `child-src ${envConfig.WALLET_HELPER_DOMAIN} blob:`,
        [
          'connect-src',
          "'self'",
          'data:',
          'ws://localhost:8080',
          'wss://localhost:8080',
          'wss://api.ledgerwallet.com',
          envConfig.API_DOMAIN,
          envConfig.EVERYPAY_URL,
          envConfig.HORIZON_URL,
          envConfig.LEDGER_SOCKET_URL,
          envConfig.LEDGER_URL,
          envConfig.ROOT_URL,
          envConfig.VERIFF_URL,
          envConfig.WALLET_HELPER_DOMAIN,
          envConfig.WEB_SOCKET_URL,
          'https://friendbot.stellar.org',
          'https://bitpay.com',
          'https://static.zdassets.com',
          'https://ekr.zdassets.com'
        ].join(' '),
        "object-src 'none'",
        "media-src 'self' https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:",
        "font-src 'self'"
      ].join('; ')
    }
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
      new HtmlReplaceWebpackPlugin([
        { pattern: '**CSP_NONCE**', replacement: CSP_NONCE }
      ]),
      extraPluginsList
    )
  }

  // build webpack config
  const webpackConfig = buildWebpackConfig(envConfig, extraPluginsList)

  // build dev server config if requested
  const devServerConfig =
    useDevServer &&
    buildDevServerConfig(
      allowUnsafeScripts,
      allowUnsafeStyles,
      envConfig,
      isSslEnabled,
      useHMR
    )

  return { devServerConfig, webpackConfig }
}
