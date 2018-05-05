import SFOX from 'bitcoin-sfox-client'
import COINIFY from 'bitcoin-coinify-client'
import { path } from 'ramda'

const configPath = (partner, key) => ['platforms', 'web', partner, 'config', key]

export const sfoxService = {
  refresh: (value, delegate, options) => {
    let sfox = new SFOX(value.data.value.sfox, delegate)
    sfox.api.apiKey = path(configPath('sfox', 'apiKey'), options)
    sfox.api.production = path(configPath('sfox', 'production'), options)
    return sfox
  }
}

export const coinifyService = {
  refresh: (value, delegate, options) => {
    let coinify = new COINIFY(value.data.value.coinify, delegate)
    coinify.partnerId = path(configPath('coinify', 'partnerId'), options)
    coinify.api.sandbox = !path(configPath('coinify', 'production'), options)
    return coinify
  }
}
