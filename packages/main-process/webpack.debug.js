/* eslint no-console: "off" */

'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const babelConfig = require(`./babel.config.js`)

const ContentSecurityPolicy = ({
  api,
  bitpay,
  coinify,
  coinifyPaymentDomain,
  comWalletApp,
  horizon,
  i_sign_this_domain,
  ledger,
  ledgerSocket,
  localhostUrl,
  root,
  sfox_kyc_url,
  sfox_quote_url,
  sfox_url,
  shapeshift_url,
  veriff,
  walletHelper,
  webpackHttp,
  webpackWebSocket,
  webSocket
}) => ({
  'child-src': [
    coinifyPaymentDomain,
    i_sign_this_domain,
    root,
    veriff,
    walletHelper
  ],
  'connect-src': [
    api,
    bitpay,
    coinify,
    horizon,
    ledgerSocket,
    ledger,
    localhostUrl,
    root,
    sfox_kyc_url,
    sfox_quote_url,
    sfox_url,
    shapeshift_url,
    webpackHttp,
    webpackWebSocket,
    webSocket,
    'https://horizon.stellar.org',
    'https://www.unocoin.com'
  ],
  'default-src': [localhostUrl],
  'font-src': [localhostUrl],
  'form-action': [localhostUrl],
  'frame-ancestors': [comWalletApp],
  'frame-src': [
    coinifyPaymentDomain,
    i_sign_this_domain,
    root,
    veriff,
    walletHelper
  ],
  'img-src': [
    localhostUrl,
    root,
    'android-webview-video-poster:',
    'blob:',
    'data:'
  ],
  'media-src': [
    localhostUrl,
    'blob:',
    'data:',
    'https://storage.googleapis.com/bc_public_assets/',
    'mediastream:'
  ],
  'object-src': ["'none'"],
  'script-src': [localhostUrl, "'unsafe-eval'"],
  'style-src': ["'unsafe-inline'", localhostUrl],
  'worker-src': ['blob:;']
})

const cspToString = policy =>
  Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join(`; `)

const src = path.join(__dirname, `src`)

module.exports = ({
  domains,
  localhostUrl,
  manifestCacheBust,
  PATHS,
  sslEnabled
}) => {
  const webpackHttpProtocol = sslEnabled ? `https` : `http`
  const webpackUrlProtocol = sslEnabled ? `wss` : `ws`

  return {
    mode: 'production',
    node: {
      fs: 'empty'
    },
    entry: ['@babel/polyfill', src + '/index.js'],
    output: {
      path: path.join(PATHS.ciBuild, `main`),
      chunkFilename: '[name].[chunkhash:10].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            { loader: 'thread-loader', options: { workerParallelJobs: 50 } },
            { loader: 'babel-loader', options: babelConfig }
          ]
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
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
        }
      ]
    },
    performance: {
      hints: false
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CaseSensitivePathsPlugin(),
      new Webpack.DefinePlugin({
        APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version)
      }),
      new HtmlWebpackPlugin({
        template: src + '/index.html',
        filename: 'index.html'
      }),
      new Webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      new Webpack.ProgressPlugin()
    ],
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
    devServer: {
      cert: sslEnabled
        ? fs.readFileSync(PATHS.sslConfig + '/cert.pem', 'utf8')
        : '',
      contentBase: src,
      disableHostCheck: true,
      https: sslEnabled,
      key: sslEnabled
        ? fs.readFileSync(PATHS.sslConfig + '/key.pem', 'utf8')
        : '',
      liveReload: false,
      hot: false,
      historyApiFallback: true,
      proxy: {
        '/ledger': {
          target: domains.ledger,
          secure: false,
          changeOrigin: true,
          pathRewrite: { '^/ledger': '' }
        }
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy': cspToString(
          ContentSecurityPolicy({
            ...domains,
            localhostUrl,
            webpackHttp: `${webpackHttpProtocol}://localhost:8080`,
            webpackWebSocket: `${webpackUrlProtocol}://localhost:8080`
          })
        )
      },
      writeToDisk: true
    }
  }
}
