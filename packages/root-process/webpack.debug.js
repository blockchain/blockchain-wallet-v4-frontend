/* eslint no-console: "off" */

'use strict'

const chalk = require('chalk')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const httpProxy = require(`http-proxy`)
const fetch = require('node-fetch')
const net = require(`net`)
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const R = require(`ramda`)
const util = require(`util`)
const Webpack = require('webpack')
const webpackDevServer = require(`webpack-dev-server`)
const path = require('path')
const fs = require('fs')

const babelConfig = require(`./babel.config.js`)
const PATHS = require('../../config/paths')

const MainProcessWebpackConfiguration = require(`main-process/webpack.debug.js`)
const SecurityProcessWebpackConfiguration = require(`security-process/webpack.debug.js`)

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
  const subdomains = {
    development: `dev`,
    staging: `staging`,
    production: `prod`,
    testnet: `prod`
  }

  const {
    BACKEND_ENV,
    MAIN_PROCESS_URL,
    NODE_ENV,
    SECURITY_PROCESS_URL
  } = process.env

  const subdomain = subdomains[BACKEND_ENV || NODE_ENV]
  const walletOptionsUrl = `https://wallet-frontend-v4.${subdomain}.blockchain.info/Resources/wallet-options-v4.json`
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
      webpack: `${webPackProtocol}://localhost:${port}`,
      ...(MAIN_PROCESS_URL ? { mainProcess: MAIN_PROCESS_URL } : {}),
      ...(SECURITY_PROCESS_URL ? { securityProcess: SECURITY_PROCESS_URL } : {})
    }
  }

  const walletOptions = [
    originalWalletOptions,
    localOverrides,
    serverOverrides
  ].reduce(R.mergeDeepRight)

  const { domains } = walletOptions

  const startServer = async (WebpackConfiguration, domain) => {
    const port = await getAvailablePort()
    const localhostProtocol = sslEnabled ? `https` : `http`
    const localhostUrl = `${localhostProtocol}://localhost:${port}`

    const configuration = WebpackConfiguration({
      domains: walletOptions.domains,
      localhostUrl: domain,
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
    startServer(MainProcessWebpackConfiguration, domains.mainProcess),
    startServer(SecurityProcessWebpackConfiguration, domains.securityProcess)
  ])

  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))

  console.log(
    util.inspect(
      R.pick(
        [
          `api`,
          `mainProcess`,
          `root`,
          `securityProcess`,
          `walletHelper`,
          `webSocket`
        ],
        domains
      ),
      { colors: true }
    )
  )

  console.log(chalk.cyan('SSL Enabled: ') + chalk.blue(sslEnabled))

  const vhost = (url, middleware) => (request, response, next) => {
    const { hostname } = new URL(url)

    if (request.hostname === hostname) {
      middleware(request, response, next)
    } else {
      next()
    }
  }

  const before = app => {
    if (domains.mainProcess && domains.securityProcess) {
      const proxy = httpProxy.createProxyServer()

      app.use(
        vhost(domains.mainProcess, (request, response) => {
          proxy.web(request, response, { target: mainProcessUrl })
        })
      )

      app.use(
        vhost(domains.securityProcess, (request, response) => {
          proxy.web(request, response, { target: securityProcessUrl })
        })
      )
    }

    app.get('/Resources/wallet-options-v4.json', function (req, res) {
      res.json(walletOptions)
    })

    // TODO: DEPRECATE
    // This is to locally test transferring cookies from transfer_stored_values.html
    app.get('/Resources/transfer_stored_values.html', function (req, res) {
      res.sendFile(
        path.join(__dirname, '/../../config/mocks/transfer_stored_values.html')
      )
    })

    app.get('/Resources/wallet-options.json', function (req, res) {
      res.json(walletOptions)
    })
  }

  return {
    mode: 'production',
    node: {
      fs: 'empty'
    },
    entry: ['@babel/polyfill', src + '/index.js'],
    output: {
      path: path.join(PATHS.ciBuild, `root`),
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
    performance: {
      hints: false
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CaseSensitivePathsPlugin(),
      new HtmlWebpackPlugin({
        template: src + '/index.html',
        filename: 'index.html'
      }),
      new Webpack.DefinePlugin({
        MAIN_PROCESS_URL: `"${domains.mainProcess || mainProcessUrl}"`,
        SECURITY_PROCESS_URL: `"${domains.securityProcess ||
          securityProcessUrl}"`
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
      before,
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
      port,
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
        'Content-Security-Policy': cspToString(ContentSecurityPolicy(domains))
      },
      writeToDisk: true
    }
  }
}
