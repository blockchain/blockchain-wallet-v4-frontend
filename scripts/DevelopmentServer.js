'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin')
const Webpack = require('webpack')
const path = require('path')
const WebpackDevServer = require(`webpack-dev-server`)

const BabelConfig = require(`./BabelConfig.js`)
const PATHS = require('../config/paths')
const { CSP, cspToString } = require(`./ContentSecurityPolicy.js`)

const WebpackConfiguration = ({
  cspNonce,
  directory,
  name,
  port,
  protocol
}) => ({
  mode: 'development',
  name,
  node: {
    fs: 'empty'
  },
  entry: {
    app: [
      '@babel/polyfill',
      'react-hot-loader/patch',
      `webpack-dev-server/client?${protocol}://localhost:${port}`,
      'webpack/hot/only-dev-server',
      path.join(directory, 'src/index.js')
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
          { loader: 'babel-loader', options: BabelConfig(directory) }
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
      APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version)
    }),
    new HtmlWebpackPlugin({
      template: path.join(directory, 'src/index.html'),
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
    port,
    protocol,
    walletOptions
  },
  name
) => {
  const contentBase = path.join(directory, `src`)

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
      app.get(`/healthz`, (request, response) => {
        response.json({ process: name, ...configuration })
      })

      app.get('/Resources/wallet-options-v4.json', function (req, res) {
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
    overlay: {
      warnings: true,
      errors: true
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

  await Promise.all([
    startDevServer(
      {
        ...options,
        directory: path.join(__dirname, `../packages/root-process`),
        host,
        port: ports.root
      },
      `root`
    ),

    startDevServer(
      {
        ...options,
        directory: path.join(__dirname, `../packages/main-process`),
        port: ports.main
      },
      `main`
    ),

    startDevServer(
      {
        ...options,
        directory: path.join(__dirname, `../packages/security-process`),
        port: ports.security
      },
      `security`
    )
  ])
}
