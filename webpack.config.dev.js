
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  dist: `${__dirname}/dist`,
  build: `${__dirname}/build`,
  src: `${__dirname}/src`,
  sass: `${__dirname}/src/sass`
}

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
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { }
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
