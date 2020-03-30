/* eslint-disable */
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const webpackBuilder = require('./utils/webpackBuilder')

// get dev server config, envConfig, SSL flag and base webpack config from builder
const { devServerConfig, webpackConfig } = webpackBuilder({
  allowUnsafeScripts: false,
  allowUnsafeStyles: false,
  extraPluginsList: [
    new HtmlReplaceWebpackPlugin([
      { pattern: '**CSP_NONCE**', replacement: '2726c7f26c' }
    ])
  ],
  useDevServer: true
})

// merge configurations into one export for webpack
module.exports = {
  ...webpackConfig,
  devServer: devServerConfig
}
