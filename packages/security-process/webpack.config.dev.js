const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const path = require(`path`)
const Webpack = require('webpack')

const babelConfig = require(`./babel.config.js`)

const src = path.join(__dirname, `src`)

const cspToString = policy =>
  Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join(`; `)

module.exports = ({
  envConfig,
  localhostUrl,
  manifestCacheBust,
  PATHS,
  port,
  rootProcessUrl,
  sslEnabled
}) => {
  const webSocketProtocol = sslEnabled ? `wss` : `ws`
  const webSocketUrl = `${webSocketProtocol}://localhost:${port}`

  return {
    mode: 'development',
    node: {
      fs: 'empty'
    },
    entry: {
      app: [
        '@babel/polyfill',
        'react-hot-loader/patch',
        `webpack-dev-server/client?${localhostUrl}`,
        'webpack/hot/only-dev-server',
        src + '/index.js'
      ]
    },
    output: {
      path: PATHS.appBuild,
      chunkFilename: '[name].[chunkhash:10].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /src|blockchain-info-components.src|blockchain-wallet-v4.src/,
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
    plugins: [
      new CleanWebpackPlugin(),
      new CaseSensitivePathsPlugin(),
      new Webpack.DefinePlugin({
        APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version),
        NETWORK_TYPE: JSON.stringify(envConfig.NETWORK_TYPE)
      }),
      new HtmlWebpackPlugin({
        template: src + '/index.html',
        filename: 'index.html'
      }),
      new Webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      new Webpack.HotModuleReplacementPlugin(),
      new Webpack.ProgressPlugin()
    ],
    optimization: {
      namedModules: true,
      concatenateModules: false,
      runtimeChunk: {
        name: `manifest.${manifestCacheBust}`
      }
    },
    devServer: {
      cert: sslEnabled
        ? fs.readFileSync(PATHS.sslConfig + '/cert.pem', 'utf8')
        : '',
      contentBase: PATHS.src,
      disableHostCheck: true,
      host: 'localhost',
      https: sslEnabled,
      key: sslEnabled
        ? fs.readFileSync(PATHS.sslConfig + '/key.pem', 'utf8')
        : '',
      hot: true,
      historyApiFallback: true,
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
        'Content-Security-Policy': cspToString({
          'base-uri': [localhostUrl],
          'connect-src': [
            localhostUrl,
            webSocketUrl,
            envConfig.COINIFY_URL,
            envConfig.WEB_SOCKET_URL,
            envConfig.WALLET_HELPER_DOMAIN,
            envConfig.LEDGER_URL,
            envConfig.LEDGER_SOCKET_URL,
            envConfig.HORIZON_URL,
            envConfig.VERIFF_URL,
            'https://app-api.sandbox.coinify.com',
            'https://api.sfox.com',
            'https://api.staging.sfox.com',
            'https://api.testnet.blockchain.info',
            `https://bitpay.com`,
            'https://friendbot.stellar.org',
            `https://horizon.blockchain.info`,
            'https://quotes.sfox.com',
            `https://quotes.staging.sfox.com`,
            'https://sfox-kyc.s3.amazonaws.com',
            'https://sfox-kyctest.s3.amazonaws.com',
            'https://shapeshift.io',
            'https://testnet5.blockchain.info',
            `https://www.unocoin.com`,
            `wss://api.ledgerwallet.com`,
            `wss://ws.testnet.blockchain.info/inv`
          ],
          'default-src': [localhostUrl],
          'form-action': [localhostUrl],
          'frame-ancestors': [rootProcessUrl],
          'frame-src': [
            envConfig.COINIFY_PAYMENT_DOMAIN,
            envConfig.WALLET_HELPER_DOMAIN,
            envConfig.ROOT_URL,
            envConfig.VERIFF_URL,
            `https://verify.isignthis.com/`
          ],
          'img-src': [
            localhostUrl,
            `https://blockchain.info/`,
            `data:`,
            `blob:`,
            `android-webview-video-poster:`
          ],
          'media-src': [
            localhostUrl,
            `blob:`,
            `data:`,
            `mediastream:`,
            `https://storage.googleapis.com/bc_public_assets/`
          ],
          'object-src': [`'none'`],
          'script-src': [localhostUrl, `'unsafe-eval'`],
          'style-src': [localhostUrl, `'unsafe-inline'`],
          'worker-src': [`blob:`]
        })
      }
    }
  }
}
