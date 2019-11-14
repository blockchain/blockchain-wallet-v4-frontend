'use strict'

const express = require(`express`)
const fs = require(`fs`).promises
const http = require(`http`)
const https = require(`https`)
const path = require('path')

const PATHS = require('../config/paths')
const { CSP, cspToString } = require(`./ContentSecurityPolicy.js`)

const replaceNonce = ({ nonce }, string) =>
  nonce ? string.replace(/\*\*CSP_NONCE\*\*/g, nonce) : nonce

const startProcessServer = async ({
  httpsConfiguration,
  host = `localhost`,
  port,
  requestListener
} = {}) => {
  const server = httpsConfiguration
    ? https.createServer(httpsConfiguration, requestListener)
    : http.createServer(requestListener)

  await new Promise(resolve => {
    server.listen(port, host, resolve)
  })
}

const renderIndex = ({ cspNonce }, processName) => async (
  request,
  response
) => {
  const template = await fs.readFile(
    path.join(__dirname, `../dist/${processName}/index.html`),
    `utf8`
  )

  response.send(replaceNonce({ nonce: cspNonce }, template))
}

const createProcessRouter = (
  { cspNonce, configuration, walletOptions },
  name
) => {
  const router = express.Router()
  const csp = CSP(walletOptions.domains)[name]
  const cspString = cspToString({ nonce: cspNonce }, csp)

  router.use((request, response, next) => {
    response.set({
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': cspString
    })

    next()
  })

  router.get(`/healthz`, (request, response) => {
    response.json({ process: name, ...configuration })
  })

  router.get(`/index.html`, renderIndex({ cspNonce }, name))

  router.get('/Resources/wallet-options-v4.json', function(request, response) {
    response.json(walletOptions)
  })

  router.use(express.static(path.join(PATHS.ciBuild, name), { index: false }))
  router.use(renderIndex({ cspNonce }, name))
  return router
}

// virtual host routing
const vhost = (url, middleware) => {
  const { host } = new URL(url)

  return (request, response, next) => {
    const { headers } = request

    // It looks like Traefik messes with the `Host` header and adds
    // `x-original-host`.
    const requestedHost = headers[`x-original-host`] || headers.host

    if (requestedHost === host) {
      middleware(request, response, next)
    } else {
      next()
    }
  }
}

const ExpressApp = options => {
  const mainRouter = createProcessRouter(options, `main`)
  const rootRouter = createProcessRouter(options, `root`)
  const securityRouter = createProcessRouter(options, `security`)

  const { mainProcess, securityProcess } = options.walletOptions.domains
  const app = express()
  app.set(`json spaces`, 2)
  app.use(vhost(mainProcess, mainRouter))
  app.use(vhost(securityProcess, securityRouter))
  app.use(rootRouter)
  return app
}

module.exports = async ({
  configuration,
  cspNonce,
  host,
  httpsConfiguration,
  ports,
  walletOptions
}) => {
  const requestListener = ExpressApp({ cspNonce, configuration, walletOptions })

  const options = {
    configuration,
    httpsConfiguration,
    requestListener,
    walletOptions
  }

  await Promise.all([
    startProcessServer({
      ...options,
      host,
      port: ports.root
    }),
    startProcessServer({ ...options, port: ports.main }),
    startProcessServer({
      ...options,
      port: ports.security
    })
  ])
}
