const chalk = require('chalk')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const webpackBuilder = require('./webpackBuilder')
const CONFIG_PATH = require('../../config/paths')

const runBundleAnalyzer = process.env.ANALYZE

// gets and logs build config
const getAndLogEnvConfig = () => {
  let envConfig = {}
  const isSslEnabled = process.env.DISABLE_SSL
    ? false
    : fs.existsSync(CONFIG_PATH.sslConfig + '/key.pem') &&
      fs.existsSync(CONFIG_PATH.sslConfig + '/cert.pem')

  try {
    envConfig = require(CONFIG_PATH.envConfig + `/${APP_ENV}` + '.js')
  } catch (e) {
    console.log(
      chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') +
        chalk.yellow(
          `Failed to load ${APP_ENV}.js config file! Using the production config instead.\n`
        )
    )
    envConfig = require(CONFIG_PATH.envConfig + '/production.js')
  } finally {
    console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
    console.log(chalk.cyan('Root URL') + `: ${envConfig.ROOT_URL}`)
    console.log(chalk.cyan('API Domain') + `: ${envConfig.API_DOMAIN}`)
    console.log(
      chalk.cyan('Wallet Helper Domain') + ': ' + chalk.blue(envConfig.WALLET_HELPER_DOMAIN)
    )
    console.log(chalk.cyan('Web Socket URL') + ': ' + chalk.blue(envConfig.WEB_SOCKET_URL))
    console.log(`${chalk.cyan('App Environment')}: ${chalk.blue(APP_ENV)}`)
  }

  return { envConfig, isSslEnabled }
}

let extraPluginsList = [
  new CopyWebpackPlugin({
    patterns: [
      {
        force: true,
        from: CONFIG_PATH.legacyPages,
        to: CONFIG_PATH.ciBuild + '/legacy-pages'
      },
      {
        force: true,
        from: CONFIG_PATH.wellKnownConfig,
        to: CONFIG_PATH.ciBuild + '/.well-known'
      }
    ]
  }),
  new HtmlReplaceWebpackPlugin([{ pattern: '**RECAPTCHA_KEY**', replacement: 'test' }])
]
if (runBundleAnalyzer) {
  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
  console.log(chalk.cyan('Running Bundle Analyzer'))
  extraPluginsList = [new BundleAnalyzerPlugin()]
}

// get base webpack config from builder
const { webpackConfig } = webpackBuilder({ extraPluginsList })

module.exports = webpackConfig
