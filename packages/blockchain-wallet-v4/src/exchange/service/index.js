import SFOX from 'bitcoin-sfox-client'
import COINIFY from 'bitcoin-coinify-client'
import { path } from 'ramda'

const configPath = (partner, key) => [
  'platforms',
  'web',
  partner,
  'config',
  key
]

export const sfoxService = {
  refresh: (value, delegate, options) => {
    const metadata = value.getOrFail('No metadata')
    const sfox = new SFOX(metadata.value.sfox, delegate)
    sfox.api.apiKey = path(configPath('sfox', 'apiKey'), options)
    sfox.api.production = path(configPath('sfox', 'production'), options)
    return sfox
  }
}

export const coinifyService = {
  refresh: (value, delegate, options) => {
    const metadata = value.getOrFail('No metadata')
    const coinify = new COINIFY(metadata.value.coinify, delegate)
    coinify.partnerId = path(configPath('coinify', 'partnerId'), options)
    coinify.api.sandbox = !path(configPath('coinify', 'production'), options)
    return coinify
  }
}
