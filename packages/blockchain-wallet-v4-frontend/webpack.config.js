const chalk = require('chalk')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')

const isCiBuild = !!process.env.CI_BUILD
const runBundleAnalyzer = process.env.ANALYZE
const PATHS = {
  lib: `${__dirname}/../../lib`,
  dist: `${__dirname}/../../dist`,
  src: `${__dirname}/src`,
  pkgJson: `${__dirname}/../../package.json`,
  envConfig: `${__dirname}/../../config/env/`
}
let envConfig = {}
let mockWalletOptions
let iSignThisDomain

if (!isCiBuild) {
  try {
    envConfig = require(PATHS.envConfig + process.env.NODE_ENV + '.js')
    // load, parse and log application configuration if not a CI build
    mockWalletOptions = require('./../../config/wallet-options-v4.json')
    iSignThisDomain = mockWalletOptions.platforms.web.coinify.config.iSignThisDomain
  } catch (e) {
    console.log(chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') + chalk.yellow(`Failed to load ${process.env.NODE_ENV}.js config file! Using the production config instead.\n`))
    envConfig = require(PATHS.envConfig + 'production.js')
  } finally {
    console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
    console.log(chalk.cyan('Root URL') + `: ${envConfig.ROOT_URL}`)
    console.log(chalk.cyan('API Domain') + `: ${envConfig.API_DOMAIN}`)
    console.log(chalk.cyan('Wallet Helper Domain') + ': ' + chalk.blue(envConfig.WALLET_HELPER_DOMAIN))
    console.log(chalk.cyan('Web Socket URL') + ': ' + chalk.blue(envConfig.WEB_SOCKET_URL))
  }
}

module.exports = {
  mode: isCiBuild ? 'production' : 'development',
  entry: {
    app: [
      'babel-polyfill',
      ...(isCiBuild ? [] : [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server'
      ]),
      PATHS.src + '/index.js'
    ]
  },
  output: {
    path: isCiBuild ? (PATHS.dist) : (PATHS.lib),
    chunkFilename: '[name].[chunkhash:10].js',
    publicPath: '/'
  },
  module: {
    rules: [
      (isCiBuild ? {
        test: /\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      } : {
        test: /\.js$/,
        include: /src|blockchain-info-components.src|blockchain-wallet-v4.src/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }),
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|ico|webmanifest|xml)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      },
      {
        test: /\.(pdf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'resources/[name]-[hash].[ext]'
          }
        }
      }, {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([PATHS.dist, PATHS.lib], { allowExternal: true }),
    new CaseSensitivePathsPlugin(),
    new Webpack.DefinePlugin({ APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version) }),
    new HtmlWebpackPlugin({ template: PATHS.src + '/index.html', filename: 'index.html' }),
    ...(!isCiBuild ? [ new Webpack.HotModuleReplacementPlugin() ] : []),
    ...(runBundleAnalyzer ? [new BundleAnalyzerPlugin({})] : [])
  ],
  optimization: {
    namedModules: true,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            warnings: false,
            keep_fnames: true
          },
          mangle: {
            keep_fnames: true
          },
          nameCache: null,
          toplevel: false,
          ie8: false
        },
        parallel: true,
        cache: true
      })
    ],
    concatenateModules: isCiBuild,
    runtimeChunk: {
      name: 'manifest'
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
          test: function (module) {
            // ensure other packages in mono repo don't get put into vendor bundle
            return module.resource &&
              module.resource.indexOf('blockchain-wallet-v4-frontend/src') === -1 &&
              module.resource.indexOf('node_modules/blockchain-info-components/src') === -1 &&
              module.resource.indexOf('node_modules/blockchain-wallet-v4/src') === -1
          }
        }
      }
    }
  },
  devServer: {
    contentBase: PATHS.src,
    host: 'localhost',
    port: 8080,
    hot: !isCiBuild,
    historyApiFallback: true,
    before (app) {
      app.get('/Resources/wallet-options-v4.json', function (req, res) {
        // combine wallet options base with custom environment config
        mockWalletOptions.domains = {
          'root': envConfig.ROOT_URL,
          'api': envConfig.API_DOMAIN,
          'webSocket': envConfig.WEB_SOCKET_URL,
          'walletHelper': envConfig.WALLET_HELPER_DOMAIN
        }

        res.json(mockWalletOptions)
      })
    },
    proxy: [{
      path: /\/a\/.*/,
      bypass: function (req, res, proxyOptions) {
        return '/index.html'
      }
    }],
    overlay: !isCiBuild && {
      warnings: true,
      errors: true
    },
    headers: {
      'Content-Security-Policy': isCiBuild ? [] : [
        "img-src 'self' data: blob:",
        "style-src 'self' 'unsafe-inline'",
        `frame-src ${iSignThisDomain} ${envConfig.WALLET_HELPER_DOMAIN}`,
        `child-src ${iSignThisDomain} ${envConfig.WALLET_HELPER_DOMAIN}`,
        // 'unsafe-eval' is only used by webpack for development. It should not
        // be present on production!
        "worker-src 'self' 'unsafe-eval' blob:",
        "script-src 'self' 'unsafe-eval'",
        // 'ws://localhost:8080' is only used by webpack for development and
        // should not be present on production.
        [
          'connect-src',
          "'self'",
          'ws://localhost:8080',
          envConfig.WEB_SOCKET_URL,
          envConfig.WEB_SOCKET_URL.replace('/inv', '/eth/inv'),
          envConfig.WEB_SOCKET_URL.replace('/inv', '/bch/inv'),
          envConfig.ROOT_URL,
          envConfig.API_DOMAIN,
          envConfig.WALLET_HELPER_DOMAIN,
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
          'wss://ws.testnet.blockchain.info/inv',
          'https://shapeshift.io'
        ].join(' '),
        "object-src 'none'",
        "media-src 'self' https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:",
        "font-src 'self'"
      ].join('; ')
    }
  }
}
