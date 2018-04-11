const express = require('express')
const compression = require('compression')
const path = require('path')

// store env configs
const port = process.env.PORT || 8080
const rootURL = process.env.ROOT_URL
const webSocketURL = process.env.WEB_SOCKET_URL
const apiDomain = process.env.API_DOMAIN
const iSignThisDomain = process.env.I_SIGN_THIS_DOMAIN
const isProduction = rootURL === 'https://blockchain.info'

// log server configuration
console.log('\n** Configuration **')
console.log(`Port: ${port}`)
console.log(`Root URL: ${rootURL}`)
console.log(`Web Socket URL: ${webSocketURL}`)
console.log(`API Domain: ${apiDomain}`)
console.log(`iSignThisDomain: ${iSignThisDomain}\n`)

// validate env configs are given
if (!port || !rootURL || !webSocketURL || !apiDomain || !iSignThisDomain) {
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
    `child-src ${iSignThisDomain} https://wallet-helper.blockchain.info http://localhost:8081`,
    `frame-src ${iSignThisDomain} https://wallet-helper.blockchain.info http://localhost:8081`,
    "worker-src 'self' 'unsafe-eval' blob:",
    "script-src 'self' 'unsafe-eval'",
    'connect-src ' + [
      "'self'",
      'ws://localhost:8080',
      rootURL,
      apiDomain,
      webSocketURL,
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
  res.setHeader('Cache-Control', 'public, max-age=31557600')
  next()
})

// wallet options call
app.get('/Resources/wallet-options.json', function (req, res) {
  res.redirect(rootURL + req.url)
})

// healthcheck
app.get('/healthz', function (req, res) {
  res.sendStatus(200)
})

// static content
app.use(express.static(path.join(__dirname, 'build')))

console.log(`Server started and listening on port ${port}.`)

// start server
app.listen(port)
