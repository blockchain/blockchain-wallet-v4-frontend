import SFOX from 'bitcoin-sfox-client'
import COINIFY from 'bitcoin-coinify-client'

export const sfoxService = {
  refresh: (value, delegate, options) => {
    let sfox = new SFOX(value.data.value.sfox, delegate)
    sfox.api.apiKey = 'f31614a7-5074-49f2-8c2a-bfb8e55de2bd' // options.platforms.web.sfox.config.apiKey
    sfox.api.production = true // options.platforms.web.sfox.config.production
    return sfox
  }
}

export const coinifyService = {
  refresh: (value, delegate, options) => {
    let coinify = new COINIFY(value.data.value.coinify, delegate)
    coinify.partnerId = options.platforms.web.coinify.config.partnerId
    return coinify
  }
}
