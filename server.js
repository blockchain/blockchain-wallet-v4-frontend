//
// This server is used only in docker images and simulating production locally!
// The actual dev server is located in packages/blockchain-wallet-v4-frontend/webpack.config.js
//
const express = require('express')
const compression = require('compression')
const path = require('path')

let isLocal
let localWalletOptions
let environment
let rootURL
let webSocketURL
let apiDomain
let walletHelperDomain

// store configs and build server configuration
if (process.env.LOCAL_PROD) {
  // local production config
  const prodConfig = require('./config/env/production.js')
  localWalletOptions = require('./config/wallet-options.json')
  isLocal = true
  environment = 'local prod'
  rootURL = prodConfig.ROOT_URL
  webSocketURL = prodConfig.WEB_SOCKET_URL
  apiDomain = prodConfig.API_DOMAIN
  walletHelperDomain = prodConfig.WALLET_HELPER_DOMAIN
  localWalletOptions.domains = {
    'root': prodConfig.ROOT_URL,
    'api': prodConfig.API_DOMAIN,
    'webSocket': prodConfig.WEB_SOCKET_URL,
    'walletHelper': prodConfig.WALLET_HELPER_DOMAIN
  }
} else {
  // production config
  environment = process.env.ENVIRONMENT
  rootURL = process.env.ROOT_URL
  webSocketURL = process.env.WEB_SOCKET_URL
  apiDomain = process.env.API_DOMAIN
  walletHelperDomain = process.env.WALLET_HELPER_DOMAIN
}

const port = 8080
const isProduction = environment === 'production'
const iSignThisDomain = isProduction ? 'https://verify.isignthis.com/' : 'https://stage-verify.isignthis.com/'

// log server configuration
console.log('\n** Configuration **')
console.log(`Environment: ${environment}`)
console.log(`Listening Port: ${port}`)
console.log(`Root URL: ${rootURL}`)
console.log(`Web Socket URL: ${webSocketURL}`)
console.log(`API Domain: ${apiDomain}`)
console.log(`Wallet Helper Domain: ${walletHelperDomain}`)
console.log(`iSignThis Domain: ${iSignThisDomain}\n`)

// validate env configs are given
if (!port || !rootURL || !webSocketURL || !apiDomain || !walletHelperDomain) {
  throw new Error('One or more required environment variables are undefined!')
}

// configure server
let app = express()
app.disable('x-powered-by')

// register middleware
app.use(compression())
app.use(function (req, res, next) {
  let cspHeader = ([
    "img-src 'self' " + rootURL + ' data: blob: android-webview-video-poster:',
    "style-src 'self' 'unsafe-inline'",
    `child-src ${iSignThisDomain} ${walletHelperDomain} http://localhost:8081`,
    `frame-src ${iSignThisDomain} ${walletHelperDomain} http://localhost:8081`,
    "worker-src 'self' 'unsafe-eval' blob:",
    "script-src 'self' 'unsafe-eval'",
    'connect-src ' + [
      "'self'",
      rootURL,
      apiDomain,
      webSocketURL,
      walletHelperDomain,
      iSignThisDomain,
      webSocketURL.replace('/inv', '/eth/inv'),
      webSocketURL.replace('/inv', '/bch/inv'),
      'https://api.sfox.com',
      'https://shapeshift.io',
      `https://app-api.${!isProduction ? 'sandbox.' : ''}coinify.com`,
      `https://api.${isProduction ? '' : 'staging.'}sfox.com`,
      `https://quotes.${isProduction ? '' : 'staging.'}sfox.com`,
      `https://sfox-kyc${isProduction ? '' : 'test'}.s3.amazonaws.com`,
      `https://${isProduction ? 'www.' : 'sandbox.'}unocoin.${isProduction ? 'com' : 'co'}`
    ].join(' '),
    "object-src 'none'",
    "media-src 'self' https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:",
    "font-src 'self'", ''
  ]).join('; ')

  res.setHeader('content-security-policy', cspHeader)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Cache-Control', 'public, max-age=' + isLocal ? '0' : '31557600')
  next()
})

// wallet options call for local servers only
if (isLocal) {
  app.get('/Resources/wallet-options-v4.json', function (req, res) {
    res.json(localWalletOptions)
  })
}

// healthcheck
app.get('/healthz', function (req, res) {
  res.sendStatus(200)
})

// static content
app.use(express.static(path.join(__dirname, 'dist')))

// fallback to index.html file
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'), function (err) {
    if (err) {
      res.sendStatus(404)
    }
  })
})

console.log(`Express server listening on port ${port}...`)

// start server
app.listen(port)
