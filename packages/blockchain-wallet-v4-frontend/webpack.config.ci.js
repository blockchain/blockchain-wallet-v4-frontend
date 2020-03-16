/* eslint-disable */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Webpack = require('webpack')
const path = require('path')
const PATHS = require('./../../config/paths')

let envConfig = {}
let manifestCacheBust = new Date().getTime()
const runBundleAnalyzer = process.env.ANALYZE

module.exports = {
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      data: path.resolve(__dirname, 'src/data/'),
      layouts: path.resolve(__dirname, 'src/layouts/'),
      providers: path.resolve(__dirname, 'src/providers/'),
      services: path.resolve(__dirname, 'src/services/'),
      utils: path.resolve(__dirname, 'src/utils/')
    }
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
      { test: /\.tsx?$/, loader: 'ts-loader' },
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
        test: /\.(AppImage|dmg|exe)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'resources/[name].[ext]'
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
    new Webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version),
      NETWORK_TYPE: JSON.stringify(envConfig.NETWORK_TYPE)
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    }),
    new Webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    ...(runBundleAnalyzer ? [new BundleAnalyzerPlugin({})] : [])
  ],
  optimization: {
    concatenateModules: true,
    namedModules: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
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
    },
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'initial',
          name: 'app',
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        },
        frontend: {
          chunks: 'initial',
          name: 'frontend',
          priority: -11,
          reuseExistingChunk: true,
          test: function(module) {
            return (
              module.resource &&
              module.resource.indexOf('blockchain-wallet-v4-frontend/src') !==
                -1
            )
          }
        }
      }
    }
  }
}
