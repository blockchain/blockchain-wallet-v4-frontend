/* eslint no-console: "off" */

'use strict'

const chalk = require('chalk')
const crypto = require(`crypto`)
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
    BACKEND_ENV,
    DISABLE_SSL,
    GENERATE_NONCE,
    MAIN_PROCESS_URL,
    NODE_ENV,
    SECURITY_PROCESS_URL,
    SERVER_HOST
  } = process.env
) => {
  const nonce = GENERATE_NONCE
    ? crypto.randomBytes(16).toString('base64')
    : undefined

  const RootCSP = ({
    api,
    mainProcess,
    root,
    securityProcess,
    webpack,
    webSocket
  }) => ({
    'base-uri': [`'self'`],
    'connect-src': [`'self'`, api, root, webpack, webSocket],
    'default-src': [`'none'`],
    'form-action': [`'none'`],
    'frame-src': [mainProcess, securityProcess],
    'img-src': [`'self'`],
    'manifest-src': [`'self'`],
    'object-src': [`'none'`],
    'script-src': [`'self'`, `'nonce-**CSP_NONCE**'`],
    'style-src': [`'nonce-**CSP_NONCE**'`]
  })

  const CSP = {
    main: MainCSP,
    root: RootCSP,
    security: SecurityCSP
  }

  const replaceNonce = string => string.replace(/\*\*CSP_NONCE\*\*/g, nonce)

  const cspToString = policy => {
    const string = Object.entries(policy)
      .map(([key, value]) => `${key} ${value.join(' ')}`)
      .join(`; `)

    return nonce ? replaceNonce(string) : string
  }

  const subdomains = {
    development: `dev`,
    staging: `staging`,
    production: `prod`,
    testnet: `prod`
  }

  const environment = BACKEND_ENV || NODE_ENV || `development`
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

  const comWalletApp =
    SERVER_HOST === `0.0.0.0`
      ? originalWalletOptions.domains.comWalletApp
      : `${protocol}://localhost:${port}`

  const serverOverrides = {
    domains: {
      comWalletApp,
      ...(MAIN_PROCESS_URL ? { mainProcess: MAIN_PROCESS_URL } : {}),
      ...(SECURITY_PROCESS_URL ? { securityProcess: SECURITY_PROCESS_URL } : {})
    }
  }

  const TERRIBLE_HACK =
    SERVER_HOST === `0.0.0.0`
      ? {
          domains: {
            mainProcess: `https://wallet-frontend-v4-main.dev.blockchain.info/`,
            securityProcess: `https://wallet-frontend-v4-security.dev.blockchain.info/`
          }
        }
      : {}

  const walletOptions = [
    originalWalletOptions,
    localOverrides,
    serverOverrides,
    TERRIBLE_HACK
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
    nonce,
    protocol
  }

  console.log(util.inspect(configuration, { colors: true }))

  const createProcessServer = async ({
    configureApp = () => {},
    domains,
    host = `localhost`,
    name,
    port: requestedPort = 0,
    self
  }) => {
    const app = express()

    const port = await new Promise(resolve => {
      const server = createServer(app)

      server.listen(requestedPort, host, () => {
        resolve(server.address().port)
      })
    })

    const url = `${protocol}://${host}:${port}`
    const csp = CSP[name]({ ...domains, self: self || url })

    app.use((request, response, next) => {
      response.set({
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy': cspToString(csp)
      })

      next()
    })

    configureApp(app)

    app.use(express.static(path.join(PATHS.ciBuild, name)))
    return url
  }

  const configureMainApp = app => {
    if (nonce) {
      app.get(`/`, async (request, response) => {
        const template = await fs.readFile(
          path.join(__dirname, `../dist/main/index.html`),
          `utf8`
        )

        response.send(replaceNonce(template))
      })
    }
  }

  const configureSecurityApp = app => {
    if (nonce) {
      app.get(`/`, async (request, response) => {
        const template = await fs.readFile(
          path.join(__dirname, `../dist/security/index.html`),
          `utf8`
        )

        response.send(replaceNonce(template))
      })
    }
  }

  const [mainProcessUrl, securityProcessUrl] = await Promise.all(
    [
      {
        configureApp: configureMainApp,
        domains,
        name: `main`,
        self: domains.mainProcess
      },
      {
        configureApp: configureSecurityApp,
        domains,
        name: `security`,
        self: domains.securityProcess
      }
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

  const configureApp = app => {
    if (domains.mainProcess && domains.securityProcess) {
      const proxy = httpProxy.createProxyServer()

      app.use(
        vhost(domains.mainProcess, (request, response) => {
          const router = express.Router()

          router.get(`/healthz`, (request, response) => {
            response.json({
              mainProcess: {
                domains,
                request: R.pick([`hostname`, `url`], request)
              }
            })
          })

          router(request, response)
          proxy.web(request, response, { target: mainProcessUrl })
        })
      )

      app.use(
        vhost(domains.securityProcess, (request, response) => {
          const router = express.Router()

          router.get(`/healthz`, (request, response) => {
            response.json({
              securityProcess: {
                domains,
                request: R.pick([`hostname`, `url`], request)
              }
            })
          })

          router(request, response)
          proxy.web(request, response, { target: securityProcessUrl })
        })
      )
    }

    if (nonce) {
      app.get(`/`, async (request, response) => {
        const template = await fs.readFile(
          path.join(__dirname, `../dist/root/index.html`),
          `utf8`
        )

        response.send(replaceNonce(template))
      })
    }

    app.get(`/healthz`, (request, response) => {
      response.json({
        'blockchain-wallet-v4-frontend': version,
        domains,
        request: R.pick([`hostname`, `url`], request)
      })
    })

    app.get(`/main.*.js`, async (request, response) => {
      const filename = request.path.slice(1)

      const template = await fs.readFile(
        path.join(__dirname, `../dist/root/${filename}`),
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

      response.type(`js`)
      response.send(index)
    })

    app.get('/Resources/wallet-options-v4.json', function (request, response) {
      response.json(walletOptions)
    })
  }

  const url = await createProcessServer({
    configureApp,
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
