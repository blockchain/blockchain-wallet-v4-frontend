/* eslint-disable */
const Webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { evolve, update } = require('ramda')

const webpackBuilder = require('./webpackBuilder')
const CONFIG_PATH = require('../../config/paths')

// get dev server config, envConfig, SSL flag and base webpack config from builder
const { devServerConfig, webpackConfig } = webpackBuilder({
  allowUnsafeScripts: true,
  allowUnsafeStyles: true,
  extraPluginsList: [
    new CaseSensitivePathsPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ],
  useDevServer: true,
  useHMR: true
})

// evolve base config for fast dev mode and HMR
//
// IMPORTANT: if you want to add/override a base config property for only the local
// dev config, do it here! If you want to change something for all webpack
// configs (local dev, ci, debug:prod), then edit the config returned from buildWebpackConfig
const devWebpackConfig = evolve(
  {
    devtool: () => 'inline-source-map',
    mode: () => 'development',
    module: {
      rules: update(0, {
        test: /\.js$/,
        include: /src|blockchain-info-components.src|blockchain-wallet-v4.src/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 8, // number of cores on intel i5
              workerParallelJobs: 32,
              workerNodeArgs: ['--max-old-space-size=2048'],
              poolRespawn: false,
              poolParallelJobs: 32
            }
          },
          'babel-loader'
        ]
      })
    },
    output: { path: () => CONFIG_PATH.appBuild },
    optimization: {
      concatenateModules: () => false,
      splitChunks: {
        cacheGroups: {
          frontend: {
            test: () =>
              function(module) {
                return (
                  module.resource &&
                  module.resource.indexOf(
                    'blockchain-wallet-v4-frontend/src'
                  ) === -1
                )
              }
          }
        }
      }
    }
  },
  webpackConfig
)

// merge configurations into one export for webpack
module.exports = {
  ...devWebpackConfig,
  devServer: devServerConfig
}
