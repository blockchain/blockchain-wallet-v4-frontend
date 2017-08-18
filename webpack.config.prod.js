const CleanWebpackPlugin = require('clean-webpack-plugin')

const PATHS = {
  dist: `${__dirname}/dist`,
  npm: `${__dirname}/node_modules`,
  src: `${__dirname}/src`
}

module.exports = {
  entry: {
    app: [
      PATHS.src + '/index.js'
    ]
  },
  output: {
    path: PATHS.dist,
    filename: 'index.js',
    library: '',
    libraryTarget: 'commonjs'
  },
  externals: {
    'prop-types': 'commonjs prop-types',
    'react': 'commonjs react',
    'styled-components': 'commonjs styled-components'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
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
    new CleanWebpackPlugin(['dist'], {
      root: '/',
      verbose: true,
      dry: false
    })
  ]
}
