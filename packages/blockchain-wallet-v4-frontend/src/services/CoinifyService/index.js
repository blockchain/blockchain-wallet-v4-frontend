import COINIFY from 'bitcoin-coinify-client'

export const coinifyService = {
  refresh: (value, options, delegate) => {
    let coinify = new COINIFY(value.data.value.coinify, delegate)
    coinify.partnerId = options.data.platforms.web.coinify.config.partnerId
    return coinify
  }
}
