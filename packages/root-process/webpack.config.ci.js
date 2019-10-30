/* eslint no-console: "off" */

'use strict'

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')

const babelConfig = require(`./babel.config`)
const ProcessBabelConfig = require(`./babel.process.config`)
const PATHS = require('../../config/paths')

let manifestCacheBust = new Date().getTime()
const runBundleAnalyzer = process.env.ANALYZE

const rootProcess = () => {
  const src = path.join(__dirname, `src`)

  return {
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
}

const ProcessConfiguration = name => {
  const directory = path.join(__dirname, `../${name}-process`)
  const src = path.join(directory, `src`)

  return {
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
            { loader: 'babel-loader', options: ProcessBabelConfig(directory) }
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
        template: src + '/index.html',
        filename: 'index.html'
      }),
      new Webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      new Webpack.ProgressPlugin(),
      ...(runBundleAnalyzer ? [new BundleAnalyzerPlugin({})] : [])
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
}

module.exports = [
  rootProcess,
  ProcessConfiguration(`main`),
  ProcessConfiguration(`security`)
]
