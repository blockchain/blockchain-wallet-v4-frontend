
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  build: `${__dirname}/build`,
  npm: `${__dirname}/node_modules`,
  src: `${__dirname}/src`
}

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8090',
      'webpack/hot/only-dev-server',
      PATHS.src + '/index.js'
    ]
  },
  output: {
    path: PATHS.build,
    filename: 'bundle-[hash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'npm': PATHS.npm,
      'components': PATHS.src + '/components',
      'scenes': PATHS.src + '/scenes',
      'shared': PATHS.src + '/shared'
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-hot-loader/babel']
            }
          }
        ]
      },
      {
        test: /assets.*\.scss|css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
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
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style-[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    }),
    new Webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify('development') }
    }),
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: PATHS.src,
    host: 'localhost',
    port: 8090,
    hot: true,
    historyApiFallback: true,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
