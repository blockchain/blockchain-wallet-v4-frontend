/* eslint-disable */
const webpackBuilder = require('./webpackBuilder')

// get dev server config, envConfig, SSL flag and base webpack config from builder
const { devServerConfig, webpackConfig } = webpackBuilder({
  allowUnsafeScripts: false,
  allowUnsafeStyles: false,
  useDevServer: true
})

// merge configurations into one export for webpack
module.exports = {
  ...webpackConfig,
  devServer: devServerConfig
}
