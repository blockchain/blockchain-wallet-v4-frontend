/* eslint-disable */
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')
const PATHS = require('./../../config/paths')

let envConfig = {}
let manifestCacheBust = new Date().getTime()

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
  stats: 'verbose',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['thread-loader', 'babel-loader']
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
    new CleanWebpackPlugin([PATHS.ciBuild], { allowExternal: true }),
    new CaseSensitivePathsPlugin(),
    new Webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version),
      NETWORK_TYPE: JSON.stringify(envConfig.NETWORK_TYPE)
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
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
            warnings: false,
            keep_fnames: true
          },
          mangle: {
            keep_fnames: true
          },
          nameCache: null,
          toplevel: false,
          ie8: false
        },
        parallel: true,
        cache: true
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
          test: function(module) {
            // ensure other packages in mono repo don't get put into vendor bundle
            return (
              module.resource &&
              module.resource.indexOf('blockchain-wallet-v4-frontend/src') ===
                -1 &&
              module.resource.indexOf(
                'node_modules/blockchain-info-components/src'
              ) === -1 &&
              module.resource.indexOf(
                'node_modules/blockchain-wallet-v4/src'
              ) === -1
            )
          }
        }
      }
    }
  }
}
