import SFOX from 'bitcoin-sfox-client'
import COINIFY from 'bitcoin-coinify-client'

export const sfoxService = {
  refresh: (value, delegate, options) => {
    let sfox = new SFOX(value.data.value.sfox, delegate)
    sfox.api.production = true
    sfox.api.apiKey = 'f31614a7-5074-49f2-8c2a-bfb8e55de2bd'
    return sfox
  }
}

export const coinifyService = {
  refresh: (value, delegate, options) => {
    let coinify = new COINIFY(value.data.value.coinify, delegate)
    coinify.partnerId = 1
    return coinify
  }
}
