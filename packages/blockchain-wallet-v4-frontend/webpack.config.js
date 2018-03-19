const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const PROD = process.argv.indexOf('-p') !== -1
const ENV = PROD ? 'production' : 'development'

const PATHS = {
  build: `${__dirname}/../../build`,
  dist: `${__dirname}/../../dist`,
  src: `${__dirname}/src`
}

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      ...(PROD ? [] : [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server'
      ]),
      PATHS.src + '/index.js'
    ]
  },
  output: {
    path: PROD ? (PATHS.dist) : (PATHS.build),
    filename: 'bundle-[hash].js',
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
      (PROD ? {
        test: /\.js$/,
        use: ['babel-loader']
      } : {
        test: /\.js$/,
        include: /src|blockchain-info-components.src|blockchain-wallet-v4.src/,
        use: [
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
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    }),
    new Webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify(ENV) }
    }),
    ...(PROD ? [
      new CleanWebpackPlugin(PATHS.dist, { allowExternal: true }),
      new Webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new Webpack.optimize.UglifyJsPlugin({
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
      })
    ] : [
      new Webpack.NamedModulesPlugin(),
      new Webpack.HotModuleReplacementPlugin()
    ])
  ],
  devServer: {
    contentBase: PATHS.src,
    host: 'localhost',
    port: 8080,
    hot: !PROD,
    historyApiFallback: true,
    proxy: [
      {
        path: /\/a\/.*/,
        bypass: function (req, res, proxyOptions) { return '/index.html' }
      }
    ],
    overlay: !PROD && {
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
          'https://blockchain.info',
          'wss://ws.blockchain.info',
          'https://api.blockchain.info',
          'https://explorer.staging.blockchain.info',
          'https://api.staging.blockchain.info',
          'https://explorer.dev.blockchain.info',
          'https://api.dev.blockchain.info',
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
