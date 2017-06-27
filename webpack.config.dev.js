
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  build: `${__dirname}/build`,
  npm: `${__dirname}/node_modules`,
  src: `${__dirname}/src`
}

module.exports = {
  entry: [
    PATHS.src + '/index.js'
  ],
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'npm': PATHS.npm,
      'fonts': PATHS.src + '/assets/fonts',
      'img': PATHS.src + '/assets/img',
      'locales': PATHS.src + '/assets/locales',
      'sass': PATHS.src + '/assets/sass',
      'components': PATHS.src + '/components',
      'data': PATHS.src + '/data',
      'middleware': PATHS.src + '/middleware',
      'scenes': PATHS.src + '/scenes',
      'services': PATHS.src + '/services',
      'config': PATHS.src + '/config.js'
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
            'plugins': [
              ['module-resolver', {
                'root': [PATHS.src],
                'alias': {
                  'npm': PATHS.npm,
                  'fonts': PATHS.src + '/assets/fonts',
                  'img': PATHS.src + '/assets/img',
                  'locales': PATHS.src + '/assets/locales',
                  'sass': PATHS.src + '/assets/sass',
                  'components': PATHS.src + '/components',
                  'data': PATHS.src + '/data',
                  'middleware': PATHS.src + '/middleware',
                  'scenes': PATHS.src + '/scenes',
                  'services': PATHS.src + '/services',
                  'config': PATHS.src + '/config.js'
                }
              }]
            ]
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
                  PATHS.src + '/assets/sass/resources/**/*.scss'
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
                  PATHS.src + '/assets/sass/resources/**/*.scss',
                  PATHS.npm + '/bootstrap/scss/mixins/**/*.scss'
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
            name: 'fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
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
    port: 8080,
    historyApiFallback: true
  }
}
