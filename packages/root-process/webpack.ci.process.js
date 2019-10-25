/* eslint no-console: "off" */

'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')
const path = require('path')

const babelConfig = require(`./babel.config.js`)

const src = path.join(__dirname, `src`)

module.exports = ({ manifestCacheBust, PATHS }, name) => ({
  mode: 'production',
  name,
  node: {
    fs: 'empty'
  },
  entry: ['@babel/polyfill', src + '/index.js'],
  output: {
    path: path.join(PATHS.ciBuild, name),
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
  }
})
