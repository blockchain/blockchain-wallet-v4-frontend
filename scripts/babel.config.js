'use strict'

const path = require(`path`)
const resolve = require(`resolve`)
const resolver = require(`babel-plugin-module-resolver`)

const isRelativePath = path => path.match(/^\.?\.\//)

const nodeResolve = (modulePath, basedir, extensions) => {
  try {
    return resolve.sync(modulePath, { basedir, extensions })
  } catch {
    return null
  }
}

const simpleResolve = (sourcePath, currentFile) =>
  path.resolve(path.dirname(currentFile), sourcePath)

const resolveInMainProcess = (sourcePath, currentFile) => {
  const newFile = currentFile.replace(
    `/packages/security-process/src/`,
    `/packages/main-process/src/`
  )

  return simpleResolve(sourcePath, newFile)
}

module.exports = (api, directory = process.cwd()) => {
  if (api) {
    api.cache(true)
  }

  const compilingSecurityProcess =
    path.basename(directory) === `security-process`

  const resolvePath = (sourcePath, currentFile, options) => {
    if (compilingSecurityProcess) {
      // If we're trying to resolve a relative path that doesn't exist in the
      // Security Process then look for it in the Main Process.
      if (
        isRelativePath(sourcePath) &&
        !nodeResolve(simpleResolve(sourcePath, currentFile))
      ) {
        return resolveInMainProcess(sourcePath, currentFile)
      }

      // When a file in the Main Process imports a global, make sure it resolves
      // to a global in the Main Process instead of the Security Process.
      if (currentFile.includes(`/packages/main-process/src/`)) {
        const resolved = resolver.resolvePath(sourcePath, currentFile, options)

        if (resolved && resolved.includes(`/security-process/src/`)) {
          return resolved.replace(
            `/security-process/src/`,
            `/main-process/src/`
          )
        }
      }
    }

    return resolver.resolvePath(sourcePath, currentFile, options)
  }

  const root = (compilingSecurityProcess
    ? [`src`, `../main-process/src`]
    : [`src`]
  ).map(subdirectory => path.resolve(directory, subdirectory))

  const reactIntlPlugin = [
    'react-intl',
    { messagesDir: path.resolve(directory, 'build/extractedMessages') }
  ]

  return {
    // Babel will ignore files outside the current working directory without
    // this.
    ignore: [],

    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      'babel-plugin-styled-components',
      ['module-resolver', { resolvePath, root }]
    ],

    presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],

    env: {
      development: {
        plugins: ['react-hot-loader/babel']
      },
      production: {
        plugins: [reactIntlPlugin]
      },
      test: {
        presets: ['@babel/preset-env'],
        plugins: [reactIntlPlugin]
      }
    }
  }
}
