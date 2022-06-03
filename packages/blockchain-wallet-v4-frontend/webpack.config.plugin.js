const { compose, dissoc, evolve, adjust, set, lensProp } = require('ramda')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const webpackBuilder = require('./webpackBuilder')
const CONFIG_PATH = require('../../config/paths')

const { devServerConfig, webpackConfig } = webpackBuilder({
  useDevServer: true,
  useHMR: true
})

// evolve base config for plugin mode and HMR
const pluginWebpackConfig = evolve(
  {
    devtool: () => 'inline-source-map',
    mode: () => 'development',
    module: {
      rules: compose(
        // edits babel-loader config
        adjust(0, rule => set(lensProp('use'), ['cache-loader', 'babel-loader'], rule)),
        // next two `adjusts`, edit the ts-loader config
        adjust(1, rule => dissoc('loader', rule)),
        adjust(1, rule => set(lensProp('use'), [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => ({
                before: [ReactRefreshTypeScript()]
              }),
              transpileOnly: true
            }
          }
        ], rule))
      )
    },
    plugins: () => [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: CONFIG_PATH.src + '/plugin.html',
        filename: 'plugin.html'
      }),
      new HtmlWebpackPlugin({
        template: CONFIG_PATH.src + '/plugin-tab.html',
        filename: 'plugin-tab.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            force: true,
            from: CONFIG_PATH.src + '/plugin',
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
      new ReactRefreshWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: CONFIG_PATH.tsConfig
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
  devServer: devServerConfig
}
