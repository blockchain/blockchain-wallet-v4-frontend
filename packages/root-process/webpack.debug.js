/* eslint no-console: "off" */

const chalk = require('chalk')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const net = require(`net`)
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')
const webpackDevServer = require(`webpack-dev-server`)
const path = require('path')
const fs = require('fs')
const PATHS = require('../../config/paths')
const mockWalletOptions = require('../../config/mocks/wallet-options-v4.json')

const MainProcessWebpackConfiguration = require(`main-process/webpack.debug.js`)
const SecurityProcessWebpackConfiguration = require(`security-process/webpack.debug.js`)

const cspToString = policy =>
  Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join(`; `)

const getAvailablePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on(`error`, reject)

    server.listen(() => {
      const { port } = server.address()

      server.close(() => {
        resolve(port)
      })
    })
  })

module.exports = async () => {
  let envConfig = {}
  let manifestCacheBust = new Date().getTime()
  let sslEnabled = process.env.DISABLE_SSL
    ? false
    : fs.existsSync(PATHS.sslConfig + '/key.pem') &&
      fs.existsSync(PATHS.sslConfig + '/cert.pem')

  const port = 8080
  const protocol = sslEnabled ? `https` : `http`
  const rootProcessUrl = `${protocol}://localhost:${port}`
  const webSocketProtocol = sslEnabled ? `wss` : `ws`
  const webSocketUrl = `${webSocketProtocol}://localhost:${port}`

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

  const startServer = async WebpackConfiguration => {
    const port = await getAvailablePort()
    const protocol = sslEnabled ? `https` : `http`
    const localhostUrl = `${protocol}://localhost:${port}`

    const configuration = WebpackConfiguration({
      envConfig,
      localhostUrl,
      manifestCacheBust,
      PATHS,
      port,
      rootProcessUrl,
      sslEnabled
    })

    const compiler = Webpack(configuration)
    const server = new webpackDevServer(compiler, configuration.devServer)
    await new Promise(resolve => server.listen(port, `localhost`, resolve))
    return localhostUrl
  }

  const [mainProcessUrl, securityProcessUrl] = await Promise.all([
    startServer(MainProcessWebpackConfiguration),
    startServer(SecurityProcessWebpackConfiguration)
  ])

  return {
    mode: 'production',
    node: {
      fs: 'empty'
    },
    entry: {
      app: ['@babel/polyfill', PATHS.src + '/index.js']
    },
    output: {
      path: PATHS.ciBuild,
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
            'babel-loader'
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
        APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version),
        NETWORK_TYPE: JSON.stringify(envConfig.NETWORK_TYPE)
      }),
      new HtmlWebpackPlugin({
        template: PATHS.src + '/index.html',
        filename: 'index.html'
      }),
      new Webpack.DefinePlugin({
        MAIN_PROCESS_URL: `"${mainProcessUrl}"`,
        SECURITY_PROCESS_URL: `"${securityProcessUrl}"`
      }),
      new Webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
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
      contentBase: PATHS.src,
      disableHostCheck: true,
      host: 'localhost',
      https: sslEnabled,
      key: sslEnabled
        ? fs.readFileSync(PATHS.sslConfig + '/key.pem', 'utf8')
        : '',
      port,
      hot: false,
      historyApiFallback: true,
      before (app) {
        app.get('/Resources/wallet-options-v4.json', function (req, res) {
          // combine wallet options base with custom environment config
          mockWalletOptions.domains = {
            api: envConfig.API_DOMAIN,
            coinify: envConfig.COINIFY_URL,
            coinifyPaymentDomain: envConfig.COINIFY_PAYMENT_DOMAIN,
            comRoot: envConfig.COM_ROOT,
            comWalletApp: envConfig.COM_WALLET_APP,
            horizon: envConfig.HORIZON_URL,
            ledger: rootProcessUrl + '/ledger', // will trigger reverse proxy
            ledgerSocket: envConfig.LEDGER_SOCKET_URL,
            root: envConfig.ROOT_URL,
            thePit: envConfig.THE_PIT_URL,
            veriff: envConfig.VERIFF_URL,
            walletHelper: envConfig.WALLET_HELPER_DOMAIN,
            webSocket: envConfig.WEB_SOCKET_URL
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
        app.get('/Resources/transfer_stored_values.html', function (req, res) {
          res.sendFile(
            path.join(
              __dirname,
              '/../../config/mocks/transfer_stored_values.html'
            )
          )
        })

        app.get('/Resources/wallet-options.json', function (req, res) {
          mockWalletOptions.domains = { comWalletApp: rootProcessUrl }
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
        'Content-Security-Policy': cspToString({
          'base-uri': [rootProcessUrl],
          'connect-src': [
            rootProcessUrl,
            webSocketUrl,
            envConfig.API_DOMAIN,
            envConfig.ROOT_URL
          ],
          'default-src': [`'none'`],
          'form-action': [`'none'`],
          'frame-src': [mainProcessUrl, securityProcessUrl],
          'img-src': [rootProcessUrl],
          'manifest-src': [rootProcessUrl],
          'object-src': [`'none'`],
          'script-src': [rootProcessUrl, `'unsafe-eval'`],
          'style-src': [`'unsafe-inline'`]
        })
      }
    }
  }
}
