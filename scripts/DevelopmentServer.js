'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin')
const Webpack = require('webpack')
const { join } = require('path')
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')
const WebpackDevServer = require(`webpack-dev-server`)

const BabelConfig = require(`./babel.config.js`)
const PATHS = require('../config/paths')
const { CSP, cspToString } = require(`./ContentSecurityPolicy.js`)

const WebpackConfiguration = ({
  cspNonce,
  directory,
  include,
  name,
  port,
  protocol
}) => ({
  mode: 'development',
  name,
  node: {
    fs: 'empty'
  },
  entry: [
    '@babel/polyfill',
    'react-hot-loader/patch',
    `webpack-dev-server/client?${protocol}://localhost:${port}`,
    'webpack/hot/only-dev-server',
    join(directory, 'src/index.js')
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
        test: /\.js$/,
        include,
        use: [{ loader: 'babel-loader', options: BabelConfig(null, directory) }]
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
    new UnusedFilesWebpackPlugin({
      globOptions: {
        cwd: join(directory, `src`),
        ignore: [`**/__mocks__/**`, `**/*.spec.*`, `index.prod.js`, `utils/**`]
      }
    }),
    new Webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version)
    }),
    new HtmlWebpackPlugin({
      template: join(directory, 'src/index.html'),
      filename: 'index.html'
    }),
    new HtmlWebpackStringReplacePlugin({
      '\\*\\*CSP_NONCE\\*\\*': cspNonce
    }),
    new Webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new Webpack.HotModuleReplacementPlugin()
  ]
})

const webpackifyCsp = ({ port, protocol }, csp) => {
  const webSocketProtocol = protocol === `http` ? `ws` : `wss`

  return {
    ...csp,
    'connect-src': csp[`connect-src`].concat(
      `${webSocketProtocol}://localhost:${port}`
    ),
    'script-src': csp[`script-src`].concat(`'unsafe-eval'`),

    // necessary because of HMR?  See:
    // https://github.com/webpack-contrib/style-loader/issues/306#issuecomment-414161225
    'style-src': csp[`style-src`].slice(1).concat(`'unsafe-inline'`)
  }
}

const startDevServer = async (
  {
    cspNonce,
    configuration,
    directory,
    host = `localhost`,
    httpsConfiguration: { cert, key } = {},
    include,
    port,
    protocol,
    walletOptions
  },
  name
) => {
  const contentBase = join(directory, `src`)

  const devServerOptions = {
    cert,
    contentBase,
    disableHostCheck: true,
    host,
    https: cert !== undefined,
    key,
    port,
    hot: true,
    historyApiFallback: true,
    before: app => {
      app.set(`json spaces`, 2)

      app.get(`/healthz`, (request, response) => {
        response.json({ process: name, ...configuration })
      })

      app.get('/Resources/wallet-options-v4.json', (req, res) => {
        res.json(walletOptions)
      })
    },
    proxy: {
      '/ledger': {
        target: walletOptions.domains.ledger,
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/ledger': '' }
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': cspToString(
        { nonce: cspNonce },
        webpackifyCsp({ port, protocol }, CSP(walletOptions.domains)[name])
      )
    }
  }

  const webpackConfiguration = WebpackConfiguration({
    cspNonce,
    directory,
    include,
    name,
    port,
    protocol
  })

  const compiler = Webpack(webpackConfiguration)
  const server = new WebpackDevServer(compiler, devServerOptions)
  await new Promise(resolve => server.listen(port, host, resolve))
}

module.exports = async ({
  configuration,
  cspNonce,
  host,
  httpsConfiguration,
  ports,
  protocol,
  walletOptions
}) => {
  const options = {
    configuration,
    cspNonce,
    httpsConfiguration,
    protocol,
    walletOptions
  }

  const packagesDirectory = join(__dirname, `../packages`)
  const rootDirectory = join(packagesDirectory, `root-process`)
  const mainDirectory = join(packagesDirectory, `main-process`)
  const securityDirectory = join(packagesDirectory, `security-process`)

  const commonIncludes = [
    join(packagesDirectory, `blockchain-info-components/src`),
    join(packagesDirectory, `blockchain-wallet-v4/src`)
  ]

  await Promise.all([
    startDevServer(
      {
        ...options,
        directory: rootDirectory,
        host,
        include: join(rootDirectory, `src`),
        port: ports.root
      },
      `root`
    ),

    startDevServer(
      {
        ...options,
        directory: mainDirectory,
        include: [join(mainDirectory, `src`), ...commonIncludes],
        port: ports.main
      },
      `main`
    ),

    startDevServer(
      {
        ...options,
        directory: securityDirectory,
        include: [
          join(mainDirectory, `src`),
          join(securityDirectory, `src`),
          ...commonIncludes
        ],
        port: ports.security
      },
      `security`
    )
  ])
}
