import SFOX from 'bitcoin-sfox-client'
import COINIFY from 'bitcoin-coinify-client'

export const sfoxService = {
  refresh: (value, delegate, options) => {
    let sfox = new SFOX(value.data.value.sfox, delegate)
    sfox.api.apiKey = '6CD61A0E965D48A7B1883A860490DC9E' // options.platforms.web.sfox.config.apiKey
    sfox.api.production = false // options.platforms.web.sfox.config.production
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
