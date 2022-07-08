const { compose, evolve, adjust, set, lensProp } = require('ramda')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const webpackBuilder = require('./webpackBuilder')
const CONFIG_PATH = require('../../config/paths')

const { webpackConfig } = webpackBuilder({})

// evolve base config for plugin mode and HMR
const pluginWebpackConfig = evolve(
  {
    devtool: () => 'inline-source-map',
    module: {
      rules: compose(
        // edits babel-loader config
        adjust(0, rule => set(lensProp('use'), ['cache-loader', 'babel-loader'], rule))
      )
    },
    plugins: () => [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: CONFIG_PATH.src + '/plugin/index.html',
        filename: 'index.html'
      }),
      new HtmlWebpackPlugin({
        template: CONFIG_PATH.src + '/plugin/index-tab.html',
        filename: 'index-tab.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            force: true,
            from: CONFIG_PATH.src + '/plugin/background.js',
          },
          {
            force: true,
            from: CONFIG_PATH.src + '/plugin/manifest.json',
          },
          {
            force: true,
            from: CONFIG_PATH.src + '/plugin/popup.css',
          },
          {
            force: true,
            from: CONFIG_PATH.src + '/plugin/tab.css',
          },
          {
            force: true,
            from: CONFIG_PATH.mocksConfig,
          }
        ]
      }),
      new NodePolyfillPlugin(),
      new FaviconsWebpackPlugin({
        devMode: 'light',
        logo: CONFIG_PATH.src + '/assets/favicon.png',
        mode: 'webapp',
        prefix: 'img/favicons/',
        icons: {
          favicons: true,
        }
      }),
    ],
    output: {
      filename: () => 'app/[name].[fullhash:8].js',
      chunkFilename: () => 'app/[chunkhash:8].js',
      path: () => CONFIG_PATH.appBuild
    },
    optimization: {
      runtimeChunk: () => false
    }
  },
  webpackConfig
)

module.exports = {
  ...pluginWebpackConfig,
}
