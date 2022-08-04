const { compose, dissoc, evolve, adjust, set, lensProp } = require('ramda')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript')

const webpackBuilder = require('./webpackBuilder')
const CONFIG_PATH = require('../../config/paths')

// get dev server config, envConfig, SSL flag and base webpack config from builder
const { devServerConfig, webpackConfig } = webpackBuilder({
  allowUnsafeScripts: true,
  allowUnsafeStyles: true,
  extraPluginsList: [
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 4096,
        configFile: CONFIG_PATH.tsConfig
      }
    })
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
      rules: compose(
        // edits babel-loader config
        adjust(0, (rule) => set(lensProp('use'), ['cache-loader', 'babel-loader'], rule)),
        // next two `adjusts`, edit the ts-loader config
        adjust(1, (rule) => dissoc('loader', rule)),
        adjust(1, (rule) =>
          set(
            lensProp('use'),
            [
              {
                loader: 'ts-loader',
                options: {
                  getCustomTransformers: () => ({
                    before: [ReactRefreshTypeScript()]
                  }),
                  transpileOnly: true
                }
              }
            ],
            rule
          )
        )
      )
    },
    output: { path: () => CONFIG_PATH.appBuild }
  },
  webpackConfig
)

module.exports = {
  ...devWebpackConfig,
  devServer: devServerConfig
}
