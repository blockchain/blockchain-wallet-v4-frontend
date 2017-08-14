
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATHS = {
  dist: `${__dirname}/dist`,
  npm: `${__dirname}/node_modules`,
  src: `${__dirname}/src/components`
}

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      PATHS.src + '/index.js'
    ]
  },
  output: {
    path: PATHS.dist,
    filename: 'bundle-[hash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'npm': PATHS.npm,
      'components': PATHS.src + '/components'
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
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
    new Webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify('production') }
    })
  ]
}
