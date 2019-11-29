/* eslint no-console: "off" */

'use strict'

const chalk = require('chalk')
const crypto = require(`crypto`)
const fetch = require('node-fetch')
const fs = require(`fs`).promises
const net = require(`net`)
const path = require('path')
const R = require(`ramda`)
const util = require(`util`)

const PATHS = require('../config/paths')
const { version } = require(`../package.json`)
const DevelopmentServer = require(`./DevelopmentServer`)
const ProductionServer = require(`./ProductionServer`)

const getAvailablePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on(`error`, reject)

    server.listen(() => {
      const { port } = server.address()

      server.close(() => {
        resolve(port)
      })
    })
  })

const serviceWalletSubdomains = {
  development: `login-dev`,
  staging: `login-staging`,
  production: `login`,
  testnet: `login`
}

const fetchWalletOptions = async environment => {
  const subdomain = serviceWalletSubdomains[environment]
  const url = `https://${subdomain}.blockchain.com/Resources/wallet-options-v4.json`
  return (await fetch(url)).json()
}

const mockSubdomains = {
  development: `dev`,
  staging: `staging`,
  production: `prod`
}

const getOverrides = environment => {
  try {
    return require(path.join(PATHS.envConfig, environment))
  } catch {
    return {}
  }
}

const generateWalletOptions = async ({
  environment,
  host,
  ports,
  protocol
}) => {
  const originalOptions = await fetchWalletOptions(environment)
  const mockSubdomain = mockSubdomains[environment]

  const mockServerOptions = {
    domains: {
      comWalletApp: `https://wallet-frontend-v4.${mockSubdomain}.blockchain.info`,
      mainProcess: `https://wallet-frontend-v4-main.${mockSubdomain}.blockchain.info`,
      securityProcess: `https://wallet-frontend-v4-security.${mockSubdomain}.blockchain.info`
    }
  }

  const localhostOptions =
    host === `localhost`
      ? {
          domains: {
            comWalletApp: `${protocol}://localhost:${ports.root}`,
            mainProcess: `${protocol}://localhost:${ports.main}`,
            securityProcess: `${protocol}://localhost:${ports.security}`
          }
        }
      : {}

  const overrides = getOverrides(environment)

  return [
    originalOptions,
    mockServerOptions,
    localhostOptions,
    overrides
  ].reduce(R.mergeDeepRight)
}

const getHttpsConfiguration = async ({ DISABLE_SSL }) => {
  if (!DISABLE_SSL) {
    try {
      const [cert, key] = await Promise.all(
        [`cert.pem`, `key.pem`].map(name =>
          fs.readFile(path.join(PATHS.sslConfig, name), `utf8`)
        )
      )

      return { cert, key }
    } catch {}
  }
}

const configurationDomains = [
  `api`,
  `mainProcess`,
  `root`,
  `securityProcess`,
  `walletHelper`,
  `webSocket`
]

const main = async ({
  BACKEND_ENV,
  DISABLE_SSL,
  GENERATE_NONCE,
  NODE_ENV = `development`,
  SERVER_HOST = `localhost`
}) => {
  const environment = BACKEND_ENV || NODE_ENV
  const httpsConfiguration = await getHttpsConfiguration({ DISABLE_SSL })
  const protocol = httpsConfiguration ? `https` : `http`

  const cspNonce = GENERATE_NONCE
    ? crypto.randomBytes(16).toString('base64')
    : undefined

  const ports = {
    root: 8080,
    main: await getAvailablePort(),
    security: await getAvailablePort()
  }

  const walletOptions = await generateWalletOptions({
    environment,
    host: SERVER_HOST,
    ports,
    protocol
  })

  const { domains } = walletOptions

  const configuration = {
    'blockchain-wallet-v4-frontend': version,
    cspNonce,
    domains: R.pick(configurationDomains, domains),
    protocol
  }

  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
  console.log(util.inspect(configuration, { colors: true }))

  const Server =
    NODE_ENV === `development` ? DevelopmentServer : ProductionServer

  await Server({
    configuration,
    cspNonce,
    host: SERVER_HOST,
    httpsConfiguration,
    ports,
    protocol,
    walletOptions
  })

  console.log(`Server listening at ${domains.comWalletApp}`)
}

main(process.env).catch(console.error)
