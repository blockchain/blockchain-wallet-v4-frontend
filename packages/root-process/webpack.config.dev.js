/* eslint no-console: "off" */

'use strict'

const chalk = require('chalk')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fetch = require('node-fetch')
const net = require(`net`)
const R = require(`ramda`)
const Webpack = require('webpack')
const webpackDevServer = require(`webpack-dev-server`)
const path = require('path')
const fs = require('fs')

const PATHS = require('../../config/paths')

const MainProcessWebpackConfiguration = require(`main-process/webpack.config.dev.js`)
const SecurityProcessWebpackConfiguration = require(`security-process/webpack.config.dev.js`)

const ContentSecurityPolicy = ({
  api,
  comWalletApp,
  mainProcess,
  root,
  securityProcess,
  webpack,
  webSocket
}) => ({
  'base-uri': [comWalletApp],
  'connect-src': [api, comWalletApp, root, webpack, webSocket],
  'default-src': [`'none'`],
  'form-action': [`'none'`],
  'frame-src': [mainProcess, securityProcess],
  'img-src': [comWalletApp],
  'manifest-src': [comWalletApp],
  'object-src': [`'none'`],
  'script-src': [comWalletApp, `'unsafe-eval'`],
  'style-src': [`'unsafe-inline'`]
})

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

const src = path.join(__dirname, `src`)

module.exports = async () => {
  const serverNames = {
    development: `dev`,
    staging: `staging`,
    production: `prod`,
    testnet: `prod`
  }

  const serverName = serverNames[process.env.NODE_ENV]
  const walletOptionsUrl = `https://wallet-frontend-v4.${serverName}.blockchain.info/Resources/wallet-options-v4.json`
  const originalWalletOptions = await (await fetch(walletOptionsUrl)).json()

  let manifestCacheBust = new Date().getTime()
  let localOverrides = {}

  try {
    localOverrides = require(PATHS.envConfig +
      `/${process.env.NODE_ENV}` +
      '.js')
  } catch {}

  let sslEnabled = process.env.DISABLE_SSL
    ? false
    : fs.existsSync(PATHS.sslConfig + '/key.pem') &&
      fs.existsSync(PATHS.sslConfig + '/cert.pem')

  const port = 8080
  const comWalletAppProtocol = sslEnabled ? `https` : `http`
  const webPackProtocol = sslEnabled ? `wss` : `ws`

  const serverOverrides = {
    domains: {
      comWalletApp: `${comWalletAppProtocol}://localhost:${port}`,
      webpack: `${webPackProtocol}://localhost:${port}`
    }
  }

  const walletOptions = [
    originalWalletOptions,
    localOverrides,
    serverOverrides
  ].reduce(R.mergeDeepRight)

  const { domains } = walletOptions

  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
  console.log(chalk.cyan('Root URL') + `: ${domains.root}`)
  console.log(chalk.cyan('API Domain') + `: ${domains.api}`)
  console.log(
    chalk.cyan('Wallet Helper Domain') + ': ' + chalk.blue(domains.walletHelper)
  )
  console.log(
    chalk.cyan('Web Socket URL') + ': ' + chalk.blue(domains.webSocket)
  )
  console.log(chalk.cyan('SSL Enabled: ') + chalk.blue(sslEnabled))

  const startServer = async WebpackConfiguration => {
    const port = await getAvailablePort()
    const localhostProtocol = sslEnabled ? `https` : `http`
    const localhostUrl = `${localhostProtocol}://localhost:${port}`

    const configuration = WebpackConfiguration({
      domains: walletOptions.domains,
      localhostUrl,
      manifestCacheBust,
      PATHS,
      port,
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
    mode: 'development',
    entry: [
      '@babel/polyfill',
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${port}`,
      'webpack/hot/only-dev-server',
      src + '/index.js'
    ],
    output: {
      path: PATHS.appBuild,
      chunkFilename: '[name].[chunkhash:10].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous'
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|svg|ico|webmanifest|xml)$/,
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
      new CleanWebpackPlugin(),
      new CaseSensitivePathsPlugin(),
      new HtmlWebpackPlugin({
        template: src + '/index.html',
        filename: 'index.html'
      }),
      new Webpack.DefinePlugin({
        MAIN_PROCESS_URL: `"${mainProcessUrl}"`,
        SECURITY_PROCESS_URL: `"${securityProcessUrl}"`
      }),
      new Webpack.HotModuleReplacementPlugin()
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
      contentBase: src,
      disableHostCheck: true,
      host: 'localhost',
      https: sslEnabled,
      key: sslEnabled
        ? fs.readFileSync(PATHS.sslConfig + '/key.pem', 'utf8')
        : '',
      port,
      hot: true,
      historyApiFallback: true,
      before (app) {
        app.get('/Resources/wallet-options-v4.json', function (req, res) {
          res.json(walletOptions)
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
          res.json(walletOptions)
        })
      },
      proxy: {
        '/ledger': {
          target: domains.ledger,
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
        'Content-Security-Policy': cspToString(
          ContentSecurityPolicy({
            ...domains,
            mainProcess: mainProcessUrl,
            securityProcess: securityProcessUrl
          })
        )
      }
    }
  }
}
