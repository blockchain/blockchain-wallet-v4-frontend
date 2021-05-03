const path = require('path')
const appDirectory = `${__dirname}/../`
const resolveRoot = relativePath => path.resolve(appDirectory, relativePath)

// config after eject: we're in ./config/
module.exports = {
  appBuild: resolveRoot('lib'),
  ciBuild: resolveRoot('dist'),
  legacyPages: resolveRoot('legacy-pages'),
  pkgJson: resolveRoot('package.json'),
  envConfig: resolveRoot('config/env'),
  src: resolveRoot('packages/blockchain-wallet-v4-frontend/src'),
  sslConfig: resolveRoot('config/ssl'),
  wellKnownConfig: resolveRoot('.well-known')
}
