/* eslint no-console: "off" */

'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const babelConfig = require(`./babel.config`)
const PATHS = require('../../config/paths')
const ProcessConfiguration = require(`./webpack.ci.process`)

let manifestCacheBust = new Date().getTime()
const src = path.join(__dirname, `src`)

const rootProcess = {
  mode: 'production',
  name: `root`,
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
  }
}

module.exports = () => [
  rootProcess,
  ProcessConfiguration({ manifestCacheBust, PATHS }, `main`),
  ProcessConfiguration({ manifestCacheBust, PATHS }, `security`)
]
