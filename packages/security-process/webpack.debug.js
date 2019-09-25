/* eslint-disable */
const babelConfig = require(`./babel.config.js`)
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')
const path = require('path')

const src = path.join(__dirname, `src`)

module.exports = ({ envConfig, localhostUrl, PATHS }) => ({
  name: `security`,
  entry: ['@babel/polyfill', path.join(src, 'index.js')],
  output: {
    path: PATHS.ciBuild,
    chunkFilename: '[name].[chunkhash:10].js',
    publicPath: localhostUrl + `/security/`,
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
  plugins: [
    new CleanWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new Webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version),
      NETWORK_TYPE: JSON.stringify(envConfig.NETWORK_TYPE)
    }),
    new HtmlWebpackPlugin({
      template: path.join(src, 'index.html'),
      filename: 'index.html'
    }),
    new Webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ]
})
