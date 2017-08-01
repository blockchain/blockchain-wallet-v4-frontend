
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  build: `${__dirname}/build`,
  npm: `${__dirname}/node_modules`,
  src: `${__dirname}/src`
}

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      PATHS.src + '/index.js'
    ]
  },
  output: {
    path: PATHS.build,
    filename: 'bundle-[hash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'npm': PATHS.npm,
      'img': PATHS.src + '/assets/img',
      'locales': PATHS.src + '/assets/locales',
      'sass': PATHS.src + '/assets/sass',
      'components': PATHS.src + '/components',
      'config': PATHS.src + '/config',
      'data': PATHS.src + '/data',
      'middleware': PATHS.src + '/middleware',
      'modals': PATHS.src + '/modals',
      'scenes': PATHS.src + '/scenes',
      'services': PATHS.src + '/services',
      'store': PATHS.src + '/store',
      'themes': PATHS.src + '/themes'
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-hot-loader/babel']
            }
          }
        ]
      },
      {
        test: /assets.*\.scss|css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
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
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style-[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    }),
    new Webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify('development') }
    }),
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: PATHS.src,
    host: 'localhost',
    port: 8080,
    hot: true,
    historyApiFallback: true,
    overlay: {
      warnings: true,
      errors: true
    },
    headers: {
      'Content-Security-Policy': [
        "img-src 'self' data: blob:",
        "style-src 'self' 'unsafe-inline'",
        'frame-src https://verify.isignthis.com/ https://wallet-helper.blockchain.info',
        'child-src https://verify.isignthis.com/ https://wallet-helper.blockchain.info',
        // 'unsafe-eval' is only used by webpack for development. It should not
        // be present on production!
        "worker-src 'self' 'unsafe-eval' blob:",
        "script-src 'self' 'unsafe-eval'",
        // 'ws://localhost:8080' is only used by webpack for development and
        // should not be present on production.
        "connect-src 'self' ws://localhost:8080 https://blockchain.info wss://ws.blockchain.info https://api.blockchain.info https://app-api.coinify.com https://api.sfox.com https://quotes.sfox.com https://sfox-kyc.s3.amazonaws.com https://testnet5.blockchain.info https://api.testnet.blockchain.info",
        "object-src 'none'",
        "media-src 'self' https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:",
        "font-src 'self'"
      ].join('; ')
    }
  }
}
