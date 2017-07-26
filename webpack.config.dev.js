
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  build: `${__dirname}/build`,
  npm: `${__dirname}/node_modules`,
  src: `${__dirname}/src`
}

module.exports = {
  entry: [
    PATHS.src + '/index.js'
  ],
  output: {
    path: PATHS.build,
    filename: 'bundle.[hash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'npm': PATHS.npm,
      'img': PATHS.src + '/assets/img',
      'locales': PATHS.src + '/assets/locales',
      'sass': PATHS.src + '/assets/sass',
      'themes': PATHS.src + '/assets/themes',
      'components': PATHS.src + '/components',
      'data': PATHS.src + '/data',
      'middleware': PATHS.src + '/middleware',
      'scenes': PATHS.src + '/scenes',
      'services': PATHS.src + '/services',
      'config': PATHS.src + '/config.js'
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            'plugins': [
              ['module-resolver', {
                'root': [PATHS.src],
                'alias': {
                  'npm': PATHS.npm,
                  'img': PATHS.src + '/assets/img',
                  'locales': PATHS.src + '/assets/locales',
                  'sass': PATHS.src + '/assets/sass',
                  'components': PATHS.src + '/components',
                  'data': PATHS.src + '/data',
                  'middleware': PATHS.src + '/middleware',
                  'modals': PATHS.src + '/modals',
                  'scenes': PATHS.src + '/scenes',
                  'services': PATHS.src + '/services',
                  'config': PATHS.src + '/config.js'
                }
              }]
            ]
          }
        }]
      },
      {
        test: /assets.*\.scss|css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [ require('autoprefixer')({ browsers: 'last 2 versions' }) ],
                sourceMap: true
              }
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
          loader: 'file-loader'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: PATHS.build,
    port: 8080,
    historyApiFallback: true,
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
