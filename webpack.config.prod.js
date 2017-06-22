
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
// let ReactIntlPlugin = require('react-intl-webpack-plugin')
let ReactIntlAggregatePlugin = require('react-intl-aggregate-webpack-plugin')

const PATHS = {
  dist: `${__dirname}/dist`,
  build: `${__dirname}/build`,
  src: `${__dirname}/src`
}

module.exports = {
  entry: [
    PATHS.src + '/index.js'
  ],
  output: {
    path: PATHS.dist,
    filename: 'bundle.[hash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'npm': `${__dirname}/node_modules`,
      'fonts': `${__dirname}/src/assets/fonts`,
      'img': `${__dirname}/src/assets/img`,
      'locales': `${__dirname}/src/assets/locales`,
      'sass': `${__dirname}/src/assets/sass`,
      'components': `${__dirname}/src/components`,
      'data': `${__dirname}/src/data`,
      'middleware': `${__dirname}/src/middleware`,
      'scenes': `${__dirname}/src/scenes`,
      'services': `${__dirname}/src/services`,
      'config': `${__dirname}/src/config.js`
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            // 'cacheDirectory': false,
            // 'metadataSubscribers': [ReactIntlPlugin.metadataContextFunctionName]
          }
        }]
      },
      {
        test: /assets.*\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  'src/assets/sass/resources/**/*.scss'
                ]
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /(components|scenes).*\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]___[hash:base64:5]',
                importLoaders: 2
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  'src/assets/sass/resources/**/*.scss',
                  'node_modules/bootstrap/scss/mixins/**/*.scss'
                ]
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
            name: 'fonts/[name].[hash].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    }),
    // new ReactIntlPlugin()
    new ReactIntlAggregatePlugin({
      aggregatePattern: PATHS.src + '/../i18n/**/*.json',
      aggregateOutputDir: PATHS.src + '/../i18n/messages'
    })
  ],
  devServer: {
    contentBase: PATHS.build,
    port: 8080,
    historyApiFallback: true
  }
}
