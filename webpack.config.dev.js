
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    dist: `${__dirname}/dist`,
    build: `${__dirname}/build`,
    src: `${__dirname}/src`
};

module.exports = {
  entry: [
      PATHS.src + '/index.js'
  ],
  output: {
      path: PATHS.dist,
      filename: 'bundle.js',
      publicPath: '/'
  },
  resolve: {
    alias: {
      'npm': `${__dirname}/../node_modules`,
      'bower': `${__dirname}/../bower_components`,
      'assets': `${__dirname}/src/assets`,
      'components': `${__dirname}/src/components`,
      'containers': `${__dirname}/src/containers`
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: ['npm', 'bower'],
        use: [{
          loader: 'eslint-loader',
          options: {
            failOnWarning: false,
            failOnError: true
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { }
        }]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: { }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: {
            loader: 'css-loader'
          }
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: PATHS.build,
    port: 3000,
    historyApiFallback: true
  }
};
