/* eslint-disable */
const chalk = require('chalk')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const webpackBuilder = require('./utils/webpackBuilder')
const runBundleAnalyzer = process.env.ANALYZE

let extraPluginsList = []
if (runBundleAnalyzer) {
  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
  console.log(chalk.cyan('Running Bundle Analyzer'))
  extraPluginsList = [new BundleAnalyzerPlugin()]
}

// get base webpack config from builder
const { webpackConfig } = webpackBuilder({ extraPluginsList })

module.exports = webpackConfig
