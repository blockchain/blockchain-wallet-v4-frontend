/* eslint no-console: "off" */

'use strict'

const chalk = require('chalk')
const express = require(`express`)
const fetch = require('node-fetch')
const fs = require(`fs`).promises
const http = require(`http`)
const httpProxy = require(`http-proxy`)
const https = require(`https`)
const path = require('path')
const R = require(`ramda`)
const util = require(`util`)

const MainCSP = require(`../packages/main-process/src/utils/ContentSecurityPolicy`)
const PATHS = require('../config/paths')
const SecurityCSP = require(`../packages/security-process/src/utils/ContentSecurityPolicy`)
const { version } = require(`../package.json`)

;(async (
  {
    DISABLE_SSL,
    MAIN_PROCESS_URL,
    NODE_ENV,
    SECURITY_PROCESS_URL,
    SERVER_HOST
  } = process.env
) => {
  const RootCSP = ({
    api,
    comWalletApp,
    mainProcess,
    root,
    securityProcess,
    webpack,
    webSocket
  }) => ({
    'base-uri': [comWalletApp],
    'connect-src': [api, comWalletApp, root, webpack, webSocket],
    'default-src': [`'none'`],
    'form-action': [`'none'`],
    'frame-src': [mainProcess, securityProcess],
    'img-src': [comWalletApp],
    'manifest-src': [comWalletApp],
    'object-src': [`'none'`],
    'script-src': [comWalletApp, `'unsafe-eval'`],
    'style-src': [`'unsafe-inline'`]
  })

  const CSP = {
    main: MainCSP,
    root: RootCSP,
    security: SecurityCSP
  }

  const cspToString = policy =>
    Object.entries(policy)
      .map(([key, value]) => `${key} ${value.join(' ')}`)
      .join(`; `)

  const subdomains = {
    development: `dev`,
    staging: `staging`,
    production: `prod`,
    testnet: `prod`
  }

  const environment = NODE_ENV || `development`
  const subdomain = subdomains[environment]
  const walletOptionsUrl = `https://wallet-frontend-v4.${subdomain}.blockchain.info/Resources/wallet-options-v4.json`
  const originalWalletOptions = await (await fetch(walletOptionsUrl)).json()
  let localOverrides = {}

  try {
    localOverrides = require(path.join(PATHS.envConfig, `${environment}.js`))
  } catch {}

  let createServer = http.createServer
  let protocol = `http`

  if (!DISABLE_SSL) {
    try {
      const [cert, key] = await Promise.all(
        [(`cert.pem`, `key.pem`)].map(name =>
          fs.readFile(path.join(PATHS.sslConfig, name), `utf8`)
        )
      )

      protocol = `https`
      createServer = app => https.createServer({ cert, key }, app)
    } catch {}
  }

  const port = 8080

  const serverOverrides = {
    domains: {
      comWalletApp: `${protocol}://localhost:${port}`,
      ...(MAIN_PROCESS_URL ? { mainProcess: MAIN_PROCESS_URL } : {}),
      ...(SECURITY_PROCESS_URL ? { securityProcess: SECURITY_PROCESS_URL } : {})
    }
  }

  const walletOptions = [
    originalWalletOptions,
    localOverrides,
    serverOverrides
  ].reduce(R.mergeDeepRight)

  const { domains } = walletOptions

  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))

  const configuration = {
    domains: R.pick(
      [
        `api`,
        `mainProcess`,
        `root`,
        `securityProcess`,
        `walletHelper`,
        `webSocket`
      ],
      domains
    ),
    protocol
  }

  console.log(util.inspect(configuration, { colors: true }))

  const createProcessServer = async ({
    app = express(),
    domains,
    host = `localhost`,
    name,
    port: requestedPort = 0,
    self
  }) => {
    const port = await new Promise(resolve => {
      const server = createServer(app)

      server.listen(requestedPort, host, () => {
        resolve(server.address().port)
      })
    })

    const url = `${protocol}://${host}:${port}`
    const csp = CSP[name]({ ...domains, self: self || url })

    const setHeaders = response => {
      response.set({
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy': cspToString(csp)
      })
    }

    app.use(express.static(path.join(PATHS.ciBuild, name), { setHeaders }))
    return url
  }

  const [mainProcessUrl, securityProcessUrl] = await Promise.all(
    [
      { domains, name: `main`, self: domains.mainProcess },
      { domains, name: `security`, self: domains.securityProcess }
    ].map(createProcessServer)
  )

  const vhost = (url, middleware) => (request, response, next) => {
    const { hostname } = new URL(url)

    if (request.hostname === hostname) {
      middleware(request, response, next)
    } else {
      next()
    }
  }

  const app = express()

  app.get(`/healthz`, (request, response) => {
    response.json({ 'blockchain-wallet-v4-frontend': version })
  })

  app.get(`/index.js`, async (request, response) => {
    const template = await fs.readFile(
      path.join(__dirname, `../packages/root-process/src/index.js`),
      `utf8`
    )

    const index = template
      .replace(
        `MAIN_PROCESS_URL`,
        JSON.stringify(domains.mainProcess || mainProcessUrl)
      )
      .replace(
        `SECURITY_PROCESS_URL`,
        JSON.stringify(domains.securityProcess || securityProcessUrl)
      )

    response.send(index)
  })

  app.get('/Resources/wallet-options-v4.json', function (request, response) {
    response.json(walletOptions)
  })

  if (domains.mainProcess && domains.securityProcess) {
    const proxy = httpProxy.createProxyServer()

    app.use(
      vhost(domains.mainProcess, (request, response) => {
        proxy.web(request, response, { target: mainProcessUrl })
      })
    )

    app.use(
      vhost(domains.securityProcess, (request, response) => {
        proxy.web(request, response, { target: securityProcessUrl })
      })
    )
  }

  const url = await createProcessServer({
    app,
    domains: {
      mainProcess: mainProcessUrl,
      securityProcess: securityProcessUrl,
      ...domains
    },
    host: SERVER_HOST || `localhost`,
    name: `root`,
    port
  })

  console.log(`Server listening at ${url}`)
})().catch(console.error)
