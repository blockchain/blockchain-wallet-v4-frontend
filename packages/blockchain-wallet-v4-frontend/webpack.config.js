const chalk = require('chalk')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')
const mockWalletOptions = require('./../../config/wallet-options.json')

const isProdBuild = process.env.NODE_ENV === 'production'
const runBundleAnalyzer = process.env.ANALYZE
const PATHS = {
  build: `${__dirname}/../../build`,
  dist: `${__dirname}/../../dist`,
  src: `${__dirname}/src`,
  envConfig: `${__dirname}/../../config/env/`
}

// load, parse and log application configuration
let envConfig = {}
try {
  envConfig = require(PATHS.envConfig + process.env.NODE_ENV + '.js')
} catch (e) {
  console.log(chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') + chalk.yellow(`Failed to load ${process.env.NODE_ENV}.js config file! Using the production config instead.\n`))
  envConfig = require(PATHS.envConfig + 'production.js')
} finally {
  console.log(chalk.blue('\u{1F6A7} DEV CONFIGURATION \u{1F6A7}'))
  console.log(chalk.cyan('BLOCKCHAIN_INFO') + `: ${envConfig.BLOCKCHAIN_INFO}`)
  console.log(chalk.cyan('API_BLOCKCHAIN_INFO') + `: ${envConfig.API_BLOCKCHAIN_INFO}`)
  console.log(chalk.cyan('WEB_SOCKET_URL') + ': ' + chalk.blue(envConfig.WEB_SOCKET_URL) + '\n')
}

module.exports = {
  mode: isProdBuild ? 'production' : 'development',
  entry: {
    app: [
      'babel-polyfill',
      ...(isProdBuild ? [] : [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server'
      ]),
      PATHS.src + '/index.js'
    ]
  },
  output: {
    path: isProdBuild ? (PATHS.dist) : (PATHS.build),
    chunkFilename: '[name].[chunkhash:10].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'img': PATHS.src + '/assets/img',
      'locales': PATHS.src + '/assets/locales',
      'sass': PATHS.src + '/assets/sass',
      'components': PATHS.src + '/components',
      'config': PATHS.src + '/config',
      'data': PATHS.src + '/data',
      'layouts': PATHS.src + '/layouts',
      'middleware': PATHS.src + '/middleware',
      'modals': PATHS.src + '/modals',
      'providers': PATHS.src + '/providers',
      'scenes': PATHS.src + '/scenes',
      'services': PATHS.src + '/services',
      'store': PATHS.src + '/store',
      'themes': PATHS.src + '/themes'
    },
    symlinks: false
  },
  module: {
    rules: [
      (isProdBuild ? {
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
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-hot-loader/babel']
            }
          }
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
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash].[ext]'
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
    new CleanWebpackPlugin([PATHS.dist, PATHS.build], { allowExternal: true }),
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({ template: PATHS.src + '/index.html', filename: 'index.html' }),
    ...(!isProdBuild ? [ new Webpack.HotModuleReplacementPlugin() ] : []),
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
    concatenateModules: isProdBuild,
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
    hot: !isProdBuild,
    historyApiFallback: true,
    before (app) {
      app.get('/Resources/wallet-options.json', function (req, res) {
        // combine wallet options base with custom environment config
        mockWalletOptions.domains = {
          'root': envConfig.BLOCKCHAIN_INFO,
          'api': envConfig.API_BLOCKCHAIN_INFO,
          'webSocket': envConfig.WEB_SOCKET_URL,
          'walletHelper': 'REPLACED_BY_DEV_SERVER'
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
    overlay: !isProdBuild && {
      warnings: true,
      errors: true
    },
    headers: {
      'Content-Security-Policy': [
        "img-src 'self' data: blob:",
        "style-src 'self' 'unsafe-inline'",
        'frame-src https://verify.isignthis.com/ https://wallet-helper.blockchain.info http://localhost:8081',
        'child-src https://verify.isignthis.com/ https://wallet-helper.blockchain.info http://localhost:8081',
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
          envConfig.BLOCKCHAIN_INFO,
          envConfig.API_BLOCKCHAIN_INFO,
          'https://app-api.coinify.com',
          'https://api.sfox.com',
          'https://api.staging.sfox.com',
          'https://quotes.sfox.com',
          `https://quotes.staging.sfox.com`,
          'https://sfox-kyc.s3.amazonaws.com',
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
