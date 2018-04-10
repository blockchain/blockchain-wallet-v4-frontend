const express = require('express')
const compression = require('compression')
const path = require('path')
const mockWallet = {
  "platforms": {
    "web": {
      "application": {
        "availability": {
          "adverts": true,
          "mobile_login": true
        },
        "fraction": 1,
        "countries": "*",
        "states": "*",
        "config": {
          "announcements": ["Partial service from 16/11/2017 4:00PM to 17/11/2017 4:00PM due to SegWit2X"]
        }
      },
      "bitcoin": {
        "availability": {
          "send": true,
          "request": true,
          "history": true,
          "report": true,
          "fiat": true
        },
        "fraction": 1,
        "countries": "*",
        "states": "*",
        "config": {
          "network": "bitcoin"
        }
      },
      "buysell": {
        "availability": {
          "buy": true,
          "sell": true,
          "history": true
        },
        "fraction": 1,
        "countries": ["GB", "NL", "DE", "US"],
        "states": "*",
        "config": {}
      },
      "coinify": {
        "fraction": 1,
        "countries": ["GB", "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GF", "DE", "GI", "GR", "GP", "GG", "HU", "IS", "IE", "IM", "IT", "JE", "LV", "LI", "LT", "LU", "MT", "MQ", "YT", "MC", "NL", "NO", "PL", "PT", "RE", "BL", "MF", "PM", "SM", "SK", "SI", "ES", "SE", "CH"],
        "states": "*",
        "config": {
          "availability": true,
          "partnerId": 19,
          "iSignThisDomain": "https://stage-verify.isignthis.com",
          "surveyLinks": [
            "https://blockchain.co1.qualtrics.com/SE/?SID=SV_8pupOEQPGkXx8Kp",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_205rqJvYy7mRxnn",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_ac9wCotxdlnCzU9",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_agg8sRcpEsWbEnb",
            "https://blockchain.co1.qualtrics.com/SE/?SID=SV_1RF9VhC96M8xXh3"
          ],
          "sellSurveyLinks": [
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_56iZITjrjyMOrzL",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_9u8XxkrkiUUy6z3",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_9ysiGRC4rkMFwFv"
          ]
        }
      },
      "ethereum": {
        "availability": {
          "send": true,
          "request": true,
          "history": true,
          "fiat": true
        },
        "fraction": 1,
        "countries": "*",
        "states": "*",
        "config": {
          "network": "mainnet"
        }
      },
      "sfox": {
        "fraction": 1,
        "countries": ["US"],
        "states": ["AR", "AZ", "CA", "CO", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "MI", "MN", "MO", "MT", "NE", "NV", "OK", "PA", "SC", "SD", "TN", "TX", "VA", "WI", "WV"],
        "config": {
          "production": true,
          "availability": true,
          "apiKey": "f31614a7-5074-49f2-8c2a-bfb8e55de2bd",
          "plaid": "0b041cd9e9fbf1e7d93a0d5a39f5b9",
          "plaidEnv": "tartan",
          "siftScience": "3884e5fae5",
          "surveyLinks": [
            "https://blockchain.co1.qualtrics.com/SE/?SID=SV_bPCcv7eZgqlQSrP",
            "https://blockchain.co1.qualtrics.com/SE/?SID=SV_4HIEh5KIodM8UTP",
            "https://blockchain.co1.qualtrics.com/SE/?SID=SV_51qOIk4EXHshNFX",
            "https://blockchain.co1.qualtrics.com/SE/?SID=SV_78S6RzM5ipN66fb"
          ],
          "service_charge": {
            "US": {
              "min_tx_amount": 0,
              "max_service_charge": 100000,
              "percent": 0.02,
              "send_to_miner": true
            }
          }
        }
      },
      "shapeshift": {
        "availability": {
          "buy": true,
          "sell": true,
          "history": true
        },
        "fraction": 1,
        "countries": "*",
        "states": ["AR", "AZ", "CA", "CO", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "MI", "MN", "MO", "MT", "NE", "NV", "OK", "PA", "SC", "SD", "TN", "TX", "VA", "WI", "WV"],
        "config": {
          "apiKey": "b7a7c320c19ea3a8e276c8921bc3ff79ec064d2cd9d98ab969acc648246b4be5ab2379af704c5d3a3021c0ddf82b3e479590718847c1301e1a85331d2d2a8370",
          "upperLimit": 500,
          "surveyLinks": [
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_1MuVnVEtWhiVIQl",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_3QV1OgysGUC0hXD"
          ]
        }
      },
      "unocoin": {
        "fraction": 0,
        "countries": ["IN"],
        "states": "*",
        "config": {
          "production": "REPLACED_BY_DEV_SERVER",
          "surveyLinks": [
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_0wAlAEnwlumr4XP",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_8jmvSfjqqPzNWVn",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_25JUYJLoLoHQ5b7"
          ],
          "surveyTradeLinks": [
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_87YRZx6LVdaF4kR",
            "https://blockchain.co1.qualtrics.com/jfe/form/SV_bBDOyGwj5WOb0hL"
          ]
        }
      }
    },
    "ios": {},
    "android": {}
  },
  "domains": {
    "root": "https://blockchain.info/",
    "api": "https://api.blockchain.info/",
    "webSocket": "wss://ws.blockchain.info/inv",
    "walletHelper": "REPLACED_BY_DEV_SERVER"
  }
}


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
