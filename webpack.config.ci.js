/* eslint-disable */
const path = require(`path`)
const PATHS = require('./config/paths')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const mainProcess = require(`./packages/main-process/webpack.config.ci`)
const rootProcess = require(`./packages/root-process/webpack.config.ci`)
const securityProcess = require(`./packages/security-process/webpack.config.ci`)

let envConfig = {}
let manifestCacheBust = new Date().getTime()

const common = {
  mode: 'production',
  node: {
    fs: 'empty'
  },
  stats: 'verbose',
  optimization: {
    namedModules: true,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            keep_fnames: true
          },
          mangle: {
            keep_fnames: true
          }
        },
        parallel: true,
        cache: false
      })
    ],
    concatenateModules: true,
    runtimeChunk: {
      name: `manifest.${manifestCacheBust}`
    }
  }
}

module.exports = [
  {
    ...common,
    ...rootProcess({
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `root`)
      }
    })
  },
  {
    ...common,
    ...mainProcess({
      envConfig,
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `main`)
      }
    })
  },
  {
    ...common,
    ...securityProcess({
      envConfig,
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `security`)
      }
    })
  }
]
