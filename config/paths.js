const path = require('path')
const appDirectory = `${__dirname}/../`
const resolveRoot = relativePath => path.resolve(appDirectory, relativePath)

// config after eject: we're in ./config/
module.exports = {
  appBuild: resolveRoot('lib'),
  ciBuild: resolveRoot('dist'),
  pkgJson: resolveRoot('package.json'),
  envConfig: resolveRoot('config/env'),
  sslConfig: resolveRoot('config/ssl')
}
