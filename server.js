const express = require('express')
const compression = require('compression')
const path = require('path')
const mockWallet = require('./config/wallet-options.json')

// env config
const port = process.env.PORT || 8080
const rootURL = process.env.ROOT_URL || 'https://blockchain.info'
const webSocketURL = process.env.WEB_SOCKET_URL || 'wss://ws.blockchain.info/inv'
const apiDomain = process.env.API_DOMAIN || 'https://api.blockchain.info'
const iSignThisDomain = process.env.I_SIGN_THIS_DOMAIN || 'https://verify.isignthis.com/'
const isProduction = rootURL === 'https://blockchain.info'

let app = express()
app.disable('x-powered-by')

// middleware
app.use(compression())
app.use(express.static(path.join(__dirname, 'build')))
app.use(function (req, res, next) {
  let cspHeader = ([
    "img-src 'self' " + rootURL + ' data: blob: android-webview-video-poster:',
    // echo -n "outline: 0;" | openssl dgst -sha256 -binary | base64
    // "outline: 0;"        : ud+9... from ui-select
    // "margin-right: 10px" : 4If ... from ui-select
    // The above won't work in Chrome due to: https://bugs.chromium.org/p/chromium/issues/detail?id=571234
    // Safari throws the same error, but without suggesting an hash to whitelist.
    // Firefox appears to just allow unsafe-inline CSS
    "style-src 'self' 'uD+9kGdg1SXQagzGsu2+gAKYXqLRT/E07bh4OhgXN8Y=' '4IfJmohiqxpxzt6KnJiLmxBD72c3jkRoQ+8K5HT5K8o='",
    `child-src ${iSignThisDomain}`,
    `frame-src ${iSignThisDomain}`,
    "script-src 'self'",
    'connect-src ' + [
      "'self'",
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

app.get('/Resources/wallet-options.json', function (req, res) {
  if (process.env.local) {
    res.json(mockWallet)
  } else {
    res.redirect(rootURL + req.url)
  }
})

console.log(`Application listening on port ${port}`)
app.listen(port)
