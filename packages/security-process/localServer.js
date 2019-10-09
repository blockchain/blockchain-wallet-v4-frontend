/* eslint no-console: "off" */

const webpack = require(`webpack`)
const webpackDevServer = require(`webpack-dev-server`)

const WebpackConfiguration = require(`./webpack.config.dev.js`)

module.exports = async ({
  envConfig,
  manifestCacheBust,
  PATHS,
  port,
  rootProcessUrl,
  sslEnabled
}) => {
  const protocol = sslEnabled ? `https` : `http`
  const localhostUrl = `${protocol}://localhost:${port}`

  const configuration = WebpackConfiguration({
    envConfig,
    localhostUrl,
    manifestCacheBust,
    PATHS,
    port,
    rootProcessUrl,
    sslEnabled
  })

  const compiler = webpack(configuration)
  const server = new webpackDevServer(compiler, configuration.devServer)
  await new Promise(resolve => server.listen(port, `localhost`, resolve))
  return localhostUrl
}
